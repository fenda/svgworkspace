import type { Finding, SvgHealthCategoryScore } from "@/analysis/models";
import { svgHealthCategories } from "@/analysis/models";

function clampScore(score: number): number {
  return Math.min(100, Math.max(0, score));
}

function getScoreImpact(finding: Finding): number | null {
  return Number.isFinite(finding.scoreImpact) ? finding.scoreImpact : null;
}

function calculateCategoryScores(findings: Finding[]): SvgHealthCategoryScore[] {
  return svgHealthCategories.map((category) => {
    const deductedScore = findings
      .filter((finding) => finding.category === category)
      .map(getScoreImpact)
      .filter((impact): impact is number => impact !== null)
      .reduce((sum, impact) => sum + impact, 0);

    return {
      category,
      score: clampScore(100 - deductedScore),
    };
  });
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
) {
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
    categoryScores: calculateCategoryScores(findings),
  };
}
