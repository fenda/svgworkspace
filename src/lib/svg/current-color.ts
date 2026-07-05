export type PaintAttribute = "fill" | "stroke";

const NON_TRANSFORMABLE_PAINT_VALUES = new Set([
  "none",
  "transparent",
  "currentcolor",
  "inherit",
  "unset",
  "initial",
  "context-fill",
  "context-stroke",
]);

function normalizePaintValue(value: string): string {
  return value.trim();
}

function hasVariableReference(value: string): boolean {
  return value.includes("var(");
}

function isPaintServer(value: string): boolean {
  return value.startsWith("url(");
}

export function isIgnoredPaintValue(value: string): boolean {
  const normalizedValue = normalizePaintValue(value);
  const lowerValue = normalizedValue.toLowerCase();

  return (
    NON_TRANSFORMABLE_PAINT_VALUES.has(lowerValue) ||
    hasVariableReference(lowerValue) ||
    isPaintServer(lowerValue)
  );
}

export function getStylePaintValue(
  style: string,
  attribute: PaintAttribute,
): string | null {
  const pattern = new RegExp(`${attribute}\\s*:\\s*([^;]+)`, "i");
  const match = style.match(pattern);

  return match?.[1]?.trim() ?? null;
}

export function hasHardcodedPaint(
  svg: SVGSVGElement,
  attribute: PaintAttribute,
): boolean {
  return Array.from(svg.querySelectorAll("*")).some((element) => {
    const paint =
      element.getAttribute(attribute)?.trim() ??
      getStylePaintValue(element.getAttribute("style") ?? "", attribute);

    return Boolean(paint && !isIgnoredPaintValue(paint));
  });
}

export function isTransformableCurrentColorPaintValue(value: string): boolean {
  const normalizedValue = normalizePaintValue(value);

  if (isIgnoredPaintValue(normalizedValue)) {
    return false;
  }

  if (typeof CSS !== "undefined" && typeof CSS.supports === "function") {
    return CSS.supports("color", normalizedValue);
  }

  return (
    /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(normalizedValue) ||
    /^(?:rgb|rgba|hsl|hsla)\(/i.test(normalizedValue) ||
    /^[a-z]+$/i.test(normalizedValue)
  );
}

export function hasTransformableCurrentColorAttribute(
  svg: SVGSVGElement,
  attribute: PaintAttribute,
): boolean {
  return Array.from(svg.querySelectorAll("*")).some((element) => {
    const paint = element.getAttribute(attribute)?.trim();

    return Boolean(
      paint && isTransformableCurrentColorPaintValue(paint),
    );
  });
}
