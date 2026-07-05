import type { AnalysisRule } from "@/analysis/models";
import { createRuleFinding } from "../utils";

function hasEmptyGroups(svg: SVGSVGElement): boolean {
  return Array.from(svg.querySelectorAll("g")).some((group) => {
    const hasElementChildren = group.children.length > 0;
    const hasTextContent = Boolean(group.textContent?.trim());

    return !hasElementChildren && !hasTextContent;
  });
}

export const structure004EmptyGroups: AnalysisRule = {
  id: "STRUCTURE_004",
  category: "structure",
  title: "Empty Groups",
  description: "The SVG contains group elements with no meaningful children.",
  severity: "info",
  scoreImpact: 1,
  fixType: "auto",
  introducedIn: "0.2.0",
  status: "implemented",
  analyze(svg) {
    if (!hasEmptyGroups(svg)) {
      return null;
    }

    return createRuleFinding(structure004EmptyGroups, {
      recommendation: "Remove empty groups that do not affect rendering.",
    });
  },
};
