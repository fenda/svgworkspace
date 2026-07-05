import { removeEmptyDefinitionBlocks } from "@/lib/svg/defs";

export function removeEmptyDefs(svg: SVGSVGElement): void {
  removeEmptyDefinitionBlocks(svg);
}
