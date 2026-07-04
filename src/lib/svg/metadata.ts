import { assertBrowser } from "@/lib/browser/assert-browser";
import type { SvgMetadata } from "@/lib/svg/types";

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

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  return `${(bytes / 1024).toFixed(1)} KB`;
}

function getByteLength(content: string): number {
  assertBrowser();
  return new TextEncoder().encode(content).length;
}

function parseViewBox(viewBox: string | null): { width: number; height: number } | null {
  if (!viewBox) {
    return null;
  }

  const parts = viewBox.trim().split(/[\s,]+/).map(Number);

  if (parts.length !== 4 || parts.some(Number.isNaN)) {
    return null;
  }

  return { width: parts[2], height: parts[3] };
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
  const widthAttr = Number(svg.getAttribute("width"));
  const heightAttr = Number(svg.getAttribute("height"));
  const paths = svg.querySelectorAll(SHAPE_SELECTORS).length;
  const colors = collectColors(svg);
  const hasViewBox = Boolean(parsedViewBox);
  const responsive =
    hasViewBox || (!Number.isNaN(widthAttr) && svg.getAttribute("width")?.includes("%"));

  const dimensions =
    parsedViewBox ??
    (!Number.isNaN(widthAttr) && !Number.isNaN(heightAttr)
      ? { width: widthAttr, height: heightAttr }
      : { width: 24, height: 24 });

  return {
    filename,
    viewBox: formatDimensions(dimensions.width, dimensions.height),
    size: formatBytes(byteLength),
    paths,
    colors: colors.size,
    responsive: responsive ? "Yes" : "No",
  };
}
