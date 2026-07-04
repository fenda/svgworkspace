import type { AnalysisResult } from "@/analysis/models";
import { analysisRules } from "@/analysis/rules";

export function runAnalysis(svg: SVGSVGElement): AnalysisResult {
  const findings = analysisRules
    .map((rule) => rule.analyze(svg))
    .filter((finding) => finding !== null);

  return { findings };
}
