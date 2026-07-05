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

const SAFE_FIXES_BY_FINDING_ID: Record<string, SafeFix> = {
  PERFORMANCE_001: removeMetadata,
  PERFORMANCE_002: removeComments,
  PERFORMANCE_003: roundDecimals,
  PERFORMANCE_004: removeHiddenElements,
  PERFORMANCE_005: removeUnusedDefs,
  PERFORMANCE_006: removeUnusedNamespaces,
  STRUCTURE_002: removeFixedDimensions,
  STRUCTURE_004: removeEmptyGroups,
  STRUCTURE_005: removeEmptyPaths,
  STRUCTURE_006: removeEmptyDefs,
  STRUCTURE_007: removeEmptySymbols,
  MAINTAINABILITY_001: convertInlineStyles,
  MAINTAINABILITY_002: inlineCssClasses,
};

function withParsedSvg(content: string, applyFix: (svg: SVGSVGElement) => void): string {
  const svg = parseSvgMarkup(content.trim());
  applyFix(svg);
  return serializeSvg(svg);
}

export function applySafeFixes(content: string): string {
  return withParsedSvg(content, (svg) => {
    removeMetadata(svg);
    removeComments(svg);
    removeHiddenElements(svg);
    removeUnusedDefs(svg);
    removeEmptySymbols(svg);
    removeEmptyDefs(svg);
    removeFixedDimensions(svg);
    inlineCssClasses(svg);
    convertInlineStyles(svg);
    removeEmptyPaths(svg);
    removeEmptyGroups(svg);
    removeUnusedNamespaces(svg);
    roundDecimals(svg);
  });
}

export function applySafeFixForFinding(content: string, finding: Finding): string {
  const fix = SAFE_FIXES_BY_FINDING_ID[finding.id];

  if (!fix) {
    throw new Error("This issue does not have an automatic fix.");
  }

  return withParsedSvg(content, fix);
}
