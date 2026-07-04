export function removeEmptyPaths(svg: SVGSVGElement): void {
  svg.querySelectorAll("path").forEach((path) => {
    const d = path.getAttribute("d")?.trim();

    if (!d) {
      path.remove();
    }
  });
}
