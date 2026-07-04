import { calculateSvgHealth } from "@/analysis/score";
import type { AnalysisResult } from "@/analysis/models";
import { reactReadyRules, svgHealthRules } from "@/analysis/rules";

export function runAnalysis(svg: SVGSVGElement): AnalysisResult {
  const findings = svgHealthRules
    .map((rule) => rule.analyze(svg))
    .filter((finding) => finding !== null);
  const reactReadyFindings = reactReadyRules
    .map((rule) => rule.analyze(svg))
    .filter((finding) => finding !== null);

  return {
    findings,
    reactReadyFindings,
    health: calculateSvgHealth(findings, svgHealthRules.length),
  };
}
