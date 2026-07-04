import { convertInlineStylesToAttributes } from "@/lib/svg/inline-styles";

export function convertInlineStyles(svg: SVGSVGElement): void {
  convertInlineStylesToAttributes(svg);
}
