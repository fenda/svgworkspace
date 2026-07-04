import type { AnalysisRule } from "@/analysis/models";

function hasInlineStyles(svg: SVGSVGElement): boolean {
  return Array.from(svg.querySelectorAll("[style]")).some((element) =>
    Boolean(element.getAttribute("style")?.trim()),
  );
}

export const maintainability001InlineStyles: AnalysisRule = {
  id: "MAINTAINABILITY_001",
  category: "maintainability",
  analyze(svg) {
    if (!hasInlineStyles(svg)) {
      return null;
    }

    return {
      id: "MAINTAINABILITY_001",
      category: "maintainability",
      severity: "warning",
      title: "Inline Styles",
      description: "The SVG uses inline style attributes.",
      recommendation: "Prefer presentation attributes or shared classes when appropriate.",
      scoreImpact: 3,
    };
  },
};
