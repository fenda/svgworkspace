import { parseSvgMarkup } from "@/lib/svg/parse";
import { formatViewBox } from "@/lib/svg";
import type { SvgDocument } from "@/lib/svg/types";
import {
  applyCustomViewBox,
  applyOutputSize,
  applyUniformPadding,
  canApplyPadding,
  canNormalizeSquareCanvas,
  canRemovePadding,
  canResetCanvas,
  convertSolidColorsToCurrentColor,
  getGeometryInfo,
  getCurrentColorEligibleCount,
  getInlinePaintAttributeCount,
  getOutputSizeApplicability,
  getRemovablePaintCount,
  normalizeSquareCanvas,
  removeInlinePaintAttributes,
  removePaddingFromCanvas,
  removePaint,
  resetCanvasGeometry,
} from "@/lib/svg/icon-workspace";
import type { ParsedViewBox } from "@/lib/svg/viewbox";

export type IconWorkspaceCategory = "appearance" | "structure" | "canvas";
export type IconWorkspaceTransformationPayload = {
  padding?: number;
  viewBox?: ParsedViewBox;
  width?: number;
  height?: number;
};

export type TransformationApplicability = {
  applicable: boolean;
  reason?: string;
};

export type TransformationResult = {
  svgMarkup: string;
  changed: boolean;
  summary?: string;
  changeCount?: number;
};

export type SvgTransformation = {
  id: string;
  label: string;
  description: string;
  category: IconWorkspaceCategory;
  listedInOverview?: boolean;
  isApplicable: (
    svg: SVGSVGElement,
    originalSvg: SVGSVGElement,
    payload?: IconWorkspaceTransformationPayload,
  ) => TransformationApplicability;
  apply: (
    svg: SVGSVGElement,
    originalSvg: SVGSVGElement,
    payload?: IconWorkspaceTransformationPayload,
  ) => TransformationResult;
};

export type IconWorkspaceTransformationState = {
  id: string;
  label: string;
  description: string;
  category: IconWorkspaceCategory;
  applicability: TransformationApplicability;
};

function formatSummary(
  verb: string,
  subject: string,
  count: number,
): string {
  return `${verb} ${count} ${subject}${count === 1 ? "" : "s"}.`;
}

const transformations: SvgTransformation[] = [
  {
    id: "appearance-currentcolor",
    label: "Convert to currentColor",
    description:
      "Convert eligible solid fill and stroke colors to currentColor without touching gradients, masks, filters, or referenced paint servers.",
    category: "appearance",
    isApplicable: (svg) => {
      const count = getCurrentColorEligibleCount(svg);

      if (count === 0) {
        return {
          applicable: false,
          reason: "No eligible solid colors found.",
        };
      }

      return { applicable: true };
    },
    apply: (svg) => {
      const count = convertSolidColorsToCurrentColor(svg);

      return {
        svgMarkup: "",
        changed: count > 0,
        summary: formatSummary("Converted", "paint value to currentColor", count),
        changeCount: count,
      };
    },
  },
  {
    id: "appearance-remove-fill",
    label: "Remove fill",
    description:
      "Set eligible explicit fill paints to none so the output changes are visible and deterministic.",
    category: "appearance",
    isApplicable: (svg) => {
      const count = getRemovablePaintCount(svg, "fill");

      if (count === 0) {
        return {
          applicable: false,
          reason: "No explicit fill declarations found.",
        };
      }

      return { applicable: true };
    },
    apply: (svg) => {
      const count = removePaint(svg, "fill");

      return {
        svgMarkup: "",
        changed: count > 0,
        summary: formatSummary("Removed", "fill declaration", count),
        changeCount: count,
      };
    },
  },
  {
    id: "appearance-remove-stroke",
    label: "Remove stroke",
    description:
      "Set eligible explicit stroke paints to none so the output changes are visible and deterministic.",
    category: "appearance",
    isApplicable: (svg) => {
      const count = getRemovablePaintCount(svg, "stroke");

      if (count === 0) {
        return {
          applicable: false,
          reason: "No explicit stroke declarations found.",
        };
      }

      return { applicable: true };
    },
    apply: (svg) => {
      const count = removePaint(svg, "stroke");

      return {
        svgMarkup: "",
        changed: count > 0,
        summary: formatSummary("Removed", "stroke declaration", count),
        changeCount: count,
      };
    },
  },
  {
    id: "appearance-remove-inline-fill-attributes",
    label: "Remove inline fill attributes",
    description:
      "Remove only direct element-level fill attributes. This does not change style attributes or embedded CSS.",
    category: "appearance",
    isApplicable: (svg) => {
      const count = getInlinePaintAttributeCount(svg, "fill");

      if (count === 0) {
        return {
          applicable: false,
          reason: "No inline fill attributes found.",
        };
      }

      return { applicable: true };
    },
    apply: (svg) => {
      const count = removeInlinePaintAttributes(svg, "fill");

      return {
        svgMarkup: "",
        changed: count > 0,
        summary: formatSummary("Removed", "fill attribute", count),
        changeCount: count,
      };
    },
  },
  {
    id: "appearance-remove-inline-stroke-attributes",
    label: "Remove inline stroke attributes",
    description:
      "Remove only direct element-level stroke attributes. This does not change style attributes or embedded CSS.",
    category: "appearance",
    isApplicable: (svg) => {
      const count = getInlinePaintAttributeCount(svg, "stroke");

      if (count === 0) {
        return {
          applicable: false,
          reason: "No inline stroke attributes found.",
        };
      }

      return { applicable: true };
    },
    apply: (svg) => {
      const count = removeInlinePaintAttributes(svg, "stroke");

      return {
        svgMarkup: "",
        changed: count > 0,
        summary: formatSummary("Removed", "stroke attribute", count),
        changeCount: count,
      };
    },
  },
  {
    id: "geometry-square-canvas",
    label: "Square canvas",
    description:
      "Expand the current viewBox to a square canvas without scaling paths or moving the artwork coordinates.",
    category: "canvas",
    listedInOverview: false,
    isApplicable: (svg) => {
      if (!getGeometryInfo(svg).effectiveViewBox) {
        return {
          applicable: false,
          reason: "No valid viewBox or numeric width and height are available.",
        };
      }

      if (!canNormalizeSquareCanvas(svg)) {
        return {
          applicable: false,
          reason: "The current canvas is already square.",
        };
      }

      return { applicable: true };
    },
    apply: (svg) => ({
      svgMarkup: "",
      changed: normalizeSquareCanvas(svg),
      summary: "Normalized to a square canvas.",
      changeCount: 1,
    }),
  },
  {
    id: "geometry-add-padding",
    label: "Add padding",
    description:
      "Expand the current effective viewBox by a uniform padding value without moving paths.",
    category: "canvas",
    listedInOverview: false,
    isApplicable: (svg, _originalSvg, payload) => {
      const padding = payload?.padding;

      if (typeof padding !== "number" || !Number.isFinite(padding) || padding < 0) {
        return {
          applicable: false,
          reason: "Choose a valid padding amount.",
        };
      }

      if (padding === 0) {
        return {
          applicable: false,
          reason: "Padding 0 would not change the current canvas.",
        };
      }

      if (!canApplyPadding(svg)) {
        return {
          applicable: false,
          reason: "No valid viewBox or numeric width and height are available.",
        };
      }

      return { applicable: true };
    },
    apply: (svg, _originalSvg, payload) => {
      const padding = payload?.padding ?? 0;

      return {
        svgMarkup: "",
        changed: applyUniformPadding(svg, padding),
        summary: `Added ${padding}px of uniform canvas padding.`,
        changeCount: 1,
      };
    },
  },
  {
    id: "geometry-remove-padding",
    label: "Remove padding",
    description:
      "Restore the original effective canvas instead of attempting to reverse padding math from the current SVG.",
    category: "canvas",
    listedInOverview: false,
    isApplicable: (svg, originalSvg) => {
      if (!canRemovePadding(svg, originalSvg)) {
        return {
          applicable: false,
          reason: "The current canvas already matches the original effective canvas.",
        };
      }

      return { applicable: true };
    },
    apply: (svg, originalSvg) => ({
      svgMarkup: "",
      changed: removePaddingFromCanvas(svg, originalSvg),
      summary: "Restored the original canvas viewBox.",
      changeCount: 1,
    }),
  },
  {
    id: "geometry-reset-canvas",
    label: "Reset canvas",
    description:
      "Restore the original viewBox, width, height, and preserveAspectRatio without undoing appearance changes.",
    category: "canvas",
    listedInOverview: false,
    isApplicable: (svg, originalSvg) => {
      if (!canResetCanvas(svg, originalSvg)) {
        return {
          applicable: false,
          reason: "Canvas attributes already match the original SVG.",
        };
      }

      return { applicable: true };
    },
    apply: (svg, originalSvg) => {
      const count = resetCanvasGeometry(svg, originalSvg);

      return {
        svgMarkup: "",
        changed: count > 0,
        summary: "Reset canvas geometry to the original SVG.",
        changeCount: count,
      };
    },
  },
  {
    id: "geometry-set-viewbox",
    label: "Set viewBox",
    description: "Apply a custom viewBox to the current SVG canvas.",
    category: "canvas",
    listedInOverview: false,
    isApplicable: (_svg, _originalSvg, payload) => {
      if (!payload?.viewBox) {
        return {
          applicable: false,
          reason: "Enter a valid custom viewBox first.",
        };
      }

      const currentGeometry = getGeometryInfo(_svg);
      const nextViewBox = formatViewBox(payload.viewBox);

      if (currentGeometry.rawViewBox === nextViewBox) {
        return {
          applicable: false,
          reason: "The SVG already uses that exact viewBox.",
        };
      }

      return { applicable: true };
    },
    apply: (svg, _originalSvg, payload) => ({
      svgMarkup: "",
      changed: payload?.viewBox ? applyCustomViewBox(svg, payload.viewBox) : false,
      summary: "Applied a custom viewBox.",
      changeCount: 1,
    }),
  },
  {
    id: "geometry-set-output-size",
    label: "Set output size",
    description: "Update only width and height for export without changing the viewBox.",
    category: "canvas",
    listedInOverview: false,
    isApplicable: (svg, _originalSvg, payload) => {
      const width = payload?.width;
      const height = payload?.height;

      if (
        typeof width !== "number" ||
        typeof height !== "number" ||
        !Number.isFinite(width) ||
        !Number.isFinite(height) ||
        width <= 0 ||
        height <= 0
      ) {
        return {
          applicable: false,
          reason: "Output width and height must be finite numbers greater than zero.",
        };
      }

      if (!getOutputSizeApplicability(svg, width, height)) {
        return {
          applicable: false,
          reason: "Output size already matches those dimensions.",
        };
      }

      return { applicable: true };
    },
    apply: (svg, _originalSvg, payload) => {
      const width = payload?.width ?? 0;
      const height = payload?.height ?? 0;
      const count = applyOutputSize(svg, width, height);

      return {
        svgMarkup: "",
        changed: count > 0,
        summary: `Set output size to ${width} × ${height}.`,
        changeCount: count,
      };
    },
  },
];

function getTransformationById(id: string): SvgTransformation {
  const transformation = transformations.find((item) => item.id === id);

  if (!transformation) {
    throw new Error(`Unknown icon workspace transformation: ${id}`);
  }

  return transformation;
}

export function getIconWorkspaceTransformationStates(
  content: string,
  originalContent: string,
): IconWorkspaceTransformationState[] {
  const svg = parseSvgMarkup(content.trim());
  const originalSvg = parseSvgMarkup(originalContent.trim());

  return transformations
    .filter((transformation) => transformation.listedInOverview !== false)
    .map((transformation) => ({
    id: transformation.id,
    label: transformation.label,
    description: transformation.description,
    category: transformation.category,
    applicability: transformation.isApplicable(svg, originalSvg),
    }));
}

export function getIconWorkspaceTransformationApplicability(
  content: string,
  originalContent: string,
  transformationId: string,
  payload?: IconWorkspaceTransformationPayload,
): TransformationApplicability {
  const transformation = getTransformationById(transformationId);
  const svg = parseSvgMarkup(content.trim());
  const originalSvg = parseSvgMarkup(originalContent.trim());

  return transformation.isApplicable(svg, originalSvg, payload);
}

export function executeIconWorkspaceTransformation(
  content: string,
  originalContent: string,
  transformationId: string,
  payload?: IconWorkspaceTransformationPayload,
): TransformationResult {
  const transformation = getTransformationById(transformationId);
  const svg = parseSvgMarkup(content.trim());
  const originalSvg = parseSvgMarkup(originalContent.trim());
  const applicability = transformation.isApplicable(svg, originalSvg, payload);

  if (!applicability.applicable) {
    throw new Error(
      applicability.reason || `${transformation.label} is not applicable to the current SVG.`,
    );
  }

  const result = transformation.apply(svg, originalSvg, payload);

  if (!result.changed) {
    throw new Error(`${transformation.label} did not produce a change.`);
  }

  return {
    ...result,
    svgMarkup: svg.outerHTML,
  };
}

export function getIconWorkspaceTransformationLabel(id: string): string {
  return getTransformationById(id).label;
}

export function isIconWorkspaceEligible(document: SvgDocument | null): boolean {
  if (!document) {
    return false;
  }

  return document.symbols.length === 0;
}
