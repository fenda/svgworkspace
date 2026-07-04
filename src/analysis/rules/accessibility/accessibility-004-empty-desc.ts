import type { AnalysisRule } from "@/analysis/models";
import { hasEmptyElementText } from "./shared";

export const accessibility004EmptyDesc: AnalysisRule = {
  id: "ACCESSIBILITY_004",
  category: "accessibility",
  title: "Empty Description",
  description: "The SVG contains an empty description element.",
  severity: "info",
  scoreImpact: 2,
  fixType: "manual",
  introducedIn: "0.2.1",
  status: "implemented",
  analyze(svg) {
    if (!hasEmptyElementText(svg, "desc")) {
      return null;
    }

    return {
      id: accessibility004EmptyDesc.id,
      category: accessibility004EmptyDesc.category,
      severity: accessibility004EmptyDesc.severity ?? "info",
      title: accessibility004EmptyDesc.title ?? "Empty Description",
      description: accessibility004EmptyDesc.description ?? "",
      recommendation: "Fill the <desc> element with useful supporting context.",
      scoreImpact: accessibility004EmptyDesc.scoreImpact ?? 0,
    };
  },
};
