import type { Finding } from "@/analysis";

export type FixType = Finding["fixType"];

export function getFixType(finding: Finding): FixType {
  return finding.fixType;
}

export function isAutomaticFixFinding(finding: Finding): boolean {
  return getFixType(finding) === "auto";
}
