import type { AnalysisRule } from "@/analysis/models";
import { getUnusedDefinitionIds } from "@/lib/svg/defs";

export const performance005UnusedDefinitions: AnalysisRule = {
  id: "PERFORMANCE_005",
  category: "performance",
  analyze(svg) {
    const unusedDefinitions = getUnusedDefinitionIds(svg);

    if (unusedDefinitions.length === 0) {
      return null;
    }

    return {
      id: "PERFORMANCE_005",
      category: "performance",
      severity: "info",
      title: "Unused Definitions",
      description: "Definitions inside <defs> are present but never referenced.",
      recommendation: "Remove unused definitions during optimization.",
      scoreImpact: 2,
    };
  },
};
