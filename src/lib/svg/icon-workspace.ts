import {
  areGeometryAttributesEqual,
  areOutputDimensionsEqual,
  areViewBoxesEqual,
  expandViewBoxWithPadding,
  extractSvgGeometry,
  formatGeometryNumber,
  formatViewBox,
  getGeometryAttributeSnapshot,
  normalizeToSquareCanvas,
  type SvgGeometryInfo,
} from "@/lib/svg";
import {
  isIgnoredPaintValue,
  isTransformableCurrentColorPaintValue,
  type PaintAttribute,
} from "@/lib/svg/current-color";
import type { ParsedViewBox } from "@/lib/svg/viewbox";
import {
  parseStyleDeclarations,
  type ParsedStyleDeclaration,
} from "@/lib/svg/inline-styles";

type PaintProperty = PaintAttribute;

const EXCLUDED_ANCESTOR_SELECTOR = [
  "defs",
  "clipPath",
  "mask",
  "filter",
  "linearGradient",
  "radialGradient",
  "pattern",
  "marker",
  "symbol",
].join(",");

const EDITABLE_GRAPHICS_SELECTOR = [
  "path",
  "circle",
  "rect",
  "ellipse",
  "line",
  "polygon",
  "polyline",
  "text",
  "use",
].join(",");

function isEditableElement(element: Element): boolean {
  return !element.closest(EXCLUDED_ANCESTOR_SELECTOR);
}

function getEditableElements(svg: SVGSVGElement): Element[] {
  return Array.from(svg.querySelectorAll(EDITABLE_GRAPHICS_SELECTOR)).filter(
    isEditableElement,
  );
}

function setAttributeIfChanged(
  element: Element,
  name: string,
  value: string | null,
): boolean {
  const currentValue = element.getAttribute(name);

  if (value === null) {
    if (currentValue !== null) {
      element.removeAttribute(name);
      return true;
    }

    return false;
  }

  if (currentValue !== value) {
    element.setAttribute(name, value);
    return true;
  }

  return false;
}

function updateStyleDeclarations(
  element: Element,
  property: PaintProperty,
  updater: (value: string) => string | null,
): boolean {
  const rawStyle = element.getAttribute("style")?.trim() ?? "";
  const declarations = parseStyleDeclarations(rawStyle);

  if (!declarations || declarations.length === 0) {
    return false;
  }

  let changed = false;
  const nextDeclarations: ParsedStyleDeclaration[] = [];

  declarations.forEach((declaration) => {
    if (declaration.property !== property) {
      nextDeclarations.push(declaration);
      return;
    }

    const nextValue = updater(declaration.value);

    if (nextValue === null) {
      changed = true;
      return;
    }

    if (nextValue !== declaration.value) {
      changed = true;
    }

    nextDeclarations.push({ ...declaration, value: nextValue });
  });

  if (!changed) {
    return false;
  }

  if (nextDeclarations.length === 0) {
    element.removeAttribute("style");
    return true;
  }

  element.setAttribute(
    "style",
    nextDeclarations
      .map((declaration) => `${declaration.property}: ${declaration.value}`)
      .join("; "),
  );

  return true;
}

function getInlineStylePaintValues(
  element: Element,
  property: PaintProperty,
): string[] {
  const declarations = parseStyleDeclarations(element.getAttribute("style") ?? "");

  if (!declarations) {
    return [];
  }

  return declarations
    .filter((declaration) => declaration.property === property)
    .map((declaration) => declaration.value.trim())
    .filter(Boolean);
}

function isEligibleSolidPaintValue(value: string): boolean {
  return (
    !isIgnoredPaintValue(value) &&
    isTransformableCurrentColorPaintValue(value)
  );
}

function isExplicitPaintValue(value: string): boolean {
  return !isIgnoredPaintValue(value);
}

export function getCurrentColorEligibleCount(svg: SVGSVGElement): number {
  let count = 0;

  getEditableElements(svg).forEach((element) => {
    (["fill", "stroke"] as const).forEach((property) => {
      const attributeValue = element.getAttribute(property)?.trim();

      if (attributeValue && isEligibleSolidPaintValue(attributeValue)) {
        count += 1;
      }

      getInlineStylePaintValues(element, property).forEach((value) => {
        if (isEligibleSolidPaintValue(value)) {
          count += 1;
        }
      });
    });
  });

  return count;
}

export function convertSolidColorsToCurrentColor(svg: SVGSVGElement): number {
  let changedCount = 0;

  getEditableElements(svg).forEach((element) => {
    (["fill", "stroke"] as const).forEach((property) => {
      const attributeValue = element.getAttribute(property)?.trim();

      if (attributeValue && isEligibleSolidPaintValue(attributeValue)) {
        if (setAttributeIfChanged(element, property, "currentColor")) {
          changedCount += 1;
        }
      }

      changedCount += Number(
        updateStyleDeclarations(element, property, (value) => {
          return isEligibleSolidPaintValue(value) ? "currentColor" : value;
        }),
      );
    });
  });

  return changedCount;
}

export function getRemovablePaintCount(
  svg: SVGSVGElement,
  property: PaintProperty,
): number {
  let count = 0;

  getEditableElements(svg).forEach((element) => {
    const attributeValue = element.getAttribute(property)?.trim();

    if (attributeValue && isExplicitPaintValue(attributeValue)) {
      count += 1;
    }

    getInlineStylePaintValues(element, property).forEach((value) => {
      if (isExplicitPaintValue(value)) {
        count += 1;
      }
    });
  });

  return count;
}

export function removePaint(
  svg: SVGSVGElement,
  property: PaintProperty,
): number {
  let changedCount = 0;

  getEditableElements(svg).forEach((element) => {
    const attributeValue = element.getAttribute(property)?.trim();

    if (attributeValue && isExplicitPaintValue(attributeValue)) {
      if (setAttributeIfChanged(element, property, "none")) {
        changedCount += 1;
      }
    }

    changedCount += Number(
      updateStyleDeclarations(element, property, (value) => {
        return isExplicitPaintValue(value) ? "none" : value;
      }),
    );
  });

  return changedCount;
}

export function getInlinePaintAttributeCount(
  svg: SVGSVGElement,
  property: PaintProperty,
): number {
  return getEditableElements(svg).filter((element) => {
    return Boolean(element.getAttribute(property)?.trim());
  }).length;
}

export function removeInlinePaintAttributes(
  svg: SVGSVGElement,
  property: PaintProperty,
): number {
  let changedCount = 0;

  getEditableElements(svg).forEach((element) => {
    if (setAttributeIfChanged(element, property, null)) {
      changedCount += 1;
    }
  });

  return changedCount;
}

function setRootAttribute(
  svg: SVGSVGElement,
  name: string,
  value: string | null,
): boolean {
  const currentValue = svg.getAttribute(name)?.trim() || null;

  if (value === null) {
    if (currentValue !== null) {
      svg.removeAttribute(name);
      return true;
    }

    return false;
  }

  if (currentValue !== value) {
    svg.setAttribute(name, value);
    return true;
  }

  return false;
}

export function getGeometryInfo(svg: SVGSVGElement): SvgGeometryInfo {
  return extractSvgGeometry(svg);
}

export function canNormalizeSquareCanvas(svg: SVGSVGElement): boolean {
  const geometry = getGeometryInfo(svg);

  return Boolean(geometry.effectiveViewBox && !geometry.isSquare);
}

export function normalizeSquareCanvas(svg: SVGSVGElement): boolean {
  const geometry = getGeometryInfo(svg);

  if (!geometry.effectiveViewBox || geometry.isSquare) {
    return false;
  }

  return setRootAttribute(
    svg,
    "viewBox",
    formatViewBox(normalizeToSquareCanvas(geometry.effectiveViewBox)),
  );
}

export function canApplyPadding(svg: SVGSVGElement): boolean {
  return getGeometryInfo(svg).effectiveViewBox !== null;
}

export function applyUniformPadding(
  svg: SVGSVGElement,
  padding: number,
): boolean {
  const geometry = getGeometryInfo(svg);

  if (!geometry.effectiveViewBox || padding < 0) {
    return false;
  }

  return setRootAttribute(
    svg,
    "viewBox",
    formatViewBox(expandViewBoxWithPadding(geometry.effectiveViewBox, padding)),
  );
}

export function canRemovePadding(
  svg: SVGSVGElement,
  originalSvg: SVGSVGElement,
): boolean {
  const currentGeometry = getGeometryInfo(svg);
  const originalGeometry = getGeometryInfo(originalSvg);

  return (
    currentGeometry.effectiveViewBox !== null &&
    originalGeometry.effectiveViewBox !== null &&
    !areViewBoxesEqual(
      currentGeometry.effectiveViewBox,
      originalGeometry.effectiveViewBox,
    )
  );
}

export function removePaddingFromCanvas(
  svg: SVGSVGElement,
  originalSvg: SVGSVGElement,
): boolean {
  const originalGeometry = getGeometryInfo(originalSvg);

  if (!originalGeometry.effectiveViewBox) {
    return false;
  }

  return setRootAttribute(
    svg,
    "viewBox",
    formatViewBox(originalGeometry.effectiveViewBox),
  );
}

export function canResetCanvas(
  svg: SVGSVGElement,
  originalSvg: SVGSVGElement,
): boolean {
  return !areGeometryAttributesEqual(
    getGeometryAttributeSnapshot(svg),
    getGeometryAttributeSnapshot(originalSvg),
  );
}

export function resetCanvasGeometry(
  svg: SVGSVGElement,
  originalSvg: SVGSVGElement,
): number {
  const originalSnapshot = getGeometryAttributeSnapshot(originalSvg);

  let changed = 0;
  changed += Number(setRootAttribute(svg, "viewBox", originalSnapshot.viewBox));
  changed += Number(setRootAttribute(svg, "width", originalSnapshot.width));
  changed += Number(setRootAttribute(svg, "height", originalSnapshot.height));
  changed += Number(
    setRootAttribute(
      svg,
      "preserveAspectRatio",
      originalSnapshot.preserveAspectRatio,
    ),
  );

  return changed;
}

export function applyCustomViewBox(
  svg: SVGSVGElement,
  nextViewBox: ParsedViewBox,
): boolean {
  return setRootAttribute(svg, "viewBox", formatViewBox(nextViewBox));
}

export function getOutputSizeApplicability(
  svg: SVGSVGElement,
  width: number,
  height: number,
): boolean {
  const geometry = getGeometryInfo(svg);

  return !areOutputDimensionsEqual(
    geometry.numericWidth,
    geometry.numericHeight,
    width,
    height,
  );
}

export function applyOutputSize(
  svg: SVGSVGElement,
  width: number,
  height: number,
): number {
  let changed = 0;
  changed += Number(setRootAttribute(svg, "width", formatGeometryNumber(width)));
  changed += Number(setRootAttribute(svg, "height", formatGeometryNumber(height)));
  return changed;
}
