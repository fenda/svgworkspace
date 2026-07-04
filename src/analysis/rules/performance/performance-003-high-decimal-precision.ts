import type { AnalysisRule } from "@/analysis/models";

const HIGH_PRECISION_NUMBER = /-?\d+\.(\d{5,})\b/;

function hasHighDecimalPrecision(svg: SVGSVGElement): boolean {
  return HIGH_PRECISION_NUMBER.test(svg.outerHTML);
}

export const performance003HighDecimalPrecision: AnalysisRule = {
  id: "PERFORMANCE_003",
  category: "performance",
  analyze(svg) {
    if (!hasHighDecimalPrecision(svg)) {
      return null;
    }

    return {
      id: "PERFORMANCE_003",
      category: "performance",
      severity: "info",
      title: "High Decimal Precision",
      description: "Coordinates contain excessive decimal places.",
      recommendation: "Round decimal values during optimization.",
      scoreImpact: 3,
    };
  },
};
