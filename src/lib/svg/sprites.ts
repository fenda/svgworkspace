import { assertBrowser } from "../browser/assert-browser";
import { parseDimensionAttribute, parseViewBox } from "./viewbox";
import type {
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

export type SpriteScalabilitySummary = {
  isSpriteContainer: boolean;
  totalSymbols: number;
  symbolsWithValidViewBox: number;
  symbolsMissingUsableViewBox: number;
};

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

function getSharedMarkup(svg: SVGSVGElement, serializer: XMLSerializer): string {
  return serializeNodes(
    Array.from(svg.childNodes).filter((node) => {
      if (!(node instanceof Element)) {
        return false;
      }

      const tagName = node.tagName.toLowerCase();

      return tagName === "defs" || tagName === "style";
    }),
    serializer,
  );
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

export function createSpriteSymbolPreview(
  input: {
    id: string | null;
    viewBox: string | null;
    width: string | null;
    height: string | null;
    childMarkup: string;
    elementCounts: SvgSymbolElementCounts;
    preserveAspectRatio?: string | null;
    unavailableReason?: string | null;
  },
  sharedMarkup = "",
  namespaceAttributes = 'xmlns="http://www.w3.org/2000/svg"',
): SvgSymbolPreview {
  const childMarkup = input.childMarkup.trim();
  const resolvedViewBox = resolveSpriteViewBox(input);

  if (!childMarkup) {
    return {
      id: input.id,
      viewBox: resolvedViewBox,
      childMarkup,
      previewMarkup: null,
      previewUnavailableReason:
        input.unavailableReason ?? "This symbol does not contain previewable content.",
      elementCounts: input.elementCounts,
    };
  }

  if (!resolvedViewBox) {
    return {
      id: input.id,
      viewBox: null,
      childMarkup,
      previewMarkup: null,
      previewUnavailableReason:
        "Preview unavailable because this symbol has no usable viewBox or dimensions.",
      elementCounts: input.elementCounts,
    };
  }

  const preserveAspectRatioAttribute = input.preserveAspectRatio?.trim()
    ? ` preserveAspectRatio="${escapeAttribute(input.preserveAspectRatio.trim())}"`
    : "";

  return {
    id: input.id,
    viewBox: resolvedViewBox,
    childMarkup,
    previewMarkup: `<svg ${namespaceAttributes} viewBox="${escapeAttribute(resolvedViewBox)}"${preserveAspectRatioAttribute}>${sharedMarkup}${childMarkup}</svg>`,
    previewUnavailableReason: null,
    elementCounts: input.elementCounts,
  };
}

export function createSpriteSymbolPreviews(
  inputs: Array<{
    id: string | null;
    viewBox: string | null;
    width: string | null;
    height: string | null;
    childMarkup: string;
    elementCounts: SvgSymbolElementCounts;
    preserveAspectRatio?: string | null;
    unavailableReason?: string | null;
  }>,
  sharedMarkup = "",
  namespaceAttributes = 'xmlns="http://www.w3.org/2000/svg"',
): SvgSymbolPreview[] {
  return inputs.map((input) =>
    createSpriteSymbolPreview(input, sharedMarkup, namespaceAttributes),
  );
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
    shapes: symbol.querySelectorAll(SHAPE_SELECTORS).length,
    uses: symbol.querySelectorAll("use").length,
    groups: symbol.querySelectorAll("g").length,
  };
}

export function collectSvgSymbols(svg: SVGSVGElement): SvgSymbolPreview[] {
  assertBrowser();

  const serializer = new XMLSerializer();
  const sharedMarkup = getSharedMarkup(svg, serializer);
  const namespaceAttributes = getSharedNamespaceAttributes(svg);

  return createSpriteSymbolPreviews(Array.from(svg.querySelectorAll("symbol")).map((symbol) => {
    try {
      return {
        id: symbol.getAttribute("id"),
        viewBox: symbol.getAttribute("viewBox"),
        width: symbol.getAttribute("width"),
        height: symbol.getAttribute("height"),
        childMarkup: serializeNodes(symbol.childNodes, serializer),
        elementCounts: getElementCounts(symbol),
        preserveAspectRatio: symbol.getAttribute("preserveAspectRatio"),
      };
    } catch {
      return {
        id: symbol.getAttribute("id"),
        viewBox: null,
        width: null,
        height: null,
        childMarkup: "",
        elementCounts: getElementCounts(symbol),
        preserveAspectRatio: null,
        unavailableReason:
          "Preview unavailable because this symbol could not be processed safely.",
      };
    }
  }), sharedMarkup, namespaceAttributes);
}
