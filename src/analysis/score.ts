import type { Finding, SvgHealthCategoryScore } from "@/analysis/models";
import { svgHealthCategories } from "@/analysis/models";
import { calculateScoreFromImpacts, clampHealthScore, getHealthGrade } from "./health-score";

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
      score: calculateScoreFromImpacts([deductedScore]),
    };
  });
}

export function calculateSvgHealth(
  findings: Finding[],
  checkCount: number,
) {
  // Rule metadata owns the deductions. The policy intentionally weights
  // objective structural failures above optional transforms and export noise.
  const appliedImpacts = findings
    .map(getScoreImpact)
    .filter((impact): impact is number => impact !== null);

  const deductedScore = appliedImpacts.reduce((sum, impact) => sum + impact, 0);
  const score = calculateScoreFromImpacts([deductedScore]);
  const recoverableScore = appliedImpacts.reduce((sum, impact) => sum + impact, 0);
  const potentialScore = clampHealthScore(score + recoverableScore);

  return {
    grade: getHealthGrade(score),
    score,
    potentialScore,
    findingCount: findings.length,
    checkCount,
    categoryScores: calculateCategoryScores(findings),
  };
}
