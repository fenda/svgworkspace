import { parseSvgMarkup } from "./parse";
import { resolveSpriteViewBox } from "./sprites";

export type SpriteBuilderSource = {
  filename: string;
  content: string;
};

export type BuiltSpriteSymbol = {
  id: string;
  filename: string;
  viewBox: string;
  markup: string;
};

export type SpriteBuildResult = {
  markup: string;
  symbols: BuiltSpriteSymbol[];
  warnings: string[];
};

function toSymbolBaseId(filename: string): string {
  const withoutExtension = filename.replace(/\.svg$/i, "");
  const normalized = withoutExtension
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "icon";
}

function getUniqueId(baseId: string, usedIds: Set<string>): string {
  let candidate = baseId;
  let suffix = 2;

  while (usedIds.has(candidate)) {
    candidate = `${baseId}-${suffix}`;
    suffix += 1;
  }

  usedIds.add(candidate);
  return candidate;
}

function escapeAttribute(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}

function rewriteLocalReferences(value: string, idMap: Map<string, string>): string {
  let nextValue = value;

  idMap.forEach((nextId, previousId) => {
    const escaped = previousId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    nextValue = nextValue
      .replace(new RegExp(`url\\((['"]?)#${escaped}\\1\\)`, "g"), `url(#${nextId})`)
      .replace(new RegExp(`^#${escaped}$`), `#${nextId}`)
      .replace(new RegExp(`#${escaped}(?![A-Za-z0-9_.:-])`, "g"), `#${nextId}`);
  });

  return nextValue;
}

function isolateSourceIds(svg: SVGSVGElement, prefix: string): void {
  const idMap = new Map<string, string>();

  Array.from(svg.querySelectorAll("[id]")).forEach((element) => {
    const id = element.getAttribute("id")?.trim();
    if (id) idMap.set(id, `${prefix}-${id}`);
  });

  if (idMap.size === 0) return;

  Array.from(svg.querySelectorAll("[id]")).forEach((element) => {
    const id = element.getAttribute("id")?.trim();
    if (id) element.setAttribute("id", idMap.get(id) ?? id);
  });

  Array.from(svg.querySelectorAll("*")).forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      const nextValue = rewriteLocalReferences(attribute.value, idMap);
      if (nextValue !== attribute.value) element.setAttribute(attribute.name, nextValue);
    });
    if (element.tagName.toLowerCase() === "style") {
      const value = element.textContent ?? "";
      const nextValue = rewriteLocalReferences(value, idMap);
      if (nextValue !== value) element.textContent = nextValue;
    }
  });
}

export function buildSpriteFromSources(sources: SpriteBuilderSource[]): SpriteBuildResult {
  const usedIds = new Set<string>();
  const symbols: BuiltSpriteSymbol[] = [];
  const warnings: string[] = [];

  sources.forEach((source) => {
    try {
      const svg = parseSvgMarkup(source.content.trim());
      const viewBox = resolveSpriteViewBox({
        viewBox: svg.getAttribute("viewBox"),
        width: svg.getAttribute("width"),
        height: svg.getAttribute("height"),
      });

      if (!viewBox) {
        warnings.push(`${source.filename} was skipped because it has no valid viewBox or numeric dimensions.`);
        return;
      }

      const id = getUniqueId(toSymbolBaseId(source.filename), usedIds);
      isolateSourceIds(svg, id);
      const children = Array.from(svg.childNodes)
        .map((node) => new XMLSerializer().serializeToString(node))
        .join("");
      const markup = `<symbol id="${escapeAttribute(id)}" viewBox="${escapeAttribute(viewBox)}">${children}</symbol>`;
      symbols.push({ id, filename: source.filename, viewBox, markup });
    } catch {
      warnings.push(`${source.filename} was skipped because it could not be parsed as SVG.`);
    }
  });

  return {
    markup: `<svg xmlns="http://www.w3.org/2000/svg" style="display: none">${symbols.map((symbol) => symbol.markup).join("")}</svg>`,
    symbols,
    warnings,
  };
}
