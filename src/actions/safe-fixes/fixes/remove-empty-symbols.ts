import { removeEmptySymbolsFromSvg } from "@/lib/svg/defs";

export function removeEmptySymbols(svg: SVGSVGElement): void {
  removeEmptySymbolsFromSvg(svg);
}
