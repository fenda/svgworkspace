import type { Finding } from "@/analysis";

export type FixType = "auto" | "manual" | "choice";

const AUTOMATIC_FIX_IDS = new Set([
  "PERFORMANCE_001",
  "PERFORMANCE_002",
  "PERFORMANCE_003",
  "PERFORMANCE_004",
  "PERFORMANCE_005",
  "STRUCTURE_004",
  "STRUCTURE_005",
]);

const CHOICE_FIX_IDS = new Set([
  "COLORS_001",
  "COLORS_002",
  "MAINTAINABILITY_001",
]);

export function getFixType(finding: Finding): FixType {
  if (finding.fixType) {
    return finding.fixType;
  }

  if (AUTOMATIC_FIX_IDS.has(finding.id)) {
    return "auto";
  }

  if (CHOICE_FIX_IDS.has(finding.id)) {
    return "choice";
  }

  return "manual";
}

export function isAutomaticFixFinding(finding: Finding): boolean {
  return getFixType(finding) === "auto";
}
