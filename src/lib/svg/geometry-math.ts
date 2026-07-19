import type { ParsedViewBox } from "./viewbox";

function roundGeometryValue(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export function formatGeometryNumber(value: number): string {
  const rounded = roundGeometryValue(value);

  return Number.isInteger(rounded)
    ? String(rounded)
    : String(rounded);
}

export function formatViewBox(box: ParsedViewBox): string {
  return [
    formatGeometryNumber(box.minX),
    formatGeometryNumber(box.minY),
    formatGeometryNumber(box.width),
    formatGeometryNumber(box.height),
  ].join(" ");
}

export function areViewBoxesEqual(
  left: ParsedViewBox | null,
  right: ParsedViewBox | null,
): boolean {
  if (!left || !right) {
    return left === right;
  }

  return (
    Math.abs(left.minX - right.minX) < 0.001 &&
    Math.abs(left.minY - right.minY) < 0.001 &&
    Math.abs(left.width - right.width) < 0.001 &&
    Math.abs(left.height - right.height) < 0.001
  );
}

export function normalizeToSquareCanvas(box: ParsedViewBox): ParsedViewBox {
  const size = Math.max(box.width, box.height);
  const offsetX = (size - box.width) / 2;
  const offsetY = (size - box.height) / 2;

  return {
    minX: roundGeometryValue(box.minX - offsetX),
    minY: roundGeometryValue(box.minY - offsetY),
    width: roundGeometryValue(size),
    height: roundGeometryValue(size),
  };
}

export function expandViewBoxWithPadding(
  box: ParsedViewBox,
  padding: number,
): ParsedViewBox {
  return {
    minX: roundGeometryValue(box.minX - padding),
    minY: roundGeometryValue(box.minY - padding),
    width: roundGeometryValue(box.width + padding * 2),
    height: roundGeometryValue(box.height + padding * 2),
  };
}

export function detectUniformPadding(
  base: ParsedViewBox | null,
  candidate: ParsedViewBox | null,
): number | null {
  if (!base || !candidate) {
    return null;
  }

  const paddingX = candidate.minX - base.minX;
  const paddingY = candidate.minY - base.minY;
  const widthDelta = candidate.width - base.width;
  const heightDelta = candidate.height - base.height;

  const normalizedPaddingX = roundGeometryValue(-paddingX);
  const normalizedPaddingY = roundGeometryValue(-paddingY);

  if (
    normalizedPaddingX < 0 ||
    Math.abs(normalizedPaddingX - normalizedPaddingY) > 0.001 ||
    Math.abs(widthDelta - normalizedPaddingX * 2) > 0.001 ||
    Math.abs(heightDelta - normalizedPaddingX * 2) > 0.001
  ) {
    return null;
  }

  return normalizedPaddingX;
}

export function getViewBoxDelta(
  from: ParsedViewBox | null,
  to: ParsedViewBox | null,
): ParsedViewBox | null {
  if (!from || !to) {
    return null;
  }

  return {
    minX: roundGeometryValue(to.minX - from.minX),
    minY: roundGeometryValue(to.minY - from.minY),
    width: roundGeometryValue(to.width - from.width),
    height: roundGeometryValue(to.height - from.height),
  };
}

export function validateCustomViewBoxValues(
  input: {
    minX: string;
    minY: string;
    width: string;
    height: string;
  },
): { valid: true; value: ParsedViewBox } | { valid: false; error: string } {
  const minX = Number(input.minX);
  const minY = Number(input.minY);
  const width = Number(input.width);
  const height = Number(input.height);

  if ([minX, minY, width, height].some((value) => !Number.isFinite(value))) {
    return {
      valid: false,
      error: "Custom viewBox values must be finite numbers.",
    };
  }

  if (width <= 0 || height <= 0) {
    return {
      valid: false,
      error: "Custom viewBox width and height must be greater than zero.",
    };
  }

  return {
    valid: true,
    value: {
      minX: roundGeometryValue(minX),
      minY: roundGeometryValue(minY),
      width: roundGeometryValue(width),
      height: roundGeometryValue(height),
    },
  };
}

export function calculateLockedOutputSize(
  targetLongestSide: number,
  reference: ParsedViewBox,
): { width: number; height: number } {
  const scale = targetLongestSide / Math.max(reference.width, reference.height);

  return {
    width: roundGeometryValue(reference.width * scale),
    height: roundGeometryValue(reference.height * scale),
  };
}
