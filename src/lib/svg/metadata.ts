import { assertBrowser } from "@/lib/browser/assert-browser";
import type { SvgMetadata } from "@/lib/svg/types";
import { detectSvgType } from "@/lib/svg/type-detection";
import {
  analyzeScalability,
  parseDimensionAttribute,
  parseViewBox,
} from "@/lib/svg/viewbox";

const SHAPE_SELECTORS = [
  "path",
  "circle",
  "rect",
  "ellipse",
  "polygon",
  "polyline",
  "line",
].join(",");

const COLOR_ATTRS = ["fill", "stroke"] as const;

export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function getByteLength(content: string): number {
  assertBrowser();
  return new TextEncoder().encode(content).length;
}

function formatDimensions(width: number, height: number): string {
  const format = (value: number) =>
    Number.isInteger(value) ? String(value) : value.toFixed(1);

  return `${format(width)} × ${format(height)}`;
}

function collectColors(svg: SVGSVGElement): Set<string> {
  const colors = new Set<string>();

  svg.querySelectorAll(SHAPE_SELECTORS).forEach((node) => {
    COLOR_ATTRS.forEach((attr) => {
      const value = node.getAttribute(attr);

      if (
        value &&
        value !== "none" &&
        value !== "currentColor" &&
        !value.startsWith("url(")
      ) {
        colors.add(value);
      }
    });
  });

  return colors;
}

export function extractSvgMetadata(
  svg: SVGSVGElement,
  content: string,
  filename: string,
): SvgMetadata {
  const byteLength = getByteLength(content);
  const viewBox = svg.getAttribute("viewBox");
  const parsedViewBox = parseViewBox(viewBox);
  const widthAttr = parseDimensionAttribute(svg.getAttribute("width"));
  const heightAttr = parseDimensionAttribute(svg.getAttribute("height"));
  const paths = svg.querySelectorAll(SHAPE_SELECTORS).length;
  const colors = collectColors(svg);
  const scalability = analyzeScalability(svg);
  const detectedType = detectSvgType(svg, colors.size);

  const dimensions =
    parsedViewBox ??
    (widthAttr !== null && heightAttr !== null
      ? { width: widthAttr, height: heightAttr }
      : { width: 24, height: 24 });

  return {
    filename,
    viewBox: formatDimensions(dimensions.width, dimensions.height),
    size: formatBytes(byteLength),
    byteLength,
    paths,
    colors: colors.size,
    scalable: scalability.label,
    scalableExplanation: scalability.explanation,
    type: detectedType.label,
    typeConfidence: detectedType.confidence,
    typeExplanation: detectedType.explanation,
  };
}
