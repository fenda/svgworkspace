export function hasValidViewBox(svg: SVGSVGElement): boolean {
  const viewBox = svg.getAttribute("viewBox");

  if (!viewBox) {
    return false;
  }

  const parts = viewBox.trim().split(/[\s,]+/).map(Number);

  return parts.length === 4 && parts.every((part) => !Number.isNaN(part));
}
