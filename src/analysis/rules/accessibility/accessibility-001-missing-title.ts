import type { AnalysisRule } from "@/analysis/models";
import { hasAccessibleName, isAccessibilityContextExempt } from "./shared";
import { createRuleFinding } from "../utils";

export const accessibility001MissingTitle: AnalysisRule = {
  id: "ACCESSIBILITY_001",
  category: "accessibility",
  title: "Missing Title",
  description:
    "This standalone SVG has no internal accessible name.",
  severity: "info",
  scoreImpact: 0,
  fixType: "manual",
  introducedIn: "0.2.1",
  status: "implemented",
  analyze(svg) {
    if (isAccessibilityContextExempt(svg) || hasAccessibleName(svg)) {
      return null;
    }

    return createRuleFinding(accessibility001MissingTitle, {
      recommendation:
        "If this SVG is meaningful and is not named by surrounding HTML, add a short <title> or an accessible name.",
    });
  },
};
