import type { AnalysisRule } from "@/analysis/models";
import { hasEmptyElementText } from "./shared";
import { createRuleFinding } from "../utils";

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

    return createRuleFinding(accessibility002EmptyTitle, {
      recommendation: "Fill the <title> element with a short, meaningful label.",
    });
  },
};
