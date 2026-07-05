import type { AnalysisRule } from "@/analysis/models";
import { hasEmptySymbols } from "@/lib/svg/defs";
import { createRuleFinding } from "../utils";

export const structure007EmptySymbols: AnalysisRule = {
  id: "STRUCTURE_007",
  category: "structure",
  title: "Empty Symbols",
  description: "This SVG contains empty symbol elements that can be removed.",
  severity: "info",
  scoreImpact: 1,
  fixType: "auto",
  introducedIn: "0.4.1",
  status: "implemented",
  analyze(svg) {
    if (!hasEmptySymbols(svg)) {
      return null;
    }

    return createRuleFinding(structure007EmptySymbols, {
      recommendation: "Remove symbol elements that do not contain meaningful drawable or definition content.",
    });
  },
};
