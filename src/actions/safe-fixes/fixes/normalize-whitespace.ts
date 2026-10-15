import { normalizeSvgWhitespace } from "@/lib/svg/whitespace";

export function normalizeWhitespace(svg: SVGSVGElement): void {
  normalizeSvgWhitespace(svg);
}
