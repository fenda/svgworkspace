import type { AnalysisRule } from "@/analysis/models";
import { hasEmptySymbols } from "@/lib/svg/defs";

export const structure007EmptySymbols: AnalysisRule = {
  id: "STRUCTURE_007",
  category: "structure",
  analyze(svg) {
    if (!hasEmptySymbols(svg)) {
      return null;
    }

    return {
      id: "STRUCTURE_007",
      category: "structure",
      severity: "info",
      fixType: "auto",
      title: "Empty Symbols",
      description: "This SVG contains empty symbol elements that can be removed.",
      recommendation: "Remove symbol elements that do not contain meaningful drawable or definition content.",
      scoreImpact: 1,
    };
  },
};
