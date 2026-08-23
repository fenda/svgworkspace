export function clampHealthScore(score: number): number {
  return Math.min(100, Math.max(0, score));
}

export function calculateScoreFromImpacts(impacts: number[]): number {
  return clampHealthScore(100 - impacts.reduce((sum, impact) => sum + impact, 0));
}

export function getHealthGrade(score: number): string {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "Needs work";
}
