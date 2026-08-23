import type { AnalysisRule } from "@/analysis/models";
import { hasAccessibleName, hasEmptyElementText, isAccessibilityContextExempt } from "./shared";
import { createRuleFinding } from "../utils";

export const accessibility002EmptyTitle: AnalysisRule = {
  id: "ACCESSIBILITY_002",
  category: "accessibility",
  title: "Empty Title",
  description: "This standalone SVG contains an empty internal <title> element.",
  severity: "info",
  scoreImpact: 0,
  fixType: "manual",
  introducedIn: "0.2.1",
  status: "implemented",
  analyze(svg) {
    if (
      isAccessibilityContextExempt(svg) ||
      hasAccessibleName(svg) ||
      !hasEmptyElementText(svg, "title")
    ) {
      return null;
    }

    return createRuleFinding(accessibility002EmptyTitle, {
      recommendation:
        "If this SVG relies on its internal title for an accessible name, fill it with a short, meaningful label.",
    });
  },
};
