import type { AnalysisRule } from "@/analysis/models";
import { hasElement, isDecorativeSvg } from "./shared";
import { createRuleFinding } from "../utils";

export const accessibility001MissingTitle: AnalysisRule = {
  id: "ACCESSIBILITY_001",
  category: "accessibility",
  title: "Missing Title",
  description:
    "This SVG has no accessible title. Screen readers may not provide useful context.",
  severity: "warning",
  scoreImpact: 4,
  fixType: "manual",
  introducedIn: "0.2.1",
  status: "implemented",
  analyze(svg) {
    if (isDecorativeSvg(svg) || hasElement(svg, "title")) {
      return null;
    }

    return createRuleFinding(accessibility001MissingTitle, {
      recommendation: "Add a meaningful <title> element for assistive technologies.",
    });
  },
};
