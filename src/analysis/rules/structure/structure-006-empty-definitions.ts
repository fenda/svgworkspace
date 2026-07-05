import type { AnalysisRule } from "@/analysis/models";
import { hasEmptyDefs } from "@/lib/svg/defs";
import { createRuleFinding } from "../utils";

export const structure006EmptyDefinitions: AnalysisRule = {
  id: "STRUCTURE_006",
  category: "structure",
  title: "Empty Definitions",
  description: "This SVG contains an empty <defs> element that can be removed.",
  severity: "info",
  scoreImpact: 1,
  fixType: "auto",
  introducedIn: "0.4.1",
  status: "implemented",
  analyze(svg) {
    if (!hasEmptyDefs(svg)) {
      return null;
    }

    return createRuleFinding(structure006EmptyDefinitions, {
      recommendation: "Remove empty definition blocks that do not contain any definitions.",
    });
  },
};
