import type { AnalysisRule } from "@/analysis/models";
import { hasElement, isAccessibilityContextExempt } from "./shared";
import { createRuleFinding } from "../utils";

export const accessibility003MissingDesc: AnalysisRule = {
  id: "ACCESSIBILITY_003",
  category: "accessibility",
  title: "Missing Description",
  description: "This standalone SVG has no internal long description.",
  severity: "info",
  scoreImpact: 0,
  fixType: "manual",
  introducedIn: "0.2.1",
  status: "implemented",
  analyze(svg) {
    if (isAccessibilityContextExempt(svg) || hasElement(svg, "desc")) {
      return null;
    }

    return createRuleFinding(accessibility003MissingDesc, {
      recommendation:
        "Add a <desc> only when the SVG needs detail beyond its accessible name; surrounding HTML can also provide that context.",
    });
  },
};
