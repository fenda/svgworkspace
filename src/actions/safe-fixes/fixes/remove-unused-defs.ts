import { removeUnusedDefinitions } from "@/lib/svg/defs";

export function removeUnusedDefs(svg: SVGSVGElement): void {
  removeUnusedDefinitions(svg);
}
