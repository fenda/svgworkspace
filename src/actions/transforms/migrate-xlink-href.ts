import { migrateXlinkHrefAttributes } from "@/lib/svg/icon-workspace";
import { parseSvgMarkup, serializeSvg } from "@/lib/svg/parse";

export function applyMigrateXlinkHref(content: string): string {
  const svg = parseSvgMarkup(content.trim());
  const count = migrateXlinkHrefAttributes(svg);

  if (count === 0) {
    throw new Error("This SVG does not contain any legacy xlink:href attributes.");
  }

  return serializeSvg(svg);
}
