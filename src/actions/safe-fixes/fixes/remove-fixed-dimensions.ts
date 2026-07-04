import { hasValidViewBox } from "@/lib/svg/viewbox";

export function removeFixedDimensions(svg: SVGSVGElement): void {
  const width = svg.getAttribute("width")?.trim();
  const height = svg.getAttribute("height")?.trim();

  if (!width || !height || !hasValidViewBox(svg)) {
    return;
  }

  svg.removeAttribute("width");
  svg.removeAttribute("height");
}
