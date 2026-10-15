import type { AnalysisRule } from "@/analysis/models";
import { getRemovableWhitespaceNodeCount } from "@/lib/svg/whitespace";
import { createRuleFinding } from "../utils";

export const performance007ExcessWhitespace: AnalysisRule = {
  id: "PERFORMANCE_007",
  category: "performance",
  title: "Excess Whitespace",
  description: "The SVG contains structural whitespace that can be removed from the exported markup.",
  severity: "info",
  scoreImpact: 0,
  fixType: "auto",
  introducedIn: "0.5.6",
  status: "implemented",
  analyze(svg) {
    const count = getRemovableWhitespaceNodeCount(svg);

    if (count === 0) {
      return null;
    }

    return createRuleFinding(performance007ExcessWhitespace, {
      recommendation: `Normalize ${count} structural whitespace ${count === 1 ? "node" : "nodes"} during optimization.`,
    });
  },
};
