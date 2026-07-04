function getStyleValue(style: string, property: string): string | null {
  const pattern = new RegExp(`${property}\\s*:\\s*([^;]+)`, "i");
  const match = style.match(pattern);

  return match?.[1]?.trim() ?? null;
}

function isOpacityZero(value: string | null): boolean {
  if (!value) {
    return false;
  }

  return Number(value) === 0;
}

function isHidden(element: Element): boolean {
  const style = element.getAttribute("style") ?? "";
  const display = element.getAttribute("display")?.trim();
  const visibility = element.getAttribute("visibility")?.trim();
  const opacity = element.getAttribute("opacity")?.trim();
  const styleDisplay = getStyleValue(style, "display");
  const styleVisibility = getStyleValue(style, "visibility");
  const styleOpacity = getStyleValue(style, "opacity");

  return (
    display === "none" ||
    visibility === "hidden" ||
    isOpacityZero(opacity) ||
    styleDisplay === "none" ||
    styleVisibility === "hidden" ||
    isOpacityZero(styleOpacity)
  );
}

export function removeHiddenElements(svg: SVGSVGElement): void {
  Array.from(svg.querySelectorAll("*")).forEach((element) => {
    if (isHidden(element)) {
      element.remove();
    }
  });
}
