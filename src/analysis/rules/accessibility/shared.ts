import { isSpriteContainerSvg } from "@/lib/svg";

function getRootAttribute(svg: SVGSVGElement, name: string): string | null {
  return svg.getAttribute(name)?.trim() ?? null;
}

export function hasElement(svg: SVGSVGElement, tagName: "title" | "desc"): boolean {
  return getDirectElementText(svg, tagName) !== null;
}

export function hasEmptyElementText(
  svg: SVGSVGElement,
  tagName: "title" | "desc",
): boolean {
  const value = getDirectElementText(svg, tagName);

  return value !== null && value.trim().length === 0;
}

function getDirectElementText(
  svg: SVGSVGElement,
  tagName: "title" | "desc",
): string | null {
  return (
    Array.from(svg.children).find(
      (child) => child.tagName.toLowerCase() === tagName,
    )?.textContent ?? null
  );
}

export function hasAccessibleName(svg: SVGSVGElement): boolean {
  const ariaLabel = getRootAttribute(svg, "aria-label");
  const ariaLabelledBy = getRootAttribute(svg, "aria-labelledby");
  const title = getDirectElementText(svg, "title");

  return Boolean(ariaLabel || ariaLabelledBy || title?.trim());
}

export function isAccessibilityContextExempt(svg: SVGSVGElement): boolean {
  return isDecorativeSvg(svg) || isSpriteContainerSvg(svg);
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
