import type { AnalysisRule } from "@/analysis/models";
import { getUnusedNamespacePrefixes } from "@/lib/svg/namespaces";

export const performance006UnusedNamespaces: AnalysisRule = {
  id: "PERFORMANCE_006",
  category: "performance",
  analyze(svg) {
    const unusedPrefixes = getUnusedNamespacePrefixes(svg);

    if (unusedPrefixes.length === 0) {
      return null;
    }

    return {
      id: "PERFORMANCE_006",
      category: "performance",
      severity: "info",
      fixType: "auto",
      title: "Unused Namespaces",
      description: "This SVG declares namespaces that are not used in the document.",
      recommendation: "Remove namespace declarations that are not referenced by any element or attribute.",
      scoreImpact: 1,
    };
  },
};
