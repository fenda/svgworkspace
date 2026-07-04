import type { AnalysisRule } from "@/analysis/models";

function hasComments(svg: SVGSVGElement): boolean {
  const document = svg.ownerDocument;
  const walker = document.createTreeWalker(document, NodeFilter.SHOW_COMMENT);

  return walker.nextNode() !== null;
}

export const performance002CommentsFound: AnalysisRule = {
  id: "PERFORMANCE_002",
  category: "performance",
  analyze(svg) {
    if (!hasComments(svg)) {
      return null;
    }

    return {
      id: "PERFORMANCE_002",
      category: "performance",
      severity: "info",
      title: "Comments Found",
      description: "The SVG contains XML comments.",
      recommendation: "Remove comments.",
      scoreImpact: 1,
    };
  },
};
