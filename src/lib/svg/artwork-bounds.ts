import { parseSvgMarkup } from "./parse";
import type { ParsedViewBox } from "./viewbox";

export type ArtworkBoundsResult =
  | { bounds: ParsedViewBox; reason?: undefined }
  | { bounds: null; reason: string };

/**
 * Browser layout is the only reliable way to measure arbitrary SVG paths without
 * introducing a second, incomplete geometry engine.
 */
export function measureSvgArtworkBounds(markup: string): ArtworkBoundsResult {
  if (typeof document === "undefined") {
    return { bounds: null, reason: "Artwork bounds are available in the browser only." };
  }

  let svg: SVGSVGElement;

  try {
    svg = parseSvgMarkup(markup.trim());
  } catch {
    return { bounds: null, reason: "Unable to parse the current SVG for bounds measurement." };
  }

  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText = "position:fixed;left:-10000px;top:-10000px;width:1px;height:1px;overflow:hidden;visibility:hidden;pointer-events:none;";
  svg.style.setProperty("display", "block", "important");
  host.append(svg);
  document.body.append(host);

  try {
    const bounds = svg.getBBox();

    if (!Number.isFinite(bounds.x) || !Number.isFinite(bounds.y) || bounds.width <= 0 || bounds.height <= 0) {
      return { bounds: null, reason: "The SVG does not expose measurable artwork bounds." };
    }

    return {
      bounds: {
        minX: Math.round(bounds.x * 1000) / 1000,
        minY: Math.round(bounds.y * 1000) / 1000,
        width: Math.round(bounds.width * 1000) / 1000,
        height: Math.round(bounds.height * 1000) / 1000,
      },
    };
  } catch {
    return { bounds: null, reason: "Artwork bounds could not be measured for this SVG." };
  } finally {
    host.remove();
  }
}
