import type { AnalysisRule } from "@/analysis/models";
import { getUnusedDefinitionIds } from "@/lib/svg/defs";
import { createRuleFinding } from "../utils";

export const performance005UnusedDefinitions: AnalysisRule = {
  id: "PERFORMANCE_005",
  category: "performance",
  title: "Unused Definitions",
  description: "Definitions inside <defs> are present but never referenced.",
  severity: "info",
  scoreImpact: 2,
  fixType: "auto",
  introducedIn: "0.4.0-preview",
  status: "implemented",
  analyze(svg) {
    const unusedDefinitions = getUnusedDefinitionIds(svg);

    if (unusedDefinitions.length === 0) {
      return null;
    }

    return createRuleFinding(performance005UnusedDefinitions, {
      recommendation: "Remove unused definitions during optimization.",
    });
  },
};
