import {
  parseDimensionAttribute,
  parseViewBox,
} from "@/lib/svg/viewbox";
import type { SvgDetectedType, SvgTypeConfidence } from "@/lib/svg/types";

const SHAPE_SELECTORS = [
  "path",
  "circle",
  "rect",
  "ellipse",
  "polygon",
  "polyline",
  "line",
].join(",");

type SvgTypeDetection = {
  type: SvgDetectedType;
  label: string;
  confidence: SvgTypeConfidence;
  explanation: string;
  score: number;
};

type SvgSignals = {
  viewBox: string | null;
  width: number | null;
  height: number | null;
  aspectRatio: number | null;
  isSquare: boolean;
  isWide: boolean;
  isVeryWide: boolean;
  isLargeCanvas: boolean;
  shapeCount: number;
  pathCount: number;
  groupCount: number;
  textCount: number;
  lineLikeCount: number;
  colorCount: number;
  hasText: boolean;
  complexDefCount: number;
  hasMarkers: boolean;
  markerCount: number;
  symbolCount: number;
  symbolWithIdCount: number;
  symbolWithViewBoxCount: number;
  isRootHidden: boolean;
};

export type SvgTypeDebugResult = {
  signals: SvgSignals;
  scores: Record<SvgDetectedType, number>;
  candidates: Array<{
    type: SvgDetectedType;
    label: string;
    score: number;
    confidence: SvgTypeConfidence;
    explanation: string;
  }>;
  selected: {
    type: SvgDetectedType;
    label: string;
    confidence: SvgTypeConfidence;
    explanation: string;
  };
};

function getDimensions(svg: SVGSVGElement): { width: number; height: number } | null {
  const parsedViewBox = parseViewBox(svg.getAttribute("viewBox"));

  if (parsedViewBox) {
    return {
      width: parsedViewBox.width,
      height: parsedViewBox.height,
    };
  }

  const width = parseDimensionAttribute(svg.getAttribute("width"));
  const height = parseDimensionAttribute(svg.getAttribute("height"));

  if (width === null || height === null) {
    return null;
  }

  return { width, height };
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildSignals(svg: SVGSVGElement, colorCount: number): SvgSignals {
  const dimensions = getDimensions(svg);
  const aspectRatio = dimensions ? dimensions.width / dimensions.height : null;
  const shapeCount = svg.querySelectorAll(SHAPE_SELECTORS).length;
  const pathCount = svg.querySelectorAll("path").length;
  const groupCount = svg.querySelectorAll("g").length;
  const textCount = svg.querySelectorAll("text, tspan, textPath").length;
  const lineLikeCount = svg.querySelectorAll("line, polyline").length;
  const complexDefCount = svg.querySelectorAll(
    "linearGradient, radialGradient, pattern, mask, clipPath, filter",
  ).length;
  const markerCount = svg.querySelectorAll("marker").length;
  const symbols = Array.from(svg.querySelectorAll("symbol"));
  const symbolWithIdCount = symbols.filter((symbol) =>
    Boolean(symbol.getAttribute("id")?.trim())
  ).length;
  const symbolWithViewBoxCount = symbols.filter((symbol) =>
    Boolean(symbol.getAttribute("viewBox")?.trim())
  ).length;
  const rootStyle = svg.getAttribute("style")?.toLowerCase() ?? "";
  const isRootHidden =
    svg.hasAttribute("hidden") ||
    rootStyle.includes("display:none") ||
    rootStyle.includes("display: none") ||
    rootStyle.includes("visibility:hidden") ||
    rootStyle.includes("visibility: hidden");
  const parsedViewBox = parseViewBox(svg.getAttribute("viewBox"));
  const widthAttr = parseDimensionAttribute(svg.getAttribute("width"));
  const heightAttr = parseDimensionAttribute(svg.getAttribute("height"));

  return {
    viewBox: svg.getAttribute("viewBox"),
    width: parsedViewBox?.width ?? widthAttr,
    height: parsedViewBox?.height ?? heightAttr,
    aspectRatio,
    isSquare: aspectRatio !== null && aspectRatio >= 0.8 && aspectRatio <= 1.25,
    isWide: aspectRatio !== null && aspectRatio >= 1.7,
    isVeryWide: aspectRatio !== null && aspectRatio >= 2.4,
    isLargeCanvas:
      dimensions !== null &&
      (dimensions.width >= 256 || dimensions.height >= 256),
    shapeCount,
    pathCount,
    groupCount,
    textCount,
    lineLikeCount,
    colorCount,
    hasText: textCount > 0,
    complexDefCount,
    hasMarkers: markerCount > 0,
    markerCount,
    symbolCount: symbols.length,
    symbolWithIdCount,
    symbolWithViewBoxCount,
    isRootHidden,
  };
}

function detectSpriteSheet(signals: SvgSignals): SvgTypeDetection | null {
  const reasons: string[] = [];
  let score = 0;

  if (signals.symbolCount >= 2) {
    score += 2;
    reasons.push("multiple symbols");
  }

  if (signals.symbolWithIdCount === signals.symbolCount && signals.symbolCount > 0) {
    score += 1;
    reasons.push("symbol IDs");
  }

  if (signals.symbolWithViewBoxCount >= 2) {
    score += 1;
    reasons.push("symbol viewBoxes");
  }

  if (signals.isRootHidden) {
    score += 1;
    reasons.push("hidden root SVG");
  }

  if (
    signals.symbolCount < 2 ||
    signals.symbolWithIdCount < 2 ||
    signals.symbolWithViewBoxCount < 2
  ) {
    return null;
  }

  return {
    type: "sprite_sheet",
    label: "Sprite Sheet",
    confidence: score >= 4 ? "high" : "medium",
    explanation: `${capitalize(reasons.join(", "))}.`,
    score,
  };
}

function detectIcon(signals: SvgSignals): SvgTypeDetection | null {
  const reasons: string[] = [];
  let score = 0;

  if (signals.isSquare) {
    score += 1;
    reasons.push("square aspect ratio");
  }

  if (signals.shapeCount > 0 && signals.shapeCount <= 8) {
    score += 1;
    reasons.push("few shapes");
  }

  if (signals.colorCount <= 2) {
    score += 1;
    reasons.push("limited colors");
  }

  if (!signals.hasText) {
    score += 1;
    reasons.push("no text");
  }

  if (signals.complexDefCount === 0) {
    score += 0.5;
  }

  if (
    signals.hasText ||
    signals.complexDefCount > 0 ||
    signals.shapeCount > 16 ||
    signals.isWide ||
    signals.symbolCount > 0
  ) {
    return null;
  }

  if (score < 3) {
    return null;
  }

  return {
    type: "icon",
    label: "Icon",
    confidence: score >= 4 ? "high" : "medium",
    explanation: `Small ${reasons.join(", ")} SVG.`,
    score,
  };
}

function detectLogo(signals: SvgSignals): SvgTypeDetection | null {
  const reasons: string[] = [];
  let score = 0;

  if (signals.hasText) {
    score += 1.5;
    reasons.push("text elements");
  }

  if (signals.isWide) {
    score += 1;
    reasons.push("wide aspect ratio");
  }

  if (signals.isVeryWide) {
    score += 0.75;
    reasons.push("horizontal wordmark-like layout");
  }

  if (signals.colorCount >= 1 && signals.colorCount <= 4) {
    score += 0.5;
    reasons.push("limited brand-like palette");
  }

  if (signals.groupCount >= 1) {
    score += 0.5;
  }

  if (!signals.hasMarkers && signals.isWide && signals.colorCount <= 4 && signals.shapeCount <= 20) {
    score += 0.75;
  }

  if (signals.shapeCount > 40 || signals.complexDefCount > 0 || signals.hasMarkers) {
    return null;
  }

  if (score < 3) {
    return null;
  }

  return {
    type: "logo",
    label: "Logo",
    confidence: score >= 4.25 ? "high" : "medium",
    explanation: `${capitalize(reasons.join(", "))}.`,
    score,
  };
}

function detectIllustration(signals: SvgSignals): SvgTypeDetection | null {
  const reasons: string[] = [];
  let score = 0;

  if (signals.shapeCount >= 10) {
    score += 1;
    reasons.push("many shapes");
  }

  if (signals.pathCount >= 6) {
    score += 1;
    reasons.push("path-heavy structure");
  }

  if (signals.colorCount >= 4) {
    score += 1;
    reasons.push("multiple colors");
  }

  if (signals.complexDefCount > 0) {
    score += 1;
    reasons.push("gradients or masks");
  }

  if (signals.isLargeCanvas) {
    score += 0.5;
  }

  if (signals.shapeCount < 10 && signals.complexDefCount === 0) {
    return null;
  }

  if (score < 2.5) {
    return null;
  }

  return {
    type: "illustration",
    label: "Illustration",
    confidence: score >= 4 ? "high" : "medium",
    explanation: `${capitalize(reasons.join(", "))}.`,
    score,
  };
}

function detectDiagram(signals: SvgSignals): SvgTypeDetection | null {
  const reasons: string[] = [];
  let score = 0;

  if (signals.hasText) {
    score += 1;
    reasons.push("text labels");
  }

  if (signals.lineLikeCount >= 2) {
    score += 1;
    reasons.push("line-based connectors");
  }

  if (signals.groupCount >= 2) {
    score += 1;
    reasons.push("structured groups");
  }

  if (signals.complexDefCount === 0 && signals.colorCount <= 4) {
    score += 0.5;
  }

  if (!signals.hasText || signals.shapeCount > 40 || signals.complexDefCount > 0) {
    return null;
  }

  if (score < 3) {
    return null;
  }

  return {
    type: "diagram",
    label: "Diagram",
    confidence: score >= 3.5 ? "high" : "medium",
    explanation: `${capitalize(reasons.join(", "))}.`,
    score,
  };
}

function getUnknownDetection(): SvgTypeDetection {
  return {
    type: "unknown",
    label: "Unknown",
    confidence: "low",
    explanation: "Signals were mixed or too weak for a confident SVG type classification.",
    score: 0,
  };
}

function collectCandidates(signals: SvgSignals): SvgTypeDetection[] {
  return [
    detectSpriteSheet(signals),
    detectIcon(signals),
    detectLogo(signals),
    detectIllustration(signals),
    detectDiagram(signals),
  ]
    .filter((candidate): candidate is SvgTypeDetection => candidate !== null)
    .sort((left, right) => right.score - left.score);
}

export function debugDetectSvgType(
  svg: SVGSVGElement,
  colorCount: number,
): SvgTypeDebugResult {
  const signals = buildSignals(svg, colorCount);
  const candidates = collectCandidates(signals);
  const best = candidates[0];
  const secondBest = candidates[1];
  const selected =
    best && best.score >= 3 && (!secondBest || best.score - secondBest.score >= 1)
      ? best
      : getUnknownDetection();

  return {
    signals,
    scores: {
      sprite_sheet: detectSpriteSheet(signals)?.score ?? 0,
      icon: detectIcon(signals)?.score ?? 0,
      logo: detectLogo(signals)?.score ?? 0,
      illustration: detectIllustration(signals)?.score ?? 0,
      diagram: detectDiagram(signals)?.score ?? 0,
      unknown: 0,
    },
    candidates: candidates.map((candidate) => ({
      type: candidate.type,
      label: candidate.label,
      score: candidate.score,
      confidence: candidate.confidence,
      explanation: candidate.explanation,
    })),
    selected: {
      type: selected.type,
      label: selected.label,
      confidence: selected.confidence,
      explanation: selected.explanation,
    },
  };
}

export function detectSvgType(
  svg: SVGSVGElement,
  colorCount: number,
): SvgTypeDetection {
  return debugDetectSvgType(svg, colorCount).selected as SvgTypeDetection;
}
