import type { AnalysisRule } from "@/analysis/models";
import { hasEmptyElementText } from "./shared";
import { createRuleFinding } from "../utils";

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

    return createRuleFinding(accessibility004EmptyDesc, {
      recommendation: "Fill the <desc> element with useful supporting context.",
    });
  },
};
