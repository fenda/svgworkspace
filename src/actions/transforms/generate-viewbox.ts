import { parseSvgMarkup, serializeSvg } from "@/lib/svg/parse";
import { canGenerateViewBox, generateViewBoxValue } from "@/lib/svg/viewbox";

export function applyGenerateViewBox(content: string): string {
  const svg = parseSvgMarkup(content.trim());

  if (!canGenerateViewBox(svg)) {
    throw new Error("This SVG does not support safe viewBox generation.");
  }

  const nextViewBox = generateViewBoxValue(svg);

  if (!nextViewBox) {
    throw new Error("Unable to generate a safe viewBox for this SVG.");
  }

  svg.setAttribute("viewBox", nextViewBox);

  return serializeSvg(svg);
}
