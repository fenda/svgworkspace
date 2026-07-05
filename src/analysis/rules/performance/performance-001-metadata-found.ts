import type { AnalysisRule } from "@/analysis/models";
import { createRuleFinding } from "../utils";

export const performance001MetadataFound: AnalysisRule = {
  id: "PERFORMANCE_001",
  category: "performance",
  title: "Metadata Found",
  description: "Metadata elements were detected.",
  severity: "info",
  scoreImpact: 2,
  fixType: "auto",
  introducedIn: "0.2.0",
  status: "implemented",
  analyze(svg) {
    if (!svg.querySelector("metadata")) {
      return null;
    }

    return createRuleFinding(performance001MetadataFound, {
      recommendation: "Remove metadata during optimization.",
    });
  },
};
