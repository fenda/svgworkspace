export type ParsedViewBox = {
  minX: number;
  minY: number;
  width: number;
  height: number;
};

export type ScalabilityState = "scalable" | "mostly_scalable" | "not_scalable" | "invalid";

export type ScalabilityAnalysis = {
  state: ScalabilityState;
  label: "Yes" | "Mostly" | "No" | "Invalid";
  title: "Scalable" | "Mostly scalable" | "Not scalable" | "Invalid";
  explanation: string;
  hasFixedDimensions: boolean;
  hasValidViewBox: boolean;
  hasInvalidViewBox: boolean;
  canGenerateViewBox: boolean;
};

function parseNumberList(value: string): number[] | null {
  const parts = value.trim().split(/[\s,]+/).map(Number);

  if (parts.length !== 4 || parts.some(Number.isNaN)) {
    return null;
  }

  return parts;
}

export function parseViewBox(viewBox: string | null): ParsedViewBox | null {
  if (!viewBox) {
    return null;
  }

  const parts = parseNumberList(viewBox);

  if (!parts) {
    return null;
  }

  const [minX, minY, width, height] = parts;

  if (width <= 0 || height <= 0) {
    return null;
  }

  return { minX, minY, width, height };
}

export function hasValidViewBox(svg: SVGSVGElement): boolean {
  return parseViewBox(svg.getAttribute("viewBox")) !== null;
}

export function parseDimensionAttribute(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  const match = trimmed.match(/^(-?\d*\.?\d+)(px)?$/i);

  if (!match) {
    return null;
  }

  const numericValue = Number(match[1]);

  if (Number.isNaN(numericValue) || numericValue <= 0) {
    return null;
  }

  return numericValue;
}

export function canGenerateViewBox(svg: SVGSVGElement): boolean {
  const rawViewBox = svg.getAttribute("viewBox")?.trim();

  if (rawViewBox) {
    return false;
  }

  return (
    parseDimensionAttribute(svg.getAttribute("width")) !== null &&
    parseDimensionAttribute(svg.getAttribute("height")) !== null
  );
}

export function generateViewBoxValue(svg: SVGSVGElement): string | null {
  const width = parseDimensionAttribute(svg.getAttribute("width"));
  const height = parseDimensionAttribute(svg.getAttribute("height"));

  if (width === null || height === null) {
    return null;
  }

  const format = (value: number) =>
    Number.isInteger(value) ? String(value) : String(value);

  return `0 0 ${format(width)} ${format(height)}`;
}

export function analyzeScalability(svg: SVGSVGElement): ScalabilityAnalysis {
  const rawViewBox = svg.getAttribute("viewBox")?.trim() ?? "";
  const parsedViewBox = parseViewBox(rawViewBox || null);
  const hasViewBox = rawViewBox.length > 0;
  const hasValid = parsedViewBox !== null;
  const hasInvalid = hasViewBox && !hasValid;
  const width = svg.getAttribute("width")?.trim() ?? "";
  const height = svg.getAttribute("height")?.trim() ?? "";
  const hasFixedDimensions = width.length > 0 && height.length > 0;

  if (hasInvalid) {
    return {
      state: "invalid",
      label: "Invalid",
      title: "Invalid",
      explanation: "The viewBox appears to be invalid.",
      hasFixedDimensions,
      hasValidViewBox: false,
      hasInvalidViewBox: true,
      canGenerateViewBox: false,
    };
  }

  if (hasValid && hasFixedDimensions) {
    return {
      state: "mostly_scalable",
      label: "Mostly",
      title: "Mostly scalable",
      explanation: "This SVG scales correctly but still has fixed dimensions.",
      hasFixedDimensions: true,
      hasValidViewBox: true,
      hasInvalidViewBox: false,
      canGenerateViewBox: false,
    };
  }

  if (hasValid) {
    return {
      state: "scalable",
      label: "Yes",
      title: "Scalable",
      explanation: "This SVG scales correctly.",
      hasFixedDimensions: false,
      hasValidViewBox: true,
      hasInvalidViewBox: false,
      canGenerateViewBox: false,
    };
  }

  return {
    state: "not_scalable",
    label: "No",
    title: "Not scalable",
    explanation: "This SVG is missing a viewBox.",
    hasFixedDimensions,
    hasValidViewBox: false,
    hasInvalidViewBox: false,
    canGenerateViewBox: canGenerateViewBox(svg),
  };
}
