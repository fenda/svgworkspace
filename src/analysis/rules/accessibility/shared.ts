function getElementText(svg: SVGSVGElement, tagName: "title" | "desc"): string | null {
  return svg.querySelector(tagName)?.textContent ?? null;
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
