import type { AnalysisRule } from "@/analysis/models";
import { createRuleFinding } from "../utils";

function getXlinkAttributeCount(svg: SVGSVGElement): number {
  return Array.from(svg.querySelectorAll("*")).filter((element) =>
    element.hasAttribute("xlink:href"),
  ).length;
}

export const maintainability003LegacyXlink: AnalysisRule = {
  id: "MAINTAINABILITY_003",
  category: "maintainability",
  title: "Legacy xlink Attributes",
  description: "The SVG uses legacy xlink:href attributes instead of native SVG href attributes.",
  severity: "info",
  scoreImpact: 1,
  fixType: "choice",
  introducedIn: "0.5.7",
  status: "implemented",
  analyze(svg) {
    const count = getXlinkAttributeCount(svg);
    if (!count) return null;
    return createRuleFinding(maintainability003LegacyXlink, {
      recommendation: `Migrate ${count} legacy xlink ${count === 1 ? "reference" : "references"} to native href attributes when your compatibility requirements allow it.`,
    });
  },
};
