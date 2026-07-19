import {
  validateCustomViewBoxValues,
} from "./geometry-math";
import {
  parseDimensionAttribute,
  parseViewBox,
  type ParsedViewBox,
} from "./viewbox";

export type GeometryViewBoxSource = "explicit" | "derived" | "unavailable";

export type SvgGeometryInfo = {
  rawViewBox: string | null;
  explicitViewBox: ParsedViewBox | null;
  effectiveViewBox: ParsedViewBox | null;
  viewBoxSource: GeometryViewBoxSource;
  width: string | null;
  height: string | null;
  numericWidth: number | null;
  numericHeight: number | null;
  preserveAspectRatio: string | null;
  isSquare: boolean;
  outputDimensionsDifferFromCanvas: boolean;
  warnings: string[];
};

export type CustomViewBoxInput = {
  minX: string;
  minY: string;
  width: string;
  height: string;
};

export function createDerivedViewBox(
  width: number | null,
  height: number | null,
): ParsedViewBox | null {
  if (width === null || height === null) {
    return null;
  }

  return {
    minX: 0,
    minY: 0,
    width,
    height,
  };
}

export function extractSvgGeometry(svg: SVGSVGElement): SvgGeometryInfo {
  const rawViewBox = svg.getAttribute("viewBox")?.trim() || null;
  const explicitViewBox = parseViewBox(rawViewBox);
  const width = svg.getAttribute("width")?.trim() || null;
  const height = svg.getAttribute("height")?.trim() || null;
  const numericWidth = parseDimensionAttribute(width);
  const numericHeight = parseDimensionAttribute(height);
  const derivedViewBox = createDerivedViewBox(numericWidth, numericHeight);
  const effectiveViewBox = explicitViewBox ?? derivedViewBox;
  const preserveAspectRatio = svg.getAttribute("preserveAspectRatio")?.trim() || null;
  const warnings: string[] = [];

  if (!explicitViewBox && derivedViewBox) {
    warnings.push("The current canvas is derived from numeric width and height because no valid viewBox exists.");
  }

  if (!effectiveViewBox) {
    warnings.push("Geometry controls require a valid viewBox or numeric width and height.");
  }

  const outputDimensionsDifferFromCanvas =
    effectiveViewBox !== null &&
    numericWidth !== null &&
    numericHeight !== null &&
    (
      Math.abs(numericWidth - effectiveViewBox.width) > 0.001 ||
      Math.abs(numericHeight - effectiveViewBox.height) > 0.001
    );

  if (outputDimensionsDifferFromCanvas) {
    warnings.push("Output width and height currently differ from the canvas dimensions.");
  }

  return {
    rawViewBox,
    explicitViewBox,
    effectiveViewBox,
    viewBoxSource:
      explicitViewBox
        ? "explicit"
        : derivedViewBox
          ? "derived"
          : "unavailable",
    width,
    height,
    numericWidth,
    numericHeight,
    preserveAspectRatio,
    isSquare:
      effectiveViewBox !== null &&
      Math.abs(effectiveViewBox.width - effectiveViewBox.height) < 0.001,
    outputDimensionsDifferFromCanvas,
    warnings,
  };
}

export function validateCustomViewBox(
  input: CustomViewBoxInput,
): { valid: true; value: ParsedViewBox } | { valid: false; error: string } {
  return validateCustomViewBoxValues(input);
}

export function areOutputDimensionsEqual(
  currentWidth: number | null,
  currentHeight: number | null,
  nextWidth: number,
  nextHeight: number,
): boolean {
  if (currentWidth === null || currentHeight === null) {
    return false;
  }

  return (
    Math.abs(currentWidth - nextWidth) < 0.001 &&
    Math.abs(currentHeight - nextHeight) < 0.001
  );
}

export function getGeometryAttributeSnapshot(svg: SVGSVGElement): {
  viewBox: string | null;
  width: string | null;
  height: string | null;
  preserveAspectRatio: string | null;
} {
  return {
    viewBox: svg.getAttribute("viewBox")?.trim() || null,
    width: svg.getAttribute("width")?.trim() || null,
    height: svg.getAttribute("height")?.trim() || null,
    preserveAspectRatio: svg.getAttribute("preserveAspectRatio")?.trim() || null,
  };
}

export function areGeometryAttributesEqual(
  left: ReturnType<typeof getGeometryAttributeSnapshot>,
  right: ReturnType<typeof getGeometryAttributeSnapshot>,
): boolean {
  return (
    left.viewBox === right.viewBox &&
    left.width === right.width &&
    left.height === right.height &&
    left.preserveAspectRatio === right.preserveAspectRatio
  );
}
