import { parseSvgMarkup, serializeSvg } from "@/lib/svg/parse";
import type { Finding } from "@/analysis";
import { getByteLength } from "@/lib/svg/metadata";
import { getInlineableCssRuleCount } from "@/lib/svg/css-classes";
import {
  getUnusedDefinitionIds,
  hasEmptyDefs,
  hasEmptySymbols,
} from "@/lib/svg/defs";
import {
  canConvertInlineStylesToAttributes,
  getStyledElementCount,
} from "@/lib/svg/inline-styles";
import { getUnusedNamespacePrefixes } from "@/lib/svg/namespaces";
import { hasValidViewBox } from "@/lib/svg/viewbox";
import type {
  OptimizationChange,
  OptimizationReport,
  OptimizationStep,
} from "@/lib/svg/types";
import { convertInlineStyles } from "./fixes/convert-inline-styles-to-attributes";
import { getCommentCount, removeComments } from "./fixes/remove-comments";
import { inlineCssClasses } from "./fixes/inline-css-classes";
import { removeEmptyDefs } from "./fixes/remove-empty-defs";
import { removeFixedDimensions } from "./fixes/remove-fixed-dimensions";
import { removeEmptySymbols } from "./fixes/remove-empty-symbols";
import { countHighPrecisionNumbers, roundDecimals } from "./fixes/round-decimals";
import { removeEmptyGroups } from "./fixes/remove-empty-groups";
import { removeEmptyPaths } from "./fixes/remove-empty-paths";
import { getHiddenElementCount, removeHiddenElements } from "./fixes/remove-hidden-elements";
import { removeMetadata } from "./fixes/remove-metadata";
import { removeUnusedDefs } from "./fixes/remove-unused-defs";
import { removeUnusedNamespaces } from "./fixes/remove-unused-namespaces";

type SafeFix = (svg: SVGSVGElement) => void;
type SafeFixDefinition = {
  id: string;
  label: string;
  description: string;
  apply: SafeFix;
  getApplicability?: (svg: SVGSVGElement) => boolean;
  getChanges?: (
    beforeSvg: SVGSVGElement,
    afterSvg: SVGSVGElement,
  ) => OptimizationChange[];
};

const SAFE_FIXES_BY_FINDING_ID: Record<string, SafeFixDefinition> = {
  PERFORMANCE_001: {
    id: "remove-metadata",
    label: "Remove metadata",
    description: "Remove embedded metadata nodes that do not affect rendering.",
    apply: removeMetadata,
    getApplicability: (svg) => svg.querySelectorAll("metadata").length > 0,
    getChanges: (beforeSvg) => {
      const count = beforeSvg.querySelectorAll("metadata").length;
      return count > 0
        ? [{ type: "metadata_removed", label: "Metadata nodes removed", count }]
        : [];
    },
  },
  PERFORMANCE_002: {
    id: "remove-comments",
    label: "Remove comments",
    description: "Strip XML comments from the SVG tree.",
    apply: removeComments,
    getApplicability: (svg) => getCommentCount(svg) > 0,
    getChanges: (beforeSvg) => {
      const count = getCommentCount(beforeSvg);
      return count > 0
        ? [{ type: "comments_removed", label: "Comments removed", count }]
        : [];
    },
  },
  PERFORMANCE_003: {
    id: "round-decimals",
    label: "Round decimal precision",
    description: "Normalize high-precision numeric values in SVG attributes.",
    apply: roundDecimals,
    getApplicability: (svg) => countHighPrecisionNumbers(svg) > 0,
    getChanges: (beforeSvg, afterSvg) => {
      const count = Math.max(
        0,
        countHighPrecisionNumbers(beforeSvg) - countHighPrecisionNumbers(afterSvg),
      );
      return count > 0
        ? [{ type: "numbers_rounded", label: "Numeric values rounded", count }]
        : [];
    },
  },
  PERFORMANCE_004: {
    id: "remove-hidden-elements",
    label: "Remove hidden elements",
    description: "Remove elements hidden by display, visibility, or zero opacity.",
    apply: removeHiddenElements,
    getApplicability: (svg) => getHiddenElementCount(svg) > 0,
    getChanges: (beforeSvg) => {
      const count = getHiddenElementCount(beforeSvg);
      return count > 0
        ? [{ type: "hidden_elements_removed", label: "Hidden elements removed", count }]
        : [];
    },
  },
  PERFORMANCE_005: {
    id: "remove-unused-definitions",
    label: "Remove unused definitions",
    description: "Remove unreferenced gradients, patterns, masks, and similar defs.",
    apply: removeUnusedDefs,
    getApplicability: (svg) => getUnusedDefinitionIds(svg).length > 0,
    getChanges: (beforeSvg) => {
      const count = getUnusedDefinitionIds(beforeSvg).length;
      return count > 0
        ? [{ type: "unused_definitions_removed", label: "Unused definitions removed", count }]
        : [];
    },
  },
  PERFORMANCE_006: {
    id: "remove-unused-namespaces",
    label: "Remove unused namespaces",
    description: "Remove namespace declarations that are not referenced by the document.",
    apply: removeUnusedNamespaces,
    getApplicability: (svg) => getUnusedNamespacePrefixes(svg).length > 0,
    getChanges: (beforeSvg) => {
      const count = getUnusedNamespacePrefixes(beforeSvg).length;
      return count > 0
        ? [{ type: "unused_namespaces_removed", label: "Unused namespaces removed", count }]
        : [];
    },
  },
  STRUCTURE_002: {
    id: "remove-fixed-dimensions",
    label: "Remove fixed dimensions",
    description: "Remove width and height when the existing viewBox already preserves scaling.",
    apply: removeFixedDimensions,
    getApplicability: (svg) =>
      Boolean(svg.getAttribute("width")?.trim()) &&
      Boolean(svg.getAttribute("height")?.trim()) &&
      hasValidViewBox(svg),
    getChanges: (beforeSvg, afterSvg) => {
      const beforeCount = Number(Boolean(beforeSvg.getAttribute("width"))) +
        Number(Boolean(beforeSvg.getAttribute("height")));
      const afterCount = Number(Boolean(afterSvg.getAttribute("width"))) +
        Number(Boolean(afterSvg.getAttribute("height")));
      const count = Math.max(0, beforeCount - afterCount);
      return count > 0
        ? [{ type: "fixed_dimensions_removed", label: "Dimension attributes removed", count }]
        : [];
    },
  },
  STRUCTURE_004: {
    id: "remove-empty-groups",
    label: "Remove empty groups",
    description: "Remove group wrappers that no longer contain meaningful content.",
    apply: removeEmptyGroups,
    getChanges: (beforeSvg, afterSvg) => {
      const count = Math.max(
        0,
        beforeSvg.querySelectorAll("g").length - afterSvg.querySelectorAll("g").length,
      );
      return count > 0
        ? [{ type: "empty_groups_removed", label: "Groups removed", count }]
        : [];
    },
  },
  STRUCTURE_005: {
    id: "remove-empty-paths",
    label: "Remove empty paths",
    description: "Remove path elements that do not contain drawable path data.",
    apply: removeEmptyPaths,
    getApplicability: (svg) =>
      Array.from(svg.querySelectorAll("path")).some((path) => !path.getAttribute("d")?.trim()),
    getChanges: (beforeSvg, afterSvg) => {
      const count = Math.max(
        0,
        beforeSvg.querySelectorAll("path").length - afterSvg.querySelectorAll("path").length,
      );
      return count > 0
        ? [{ type: "empty_paths_removed", label: "Empty paths removed", count }]
        : [];
    },
  },
  STRUCTURE_006: {
    id: "remove-empty-definitions",
    label: "Remove empty definitions",
    description: "Remove empty defs containers left behind after other cleanup steps.",
    apply: removeEmptyDefs,
    getApplicability: (svg) => hasEmptyDefs(svg),
    getChanges: (beforeSvg, afterSvg) => {
      const count = Math.max(
        0,
        beforeSvg.querySelectorAll("defs").length - afterSvg.querySelectorAll("defs").length,
      );
      return count > 0
        ? [{ type: "empty_defs_removed", label: "Empty defs removed", count }]
        : [];
    },
  },
  STRUCTURE_007: {
    id: "remove-empty-symbols",
    label: "Remove empty symbols",
    description: "Remove symbol elements that do not contain meaningful content.",
    apply: removeEmptySymbols,
    getApplicability: (svg) => hasEmptySymbols(svg),
    getChanges: (beforeSvg, afterSvg) => {
      const count = Math.max(
        0,
        beforeSvg.querySelectorAll("symbol").length - afterSvg.querySelectorAll("symbol").length,
      );
      return count > 0
        ? [{ type: "empty_symbols_removed", label: "Empty symbols removed", count }]
        : [];
    },
  },
  MAINTAINABILITY_001: {
    id: "convert-inline-styles",
    label: "Convert inline styles",
    description: "Convert safe style attributes into SVG presentation attributes.",
    apply: convertInlineStyles,
    getApplicability: (svg) =>
      getStyledElementCount(svg) > 0 && canConvertInlineStylesToAttributes(svg),
    getChanges: (beforeSvg) => {
      const count = getStyledElementCount(beforeSvg);
      return count > 0
        ? [{ type: "inline_styles_converted", label: "Inline styles converted", count }]
        : [];
    },
  },
  MAINTAINABILITY_002: {
    id: "inline-css-classes",
    label: "Inline CSS classes",
    description: "Inline safe embedded CSS class rules into presentation attributes.",
    apply: inlineCssClasses,
    getApplicability: (svg) => getInlineableCssRuleCount(svg) > 0,
    getChanges: (beforeSvg) => {
      const count = getInlineableCssRuleCount(beforeSvg);
      return count > 0
        ? [{ type: "css_rules_inlined", label: "CSS class rules inlined", count }]
        : [];
    },
  },
};

const SAFE_FIX_SEQUENCE: SafeFixDefinition[] = [
  SAFE_FIXES_BY_FINDING_ID.PERFORMANCE_001,
  SAFE_FIXES_BY_FINDING_ID.PERFORMANCE_002,
  SAFE_FIXES_BY_FINDING_ID.PERFORMANCE_004,
  SAFE_FIXES_BY_FINDING_ID.PERFORMANCE_005,
  SAFE_FIXES_BY_FINDING_ID.STRUCTURE_007,
  SAFE_FIXES_BY_FINDING_ID.STRUCTURE_006,
  SAFE_FIXES_BY_FINDING_ID.STRUCTURE_002,
  SAFE_FIXES_BY_FINDING_ID.MAINTAINABILITY_002,
  SAFE_FIXES_BY_FINDING_ID.MAINTAINABILITY_001,
  SAFE_FIXES_BY_FINDING_ID.STRUCTURE_005,
  SAFE_FIXES_BY_FINDING_ID.STRUCTURE_004,
  SAFE_FIXES_BY_FINDING_ID.PERFORMANCE_006,
  SAFE_FIXES_BY_FINDING_ID.PERFORMANCE_003,
];

export type AppliedSafeFixReport = {
  content: string;
  report: OptimizationReport;
};

export function getSafeFixLabelForFinding(findingId: string): string | null {
  return SAFE_FIXES_BY_FINDING_ID[findingId]?.label ?? null;
}

function withParsedSvg(content: string, applyFix: (svg: SVGSVGElement) => void): string {
  const svg = parseSvgMarkup(content.trim());
  applyFix(svg);
  return serializeSvg(svg);
}

export function applySafeFixes(content: string): string {
  return applySafeFixesWithReport(content).content;
}

function buildStepResult({
  step,
  beforeSvg,
  afterSvg,
  beforeMarkup,
  afterMarkup,
}: {
  step: SafeFixDefinition;
  beforeSvg: SVGSVGElement;
  afterSvg: SVGSVGElement;
  beforeMarkup: string;
  afterMarkup: string;
}): OptimizationStep {
  const beforeSizeBytes = getByteLength(beforeMarkup);
  const afterSizeBytes = getByteLength(afterMarkup);
  const savedBytes = beforeSizeBytes - afterSizeBytes;
  const savedPercentage = beforeSizeBytes > 0
    ? (savedBytes / beforeSizeBytes) * 100
    : 0;
  const changed = beforeMarkup !== afterMarkup;

  return {
    id: step.id,
    label: step.label,
    description: step.description,
    status: changed ? "changed" : "unchanged",
    beforeSizeBytes,
    afterSizeBytes,
    savedBytes,
    savedPercentage,
    changes: changed ? step.getChanges?.(beforeSvg, afterSvg) ?? [] : [],
  };
}

export function applySafeFixesWithReport(content: string): AppliedSafeFixReport {
  const svg = parseSvgMarkup(content.trim());
  const startedAt = new Date().toISOString();
  const steps: OptimizationStep[] = [];
  const initialMarkup = serializeSvg(svg);

  for (const fix of SAFE_FIX_SEQUENCE) {
    const beforeSvg = svg.cloneNode(true) as SVGSVGElement;
    const beforeMarkup = serializeSvg(svg);

    if (fix.getApplicability && !fix.getApplicability(beforeSvg)) {
      const beforeSizeBytes = getByteLength(beforeMarkup);
      steps.push({
        id: fix.id,
        label: fix.label,
        description: fix.description,
        status: "skipped",
        beforeSizeBytes,
        afterSizeBytes: beforeSizeBytes,
        savedBytes: 0,
        savedPercentage: 0,
      });
      continue;
    }

    fix.apply(svg);
    const afterMarkup = serializeSvg(svg);

    steps.push(
      buildStepResult({
        step: fix,
        beforeSvg,
        afterSvg: svg,
        beforeMarkup,
        afterMarkup,
      }),
    );
  }

  const optimizedContent = serializeSvg(svg);
  const originalSizeBytes = getByteLength(initialMarkup);
  const optimizedSizeBytes = getByteLength(optimizedContent);
  const savedBytes = originalSizeBytes - optimizedSizeBytes;
  const savedPercentage = originalSizeBytes > 0
    ? (savedBytes / originalSizeBytes) * 100
    : 0;
  const appliedLabels = steps
    .filter((step) => step.status === "changed")
    .map((step) => step.label);

  return {
    content: optimizedContent,
    report: {
      originalSizeBytes,
      optimizedSizeBytes,
      savedBytes,
      savedPercentage,
      startedAt,
      completedAt: new Date().toISOString(),
      steps,
      appliedCount: appliedLabels.length,
      appliedLabels,
      changedStepCount: steps.filter((step) => step.status === "changed").length,
      unchangedStepCount: steps.filter((step) => step.status === "unchanged").length,
      skippedStepCount: steps.filter((step) => step.status === "skipped").length,
      failedStepCount: steps.filter((step) => step.status === "failed").length,
    },
  };
}

export function applySafeFixForFinding(content: string, finding: Finding): string {
  const fix = SAFE_FIXES_BY_FINDING_ID[finding.id]?.apply;

  if (!fix) {
    throw new Error("This issue does not have an automatic fix.");
  }

  return withParsedSvg(content, fix);
}
