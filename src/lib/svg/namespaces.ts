const SVG_NAMESPACE_ATTRIBUTE = "xmlns";
const RESERVED_NAMESPACE_PREFIXES = new Set(["xml"]);

function getNamespacePrefixes(svg: SVGSVGElement): string[] {
  return Array.from(svg.attributes)
    .map((attribute) => attribute.name)
    .filter((name) => name.startsWith("xmlns:"))
    .map((name) => name.slice("xmlns:".length))
    .filter((prefix) => prefix && !RESERVED_NAMESPACE_PREFIXES.has(prefix));
}

function isNamespacePrefixUsed(svg: SVGSVGElement, prefix: string): boolean {
  const elements = [svg, ...Array.from(svg.querySelectorAll("*"))];

  return elements.some((element) => {
    if (element.prefix === prefix || element.tagName.startsWith(`${prefix}:`)) {
      return true;
    }

    return Array.from(element.attributes).some((attribute) => {
      return (
        attribute.prefix === prefix ||
        attribute.name !== SVG_NAMESPACE_ATTRIBUTE &&
        !attribute.name.startsWith("xmlns:") &&
        attribute.name.startsWith(`${prefix}:`)
      );
    });
  });
}

export function getUnusedNamespacePrefixes(svg: SVGSVGElement): string[] {
  return getNamespacePrefixes(svg).filter((prefix) => {
    return !isNamespacePrefixUsed(svg, prefix);
  });
}

export function removeUnusedNamespacesFromSvg(svg: SVGSVGElement): number {
  const unusedPrefixes = getUnusedNamespacePrefixes(svg);

  unusedPrefixes.forEach((prefix) => {
    svg.removeAttribute(`xmlns:${prefix}`);
  });

  return unusedPrefixes.length;
}
