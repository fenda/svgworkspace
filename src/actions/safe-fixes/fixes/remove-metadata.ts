export function removeMetadata(svg: SVGSVGElement): void {
  svg.querySelectorAll("metadata").forEach((metadata) => metadata.remove());
}
