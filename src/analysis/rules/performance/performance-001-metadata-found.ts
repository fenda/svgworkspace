import type { AnalysisRule } from "@/analysis/models";

export const performance001MetadataFound: AnalysisRule = {
  id: "PERFORMANCE_001",
  category: "performance",
  analyze(svg) {
    if (!svg.querySelector("metadata")) {
      return null;
    }

    return {
      id: "PERFORMANCE_001",
      category: "performance",
      severity: "info",
      title: "Metadata Found",
      description: "Metadata elements were detected.",
      recommendation: "Remove metadata during optimization.",
      scoreImpact: 2,
    };
  },
};
