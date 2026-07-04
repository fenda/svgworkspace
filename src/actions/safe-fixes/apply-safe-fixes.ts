import { parseSvgMarkup, serializeSvg } from "@/lib/svg/parse";
import { removeComments } from "./fixes/remove-comments";
import { roundDecimals } from "./fixes/round-decimals";
import { removeEmptyGroups } from "./fixes/remove-empty-groups";
import { removeEmptyPaths } from "./fixes/remove-empty-paths";
import { removeHiddenElements } from "./fixes/remove-hidden-elements";
import { removeMetadata } from "./fixes/remove-metadata";

export function applySafeFixes(content: string): string {
  const svg = parseSvgMarkup(content.trim());

  removeMetadata(svg);
  removeComments(svg);
  removeHiddenElements(svg);
  removeEmptyPaths(svg);
  removeEmptyGroups(svg);
  roundDecimals(svg);

  return serializeSvg(svg);
}
