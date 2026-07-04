import type { Finding } from "@/analysis/models";
import type { SvgHealth } from "@/analysis/models/svg-health";

function clampScore(score: number): number {
  return Math.min(100, Math.max(0, score));
}

function getScoreImpact(finding: Finding): number | null {
  return Number.isFinite(finding.scoreImpact) ? finding.scoreImpact : null;
}

function getGrade(score: number): string {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "Needs work";
}

export function calculateSvgHealth(
  findings: Finding[],
  checkCount: number,
): SvgHealth {
  // Provisional MVP model: recalibrate these deductions and grade bands after
  // more analysis rules are added and we have a broader fixture baseline.
  const appliedImpacts = findings
    .map(getScoreImpact)
    .filter((impact): impact is number => impact !== null);

  const deductedScore = appliedImpacts.reduce((sum, impact) => sum + impact, 0);
  const score = clampScore(100 - deductedScore);
  const recoverableScore = appliedImpacts.reduce((sum, impact) => sum + impact, 0);
  const potentialScore = clampScore(score + recoverableScore);

  return {
    grade: getGrade(score),
    score,
    potentialScore,
    findingCount: findings.length,
    checkCount,
  };
}
