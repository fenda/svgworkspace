import type { AnalysisRule } from "@/analysis/models";
import { hasEmptyElementText, isAccessibilityContextExempt } from "./shared";
import { createRuleFinding } from "../utils";

export const accessibility004EmptyDesc: AnalysisRule = {
  id: "ACCESSIBILITY_004",
  category: "accessibility",
  title: "Empty Description",
  description: "This standalone SVG contains an empty internal <desc> element.",
  severity: "info",
  scoreImpact: 0,
  fixType: "manual",
  introducedIn: "0.2.1",
  status: "implemented",
  analyze(svg) {
    if (isAccessibilityContextExempt(svg) || !hasEmptyElementText(svg, "desc")) {
      return null;
    }

    return createRuleFinding(accessibility004EmptyDesc, {
      recommendation:
        "Fill the <desc> only when the SVG needs supporting context beyond its accessible name.",
    });
  },
};
