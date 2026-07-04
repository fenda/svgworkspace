import type { AnalysisRule } from "@/analysis/models";
import { hasEmptyElementText } from "./shared";

export const accessibility002EmptyTitle: AnalysisRule = {
  id: "ACCESSIBILITY_002",
  category: "accessibility",
  title: "Empty Title",
  description: "The SVG contains an empty title element.",
  severity: "warning",
  scoreImpact: 4,
  fixType: "manual",
  introducedIn: "0.2.1",
  status: "implemented",
  analyze(svg) {
    if (!hasEmptyElementText(svg, "title")) {
      return null;
    }

    return {
      id: accessibility002EmptyTitle.id,
      category: accessibility002EmptyTitle.category,
      severity: accessibility002EmptyTitle.severity ?? "warning",
      title: accessibility002EmptyTitle.title ?? "Empty Title",
      description: accessibility002EmptyTitle.description ?? "",
      recommendation: "Fill the <title> element with a short, meaningful label.",
      scoreImpact: accessibility002EmptyTitle.scoreImpact ?? 0,
    };
  },
};
