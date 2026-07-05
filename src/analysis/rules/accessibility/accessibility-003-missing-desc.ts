import type { AnalysisRule } from "@/analysis/models";
import { hasElement, isDecorativeSvg } from "./shared";
import { createRuleFinding } from "../utils";

export const accessibility003MissingDesc: AnalysisRule = {
  id: "ACCESSIBILITY_003",
  category: "accessibility",
  title: "Missing Description",
  description:
    "Consider providing a description for complex or meaningful SVGs.",
  severity: "info",
  scoreImpact: 2,
  fixType: "manual",
  introducedIn: "0.2.1",
  status: "implemented",
  analyze(svg) {
    if (isDecorativeSvg(svg) || hasElement(svg, "desc")) {
      return null;
    }

    return createRuleFinding(accessibility003MissingDesc, {
      recommendation: "Add a <desc> element when the SVG benefits from extra context.",
    });
  },
};
