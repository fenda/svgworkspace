import type { AnalysisRule } from "@/analysis/models";
import { createRuleFinding } from "../utils";

export const MAX_DECIMAL_PLACES = 4;
const HIGH_PRECISION_NUMBER = new RegExp(`-?\\d+\\.(\\d{${MAX_DECIMAL_PLACES + 1},})\\b`);

function hasHighDecimalPrecision(svg: SVGSVGElement): boolean {
  return HIGH_PRECISION_NUMBER.test(svg.outerHTML);
}

export const performance003HighDecimalPrecision: AnalysisRule = {
  id: "PERFORMANCE_003",
  category: "performance",
  title: "High Decimal Precision",
  description: "Coordinates contain excessive decimal places.",
  severity: "info",
  scoreImpact: 3,
  fixType: "auto",
  introducedIn: "0.2.0",
  status: "implemented",
  analyze(svg) {
    if (!hasHighDecimalPrecision(svg)) {
      return null;
    }

    return createRuleFinding(performance003HighDecimalPrecision, {
      recommendation: "Round decimal values during optimization.",
    });
  },
};
