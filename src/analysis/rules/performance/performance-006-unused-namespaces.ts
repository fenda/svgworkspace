import type { AnalysisRule } from "@/analysis/models";
import { getUnusedNamespacePrefixes } from "@/lib/svg/namespaces";
import { createRuleFinding } from "../utils";

export const performance006UnusedNamespaces: AnalysisRule = {
  id: "PERFORMANCE_006",
  category: "performance",
  title: "Unused Namespaces",
  description: "This SVG declares namespaces that are not used in the document.",
  severity: "info",
  scoreImpact: 1,
  fixType: "auto",
  introducedIn: "0.4.1",
  status: "implemented",
  analyze(svg) {
    const unusedPrefixes = getUnusedNamespacePrefixes(svg);

    if (unusedPrefixes.length === 0) {
      return null;
    }

    return createRuleFinding(performance006UnusedNamespaces, {
      recommendation: "Remove namespace declarations that are not referenced by any element or attribute.",
    });
  },
};
