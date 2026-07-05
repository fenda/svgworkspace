import {
  isTransformableCurrentColorPaintValue,
  type PaintAttribute,
} from "@/lib/svg/current-color";
import { parseSvgMarkup, serializeSvg } from "@/lib/svg/parse";

export function applyCurrentColorTransform(
  content: string,
  attribute: PaintAttribute,
): string {
  const svg = parseSvgMarkup(content.trim());
  let appliedCount = 0;

  Array.from(svg.querySelectorAll("*")).forEach((element) => {
    const paint = element.getAttribute(attribute)?.trim();

    if (!paint || !isTransformableCurrentColorPaintValue(paint)) {
      return;
    }

    element.setAttribute(attribute, "currentColor");
    appliedCount += 1;
  });

  if (appliedCount === 0) {
    throw new Error(
      `This SVG does not expose any safe ${attribute} attributes for currentColor conversion.`,
    );
  }

  return serializeSvg(svg);
}
