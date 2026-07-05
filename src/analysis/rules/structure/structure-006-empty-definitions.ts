import type { AnalysisRule } from "@/analysis/models";
import { hasEmptyDefs } from "@/lib/svg/defs";

export const structure006EmptyDefinitions: AnalysisRule = {
  id: "STRUCTURE_006",
  category: "structure",
  analyze(svg) {
    if (!hasEmptyDefs(svg)) {
      return null;
    }

    return {
      id: "STRUCTURE_006",
      category: "structure",
      severity: "info",
      fixType: "auto",
      title: "Empty Definitions",
      description: "This SVG contains an empty <defs> element that can be removed.",
      recommendation: "Remove empty definition blocks that do not contain any definitions.",
      scoreImpact: 1,
    };
  },
};
