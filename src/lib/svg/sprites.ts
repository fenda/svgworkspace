import { assertBrowser } from "../browser/assert-browser";
import { parseDimensionAttribute, parseViewBox } from "./viewbox";
import type {
  SvgSpriteDefinition,
  SvgSpriteResources,
  SvgSymbolElementCounts,
  SvgSymbolPreview,
} from "./types";

const SHAPE_SELECTORS = [
  "circle",
  "rect",
  "ellipse",
  "polygon",
  "polyline",
  "line",
].join(",");

const REFERENCEABLE_DEF_TAGS = new Set([
  "clippath",
  "filter",
  "lineargradient",
  "marker",
  "mask",
  "pattern",
  "radialgradient",
  "symbol",
]);

const URL_REFERENCE_PATTERN = /url\((['"]?)#([^)'" ]+)\1\)/g;
const HASH_REFERENCE_PATTERN = /^#(.+)$/;
const GENERIC_HASH_REFERENCE_PATTERN = /#([A-Za-z_][\w:.-]*)/g;
export type SpriteScalabilitySummary = {
  isSpriteContainer: boolean;
  totalSymbols: number;
  symbolsWithValidViewBox: number;
  symbolsMissingUsableViewBox: number;
};

export type SpriteSortMode = "original" | "alphabetical" | "recent";

export type StandaloneSpriteSymbolResult = {
  markup: string | null;
  warnings: string[];
  filename: string;
};

export type SvgSpriteData = {
  symbols: SvgSymbolPreview[];
  resources: SvgSpriteResources | null;
};

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(value);
}

function escapeAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("\"", "&quot;");
}

function serializeNodes(nodes: Iterable<Node>, serializer: XMLSerializer): string {
  return Array.from(nodes, (node) => serializer.serializeToString(node)).join("");
}

function getSharedNamespaceAttributes(svg: SVGSVGElement): string {
  const attributes = Array.from(svg.attributes).filter(
    (attribute) => attribute.name === "xmlns" || attribute.name.startsWith("xmlns:"),
  );

  if (attributes.length === 0) {
    return 'xmlns="http://www.w3.org/2000/svg"';
  }

  return attributes
    .map((attribute) => `${attribute.name}="${escapeAttribute(attribute.value)}"`)
    .join(" ");
}

function getStyleBlocks(svg: SVGSVGElement, serializer: XMLSerializer): string[] {
  return Array.from(svg.children)
    .filter((child) => child.tagName.toLowerCase() === "style")
    .map((style) => serializer.serializeToString(style));
}

function collectReferencesFromValue(
  value: string,
  knownIds: Set<string>,
): { known: Set<string>; unresolved: Set<string> } {
  const known = new Set<string>();
  const unresolved = new Set<string>();
  const trimmed = value.trim();

  if (!trimmed) {
    return { known, unresolved };
  }

  for (const match of trimmed.matchAll(URL_REFERENCE_PATTERN)) {
    const id = match[2]?.trim();

    if (!id) {
      continue;
    }

    if (knownIds.has(id)) {
      known.add(id);
    } else {
      unresolved.add(id);
    }
  }

  const hashReference = trimmed.match(HASH_REFERENCE_PATTERN)?.[1]?.trim();

  if (hashReference) {
    if (knownIds.has(hashReference)) {
      known.add(hashReference);
    } else {
      unresolved.add(hashReference);
    }
  }

  for (const match of trimmed.matchAll(GENERIC_HASH_REFERENCE_PATTERN)) {
    const id = match[1]?.trim();

    if (!id || known.has(id) || unresolved.has(id)) {
      continue;
    }

    if (knownIds.has(id)) {
      known.add(id);
    }
  }

  return { known, unresolved };
}

function collectReferencesFromSubtree(
  root: Element,
  knownIds: Set<string>,
): { known: Set<string>; unresolved: Set<string> } {
  const known = new Set<string>();
  const unresolved = new Set<string>();
  const elements = [root, ...Array.from(root.querySelectorAll("*"))];

  elements.forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      const references = collectReferencesFromValue(attribute.value, knownIds);

      references.known.forEach((id) => known.add(id));
      references.unresolved.forEach((id) => unresolved.add(id));
    });

    if (element.tagName.toLowerCase() === "style") {
      const references = collectReferencesFromValue(element.textContent ?? "", knownIds);

      references.known.forEach((id) => known.add(id));
      references.unresolved.forEach((id) => unresolved.add(id));
    }
  });

  return { known, unresolved };
}

function hasStyleUsage(element: Element): boolean {
  const elements = [element, ...Array.from(element.querySelectorAll("*"))];

  return elements.some((node) => {
    return (
      node.hasAttribute("class") ||
      node.hasAttribute("style") ||
      node.tagName.toLowerCase() === "style"
    );
  });
}

function getDefinitionEntries(
  svg: SVGSVGElement,
  serializer: XMLSerializer,
): SvgSpriteDefinition[] {
  const provisionalEntries = Array.from(svg.querySelectorAll("defs"))
    .flatMap((defs) =>
      Array.from(defs.children).filter((child) => {
        const tagName = child.tagName.toLowerCase();

        return (
          REFERENCEABLE_DEF_TAGS.has(tagName) &&
          Boolean(child.getAttribute("id"))
        );
      }),
    )
    .map((element) => ({
      id: element.getAttribute("id")!,
      kind: element.tagName.toLowerCase(),
      markup: serializer.serializeToString(element),
      element,
    }));

  const knownIds = new Set(provisionalEntries.map((entry) => entry.id));

  return provisionalEntries.map((entry) => {
    const references = collectReferencesFromSubtree(entry.element, knownIds);

    return {
      id: entry.id,
      kind: entry.kind,
      markup: entry.markup,
      references: Array.from(references.known),
      hasStyleUsage: hasStyleUsage(entry.element),
    };
  });
}

export function resolveSpriteViewBox(input: {
  viewBox: string | null;
  width: string | null;
  height: string | null;
}): string | null {
  const rawViewBox = input.viewBox?.trim() ?? "";
  const parsedViewBox = parseViewBox(rawViewBox || null);

  if (parsedViewBox) {
    return rawViewBox;
  }

  const width = parseDimensionAttribute(input.width);
  const height = parseDimensionAttribute(input.height);

  if (width === null || height === null) {
    return null;
  }

  return `0 0 ${formatNumber(width)} ${formatNumber(height)}`;
}

function formatEstimatedDimensions(viewBox: string | null): string | null {
  const parsedViewBox = parseViewBox(viewBox);

  if (!parsedViewBox) {
    return null;
  }

  return `${formatNumber(parsedViewBox.width)} × ${formatNumber(parsedViewBox.height)}`;
}

export function createSpriteSymbolPreview(
  input: {
    key?: string;
    index?: number;
    id: string | null;
    title?: string | null;
    desc?: string | null;
    viewBox: string | null;
    width: string | null;
    height: string | null;
    childMarkup: string;
    elementCounts: SvgSymbolElementCounts;
    preserveAspectRatio?: string | null;
    referencedDefinitionIds?: string[];
    unresolvedReferenceIds?: string[];
    hasSharedDefinitionReferences?: boolean;
    hasStyleUsage?: boolean;
    hasSharedStyleUsage?: boolean;
    usesGradients?: boolean;
    usesClipPaths?: boolean;
    usesMasks?: boolean;
    usesFilters?: boolean;
    usesMarkers?: boolean;
    unavailableReason?: string | null;
  },
  sharedMarkup = "",
  namespaceAttributes = 'xmlns="http://www.w3.org/2000/svg"',
): SvgSymbolPreview {
  const childMarkup = input.childMarkup.trim();
  const resolvedViewBox = resolveSpriteViewBox(input);

  if (!childMarkup) {
    return {
      key: input.key ?? input.id?.trim() ?? `symbol-${input.index ?? 0}`,
      index: input.index ?? 0,
      id: input.id,
      title: input.title ?? null,
      desc: input.desc ?? null,
      viewBox: resolvedViewBox,
      width: input.width,
      height: input.height,
      estimatedDimensions: formatEstimatedDimensions(resolvedViewBox),
      childMarkup,
      previewMarkup: null,
      previewUnavailableReason:
        input.unavailableReason ?? "This symbol does not contain previewable content.",
      elementCounts: input.elementCounts,
      referencedDefinitionIds: input.referencedDefinitionIds ?? [],
      unresolvedReferenceIds: input.unresolvedReferenceIds ?? [],
      hasSharedDefinitionReferences: input.hasSharedDefinitionReferences ?? false,
      hasStyleUsage: input.hasStyleUsage ?? false,
      hasSharedStyleUsage: input.hasSharedStyleUsage ?? false,
      usesGradients: input.usesGradients ?? false,
      usesClipPaths: input.usesClipPaths ?? false,
      usesMasks: input.usesMasks ?? false,
      usesFilters: input.usesFilters ?? false,
      usesMarkers: input.usesMarkers ?? false,
    };
  }

  if (!resolvedViewBox) {
    return {
      key: input.key ?? input.id?.trim() ?? `symbol-${input.index ?? 0}`,
      index: input.index ?? 0,
      id: input.id,
      title: input.title ?? null,
      desc: input.desc ?? null,
      viewBox: null,
      width: input.width,
      height: input.height,
      estimatedDimensions: null,
      childMarkup,
      previewMarkup: null,
      previewUnavailableReason:
        "Preview unavailable because this symbol has no usable viewBox or dimensions.",
      elementCounts: input.elementCounts,
      referencedDefinitionIds: input.referencedDefinitionIds ?? [],
      unresolvedReferenceIds: input.unresolvedReferenceIds ?? [],
      hasSharedDefinitionReferences: input.hasSharedDefinitionReferences ?? false,
      hasStyleUsage: input.hasStyleUsage ?? false,
      hasSharedStyleUsage: input.hasSharedStyleUsage ?? false,
      usesGradients: input.usesGradients ?? false,
      usesClipPaths: input.usesClipPaths ?? false,
      usesMasks: input.usesMasks ?? false,
      usesFilters: input.usesFilters ?? false,
      usesMarkers: input.usesMarkers ?? false,
    };
  }

  const preserveAspectRatioAttribute = input.preserveAspectRatio?.trim()
    ? ` preserveAspectRatio="${escapeAttribute(input.preserveAspectRatio.trim())}"`
    : "";

  return {
    key: input.key ?? input.id?.trim() ?? `symbol-${input.index ?? 0}`,
    index: input.index ?? 0,
    id: input.id,
    title: input.title ?? null,
    desc: input.desc ?? null,
    viewBox: resolvedViewBox,
    width: input.width,
    height: input.height,
    estimatedDimensions: formatEstimatedDimensions(resolvedViewBox),
    childMarkup,
    previewMarkup: `<svg ${namespaceAttributes} viewBox="${escapeAttribute(resolvedViewBox)}"${preserveAspectRatioAttribute}>${sharedMarkup}${childMarkup}</svg>`,
    previewUnavailableReason: null,
    elementCounts: input.elementCounts,
    referencedDefinitionIds: input.referencedDefinitionIds ?? [],
    unresolvedReferenceIds: input.unresolvedReferenceIds ?? [],
    hasSharedDefinitionReferences: input.hasSharedDefinitionReferences ?? false,
    hasStyleUsage: input.hasStyleUsage ?? false,
    hasSharedStyleUsage: input.hasSharedStyleUsage ?? false,
    usesGradients: input.usesGradients ?? false,
    usesClipPaths: input.usesClipPaths ?? false,
    usesMasks: input.usesMasks ?? false,
    usesFilters: input.usesFilters ?? false,
    usesMarkers: input.usesMarkers ?? false,
  };
}

export function createSpriteSymbolPreviews(
  inputs: Array<{
    key?: string;
    index?: number;
    id: string | null;
    title?: string | null;
    desc?: string | null;
    viewBox: string | null;
    width: string | null;
    height: string | null;
    childMarkup: string;
    elementCounts: SvgSymbolElementCounts;
    preserveAspectRatio?: string | null;
    referencedDefinitionIds?: string[];
    unresolvedReferenceIds?: string[];
    hasSharedDefinitionReferences?: boolean;
    hasStyleUsage?: boolean;
    hasSharedStyleUsage?: boolean;
    usesGradients?: boolean;
    usesClipPaths?: boolean;
    usesMasks?: boolean;
    usesFilters?: boolean;
    usesMarkers?: boolean;
    unavailableReason?: string | null;
  }>,
  sharedMarkup = "",
  namespaceAttributes = 'xmlns="http://www.w3.org/2000/svg"',
): SvgSymbolPreview[] {
  return inputs.map((input) =>
    createSpriteSymbolPreview(input, sharedMarkup, namespaceAttributes),
  );
}

export function summarizeSpriteViewBoxes(
  viewBoxes: Array<string | null>,
): SpriteScalabilitySummary {
  const totalSymbols = viewBoxes.length;
  const symbolsWithValidViewBox = viewBoxes.filter((viewBox) =>
    parseViewBox(viewBox) !== null,
  ).length;

  return {
    isSpriteContainer: totalSymbols > 0,
    totalSymbols,
    symbolsWithValidViewBox,
    symbolsMissingUsableViewBox: totalSymbols - symbolsWithValidViewBox,
  };
}

export function isSpriteContainerSvg(svg: SVGSVGElement): boolean {
  return svg.querySelector("symbol") !== null;
}

export function getSpriteScalabilitySummary(
  svg: SVGSVGElement,
): SpriteScalabilitySummary {
  return summarizeSpriteViewBoxes(
    Array.from(svg.querySelectorAll("symbol")).map((symbol) =>
      symbol.getAttribute("viewBox"),
    ),
  );
}

function getElementCounts(symbol: SVGSymbolElement): SvgSymbolElementCounts {
  return {
    paths: symbol.querySelectorAll("path").length,
    groups: symbol.querySelectorAll("g").length,
    circles: symbol.querySelectorAll("circle").length,
    rects: symbol.querySelectorAll("rect").length,
    polygons: symbol.querySelectorAll("polygon,polyline").length,
    lines: symbol.querySelectorAll("line").length,
    text: symbol.querySelectorAll("text").length,
    defs: symbol.querySelectorAll("defs").length,
    styles: symbol.querySelectorAll("style").length,
    uses: symbol.querySelectorAll("use").length,
    shapes: symbol.querySelectorAll(SHAPE_SELECTORS).length,
  };
}

function getSelectedDefinitionClosure(
  referencedIds: string[],
  definitions: SvgSpriteDefinition[],
): SvgSpriteDefinition[] {
  const definitionMap = new Map(definitions.map((definition) => [definition.id, definition]));
  const queue = [...referencedIds];
  const resolvedIds = new Set<string>();

  while (queue.length > 0) {
    const id = queue.shift();

    if (!id || resolvedIds.has(id)) {
      continue;
    }

    const definition = definitionMap.get(id);

    if (!definition) {
      continue;
    }

    resolvedIds.add(id);

    definition.references.forEach((referenceId) => {
      if (!resolvedIds.has(referenceId)) {
        queue.push(referenceId);
      }
    });
  }

  return definitions.filter((definition) => resolvedIds.has(definition.id));
}

function getResourceUsageFlags(
  symbol: SVGSymbolElement,
  selectedDefinitions: SvgSpriteDefinition[],
): {
  usesGradients: boolean;
  usesClipPaths: boolean;
  usesMasks: boolean;
  usesFilters: boolean;
  usesMarkers: boolean;
} {
  const tagNames = new Set(
    [symbol, ...Array.from(symbol.querySelectorAll("*"))].map((element) =>
      element.tagName.toLowerCase(),
    ),
  );

  selectedDefinitions.forEach((definition) => {
    tagNames.add(definition.kind);
  });

  return {
    usesGradients:
      tagNames.has("lineargradient") ||
      tagNames.has("radialgradient"),
    usesClipPaths: tagNames.has("clippath"),
    usesMasks: tagNames.has("mask"),
    usesFilters: tagNames.has("filter"),
    usesMarkers: tagNames.has("marker"),
  };
}

function getTextContent(element: ParentNode, selector: string): string | null {
  return element.querySelector(selector)?.textContent?.trim() || null;
}

function getSymbolKey(symbol: SVGSymbolElement, index: number): string {
  const id = symbol.getAttribute("id")?.trim();

  if (id) {
    return id;
  }

  return `symbol-${index}`;
}

export function collectSvgSpriteData(svg: SVGSVGElement): SvgSpriteData {
  assertBrowser();

  const symbolElements = Array.from(svg.querySelectorAll("symbol"));

  if (symbolElements.length === 0) {
    return {
      symbols: [],
      resources: null,
    };
  }

  const serializer = new XMLSerializer();
  const namespaceAttributes = getSharedNamespaceAttributes(svg);
  const styleBlocks = getStyleBlocks(svg, serializer);
  const definitions = getDefinitionEntries(svg, serializer);
  const resources: SvgSpriteResources = {
    namespaceAttributes,
    styleBlocks,
    definitions,
  };
  const knownDefinitionIds = new Set(definitions.map((definition) => definition.id));
  const sharedPreviewMarkup = [
    styleBlocks.join(""),
    definitions.length > 0
      ? `<defs>${definitions.map((definition) => definition.markup).join("")}</defs>`
      : "",
  ]
    .filter(Boolean)
    .join("");

  const symbols = createSpriteSymbolPreviews(
    symbolElements.map((symbol, index) => {
      try {
        const references = collectReferencesFromSubtree(symbol, knownDefinitionIds);
        const referencedDefinitionIds = Array.from(references.known);
        const selectedDefinitions = getSelectedDefinitionClosure(
          referencedDefinitionIds,
          definitions,
        );
        const usageFlags = getResourceUsageFlags(symbol, selectedDefinitions);
        const symbolHasStyleUsage = hasStyleUsage(symbol);
        const hasSharedStyleUsage =
          styleBlocks.length > 0 &&
          (symbolHasStyleUsage || selectedDefinitions.some((definition) => definition.hasStyleUsage));

        return {
          key: getSymbolKey(symbol, index),
          index,
          id: symbol.getAttribute("id"),
          title: getTextContent(symbol, "title"),
          desc: getTextContent(symbol, "desc"),
          viewBox: symbol.getAttribute("viewBox"),
          width: symbol.getAttribute("width"),
          height: symbol.getAttribute("height"),
          childMarkup: serializeNodes(symbol.childNodes, serializer),
          elementCounts: getElementCounts(symbol),
          preserveAspectRatio: symbol.getAttribute("preserveAspectRatio"),
          referencedDefinitionIds,
          unresolvedReferenceIds: Array.from(references.unresolved),
          hasSharedDefinitionReferences: referencedDefinitionIds.length > 0,
          hasStyleUsage: symbolHasStyleUsage,
          hasSharedStyleUsage,
          usesGradients: usageFlags.usesGradients,
          usesClipPaths: usageFlags.usesClipPaths,
          usesMasks: usageFlags.usesMasks,
          usesFilters: usageFlags.usesFilters,
          usesMarkers: usageFlags.usesMarkers,
        };
      } catch {
        return {
          key: getSymbolKey(symbol, index),
          index,
          id: symbol.getAttribute("id"),
          title: getTextContent(symbol, "title"),
          desc: getTextContent(symbol, "desc"),
          viewBox: null,
          width: null,
          height: null,
          childMarkup: "",
          elementCounts: getElementCounts(symbol),
          referencedDefinitionIds: [],
          unresolvedReferenceIds: [],
          hasSharedDefinitionReferences: false,
          hasStyleUsage: false,
          hasSharedStyleUsage: false,
          usesGradients: false,
          usesClipPaths: false,
          usesMasks: false,
          usesFilters: false,
          usesMarkers: false,
          unavailableReason:
            "Preview unavailable because this symbol could not be processed safely.",
        };
      }
    }),
    sharedPreviewMarkup,
    namespaceAttributes,
  );

  return {
    symbols,
    resources,
  };
}

export function collectSvgSymbols(svg: SVGSVGElement): SvgSymbolPreview[] {
  return collectSvgSpriteData(svg).symbols;
}

export function getStandaloneSpriteSymbol(
  symbol: SvgSymbolPreview,
  resources: SvgSpriteResources | null,
): StandaloneSpriteSymbolResult {
  const resolvedViewBox = resolveSpriteViewBox(symbol);

  if (!resolvedViewBox || !symbol.childMarkup.trim()) {
    return {
      markup: null,
      warnings: [
        symbol.previewUnavailableReason ||
          "This symbol cannot be exported as a standalone SVG because it has no usable viewBox or previewable content.",
      ],
      filename: getSymbolExportFilename(symbol.id),
    };
  }

  const warnings: string[] = [];
  const selectedDefinitions = resources
    ? getSelectedDefinitionClosure(symbol.referencedDefinitionIds, resources.definitions)
    : [];

  if (symbol.unresolvedReferenceIds.length > 0) {
    warnings.push(
      "Some referenced definitions could not be resolved from the root sprite and were not included.",
    );
  }

  const defsMarkup = selectedDefinitions.length > 0
    ? `<defs>${selectedDefinitions.map((definition) => definition.markup).join("")}</defs>`
    : "";

  const styleMarkup =
    resources && symbol.hasSharedStyleUsage
      ? resources.styleBlocks.join("")
      : "";

  if (symbol.hasSharedStyleUsage && !resources?.styleBlocks.length) {
    warnings.push(
      "This symbol uses shared styles, but no root style blocks were available to include in the standalone export.",
    );
  }

  const markup = `<svg ${(resources?.namespaceAttributes ?? 'xmlns="http://www.w3.org/2000/svg"')} viewBox="${escapeAttribute(resolvedViewBox)}">${styleMarkup}${defsMarkup}${symbol.childMarkup}</svg>`;

  return {
    markup,
    warnings,
    filename: getSymbolExportFilename(symbol.id),
  };
}

export function getSymbolExportFilename(id: string | null): string {
  const normalized = (id?.trim() || "symbol")
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${normalized || "symbol"}.svg`;
}

export function matchesSpriteSymbolSearch(
  symbol: SvgSymbolPreview,
  query: string,
): boolean {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return [symbol.id, symbol.title, symbol.desc]
    .filter((value): value is string => Boolean(value?.trim()))
    .some((value) => value.toLowerCase().includes(normalizedQuery));
}

export function sortSpriteSymbols(
  symbols: SvgSymbolPreview[],
  mode: SpriteSortMode,
  recentKeys: string[] = [],
): SvgSymbolPreview[] {
  const orderedSymbols = [...symbols];

  if (mode === "original") {
    return orderedSymbols.sort((left, right) => left.index - right.index);
  }

  if (mode === "alphabetical") {
    return orderedSymbols.sort((left, right) => {
      const leftLabel = (left.id?.trim() || "Unnamed symbol").toLowerCase();
      const rightLabel = (right.id?.trim() || "Unnamed symbol").toLowerCase();

      return leftLabel.localeCompare(rightLabel) || left.index - right.index;
    });
  }

  const ranking = new Map(recentKeys.map((key, index) => [key, index]));

  return orderedSymbols.sort((left, right) => {
    const leftRank = ranking.get(left.key);
    const rightRank = ranking.get(right.key);

    if (leftRank !== undefined || rightRank !== undefined) {
      if (leftRank === undefined) {
        return 1;
      }

      if (rightRank === undefined) {
        return -1;
      }

      return leftRank - rightRank;
    }

    return left.index - right.index;
  });
}

export function getSharedResourceUsageSummary(symbol: SvgSymbolPreview): string[] {
  const usages: string[] = [];

  if (symbol.usesGradients) {
    usages.push("Gradients");
  }

  if (symbol.usesClipPaths) {
    usages.push("Clip paths");
  }

  if (symbol.usesMasks) {
    usages.push("Masks");
  }

  if (symbol.usesFilters) {
    usages.push("Filters");
  }

  if (symbol.usesMarkers) {
    usages.push("Markers");
  }

  return usages;
}

export function hasSharedResourceUsage(symbol: SvgSymbolPreview): boolean {
  return (
    symbol.hasSharedDefinitionReferences ||
    symbol.usesGradients ||
    symbol.usesClipPaths ||
    symbol.usesMasks ||
    symbol.usesFilters ||
    symbol.usesMarkers
  );
}
