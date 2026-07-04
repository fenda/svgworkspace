function getElementText(svg: SVGSVGElement, tagName: "title" | "desc"): string | null {
  return svg.querySelector(tagName)?.textContent ?? null;
}

function getRootAttribute(svg: SVGSVGElement, name: string): string | null {
  return svg.getAttribute(name)?.trim() ?? null;
}

export function hasElement(svg: SVGSVGElement, tagName: "title" | "desc"): boolean {
  return getElementText(svg, tagName) !== null;
}

export function hasEmptyElementText(
  svg: SVGSVGElement,
  tagName: "title" | "desc",
): boolean {
  const value = getElementText(svg, tagName);

  return value !== null && value.trim().length === 0;
}

export function isDecorativeSvg(svg: SVGSVGElement): boolean {
  const ariaHidden = getRootAttribute(svg, "aria-hidden");
  const role = getRootAttribute(svg, "role");

  return (
    ariaHidden === "true" ||
    role === "presentation" ||
    role === "none"
  );
}
