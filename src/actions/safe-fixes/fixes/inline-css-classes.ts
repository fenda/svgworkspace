import { inlineCssClasses as inlineEmbeddedCssClasses } from "@/lib/svg/css-classes";

export function inlineCssClasses(svg: SVGSVGElement): void {
  inlineEmbeddedCssClasses(svg);
}
