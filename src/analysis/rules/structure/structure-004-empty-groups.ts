import type { AnalysisRule } from "@/analysis/models";

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
  analyze(svg) {
    if (!hasEmptyGroups(svg)) {
      return null;
    }

    return {
      id: "STRUCTURE_004",
      category: "structure",
      severity: "info",
      title: "Empty Groups",
      description: "The SVG contains group elements with no meaningful children.",
      recommendation: "Remove empty groups that do not affect rendering.",
      scoreImpact: 1,
    };
  },
};
