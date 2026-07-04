import { assertBrowser } from "@/lib/browser/assert-browser";

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

const METADATA_SELECTORS = [
  "metadata",
  "sodipodi\\:namedview",
  "inkscape\\:path-effect",
].join(",");

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

function scoreToGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function estimateOptimizableBytes(content: string, hasMetadata: boolean): number {
  let savings = 0;

  if (hasMetadata) {
    savings += Math.min(450, Math.round(content.length * 0.08));
  }

  if (content.includes("<!--")) {
    savings += 80;
  }

  return savings;
}

export function analyzeSvgElement(svg: SVGSVGElement, content: string, filename: string) {
  const byteLength = getByteLength(content);
  const viewBox = svg.getAttribute("viewBox");
  const parsedViewBox = parseViewBox(viewBox);
  const widthAttr = Number(svg.getAttribute("width"));
  const heightAttr = Number(svg.getAttribute("height"));
  const paths = svg.querySelectorAll(SHAPE_SELECTORS).length;
  const colors = collectColors(svg);
  const hasViewBox = Boolean(parsedViewBox);
  const hasTitle = Boolean(svg.querySelector("title")?.textContent?.trim());
  const hasDesc = Boolean(svg.querySelector("desc")?.textContent?.trim());
  const hasMetadata = Boolean(svg.querySelector(METADATA_SELECTORS));
  const hasHardcodedColors = colors.size > 0;
  const responsive =
    hasViewBox || (!Number.isNaN(widthAttr) && svg.getAttribute("width")?.includes("%"));

  let score = 100;

  if (!hasViewBox) score -= 12;
  if (!responsive) score -= 8;
  if (!hasTitle && !hasDesc) score -= 6;
  if (hasMetadata) score -= 5;
  if (colors.size > 4) score -= 4;
  if (byteLength > 50_000) score -= 8;

  score = Math.max(35, Math.min(100, score));

  const estimatedSavingsBytes = estimateOptimizableBytes(content, hasMetadata);
  const estimatedReductionPercent =
    byteLength > 0
      ? Math.min(40, Math.round((estimatedSavingsBytes / byteLength) * 100))
      : 0;

  const improvementsFound =
    (estimatedReductionPercent > 0 ? 1 : 0) +
    (hasHardcodedColors ? 1 : 0) +
    (hasMetadata ? 1 : 0);

  const dimensions =
    parsedViewBox ??
    (!Number.isNaN(widthAttr) && !Number.isNaN(heightAttr)
      ? { width: widthAttr, height: heightAttr }
      : { width: 24, height: 24 });

  const metadata = {
    filename,
    viewBox: formatDimensions(dimensions.width, dimensions.height),
    size: formatBytes(byteLength),
    paths,
    colors: colors.size,
    responsive: responsive ? "Yes" : "No",
  };

  const analysis = {
    grade: scoreToGrade(score),
    score,
    maxScore: 100,
    label: score >= 85 ? "Production Ready" : score >= 70 ? "Good quality" : "Needs work",
    potentialGains: [
      `+${Math.max(1, 100 - score)} Score`,
      estimatedReductionPercent > 0 ? `−${estimatedReductionPercent}% File Size` : "0% File Size",
      `${Math.max(improvementsFound, 1)} Improvements`,
    ],
    improvementsFound: Math.max(improvementsFound, 1),
    estimatedReduction: `${estimatedReductionPercent}%`,
    estimatedSavings: `~${formatBytes(estimatedSavingsBytes)} smaller`,
    checks: [
      { label: "Well structured", status: hasViewBox ? "good" : "warning" } as const,
      {
        label: "Accessible",
        status: hasTitle || hasDesc ? "good" : "warning",
      } as const,
      { label: "Responsive", status: responsive ? "good" : "warning" } as const,
      {
        label: "Can be optimized",
        status: estimatedReductionPercent > 0 ? "warning" : "good",
      } as const,
    ],
    summary: [
      {
        label: "ViewBox",
        value: hasViewBox ? "Good" : "Missing",
        status: hasViewBox ? "good" : "warning",
      } as const,
      {
        label: "Responsive",
        value: responsive ? "Yes" : "No",
        status: responsive ? "good" : "warning",
      } as const,
      {
        label: "Accessible",
        value: hasTitle || hasDesc ? "Yes" : "No",
        status: hasTitle || hasDesc ? "good" : "warning",
      } as const,
      {
        label: "Hardcoded colors",
        value: hasHardcodedColors ? `${colors.size} found` : "None",
        status: hasHardcodedColors ? "warning" : "good",
      } as const,
      {
        label: "Illustrator metadata",
        value: hasMetadata ? "Detected" : "None",
        status: hasMetadata ? "warning" : "good",
      } as const,
    ],
  };

  return { metadata, analysis };
}
