import { parseSvgMarkup, serializeSvg } from "@/lib/svg/parse";
import type { Finding } from "@/analysis";
import { convertInlineStyles } from "./fixes/convert-inline-styles-to-attributes";
import { inlineCssClasses } from "./fixes/inline-css-classes";
import { removeComments } from "./fixes/remove-comments";
import { removeEmptyDefs } from "./fixes/remove-empty-defs";
import { removeFixedDimensions } from "./fixes/remove-fixed-dimensions";
import { removeEmptySymbols } from "./fixes/remove-empty-symbols";
import { roundDecimals } from "./fixes/round-decimals";
import { removeEmptyGroups } from "./fixes/remove-empty-groups";
import { removeEmptyPaths } from "./fixes/remove-empty-paths";
import { removeHiddenElements } from "./fixes/remove-hidden-elements";
import { removeMetadata } from "./fixes/remove-metadata";
import { removeUnusedDefs } from "./fixes/remove-unused-defs";
import { removeUnusedNamespaces } from "./fixes/remove-unused-namespaces";

type SafeFix = (svg: SVGSVGElement) => void;
type SafeFixDefinition = {
  label: string;
  apply: SafeFix;
};

const SAFE_FIXES_BY_FINDING_ID: Record<string, SafeFixDefinition> = {
  PERFORMANCE_001: { label: "Remove metadata", apply: removeMetadata },
  PERFORMANCE_002: { label: "Remove comments", apply: removeComments },
  PERFORMANCE_003: { label: "Round decimal precision", apply: roundDecimals },
  PERFORMANCE_004: { label: "Remove hidden elements", apply: removeHiddenElements },
  PERFORMANCE_005: { label: "Remove unused definitions", apply: removeUnusedDefs },
  PERFORMANCE_006: { label: "Remove unused namespaces", apply: removeUnusedNamespaces },
  STRUCTURE_002: { label: "Remove fixed dimensions", apply: removeFixedDimensions },
  STRUCTURE_004: { label: "Remove empty groups", apply: removeEmptyGroups },
  STRUCTURE_005: { label: "Remove empty paths", apply: removeEmptyPaths },
  STRUCTURE_006: { label: "Remove empty definitions", apply: removeEmptyDefs },
  STRUCTURE_007: { label: "Remove empty symbols", apply: removeEmptySymbols },
  MAINTAINABILITY_001: { label: "Convert inline styles", apply: convertInlineStyles },
  MAINTAINABILITY_002: { label: "Inline CSS classes", apply: inlineCssClasses },
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
  appliedLabels: string[];
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

export function applySafeFixesWithReport(content: string): AppliedSafeFixReport {
  const svg = parseSvgMarkup(content.trim());
  const appliedLabels: string[] = [];

  for (const fix of SAFE_FIX_SEQUENCE) {
    const before = serializeSvg(svg);
    fix.apply(svg);
    const after = serializeSvg(svg);

    if (before !== after) {
      appliedLabels.push(fix.label);
    }
  }

  return {
    content: serializeSvg(svg),
    appliedLabels,
  };
}

export function applySafeFixForFinding(content: string, finding: Finding): string {
  const fix = SAFE_FIXES_BY_FINDING_ID[finding.id]?.apply;

  if (!fix) {
    throw new Error("This issue does not have an automatic fix.");
  }

  return withParsedSvg(content, fix);
}
