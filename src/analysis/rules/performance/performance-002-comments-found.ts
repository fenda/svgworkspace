import type { AnalysisRule } from "@/analysis/models";
import { createRuleFinding } from "../utils";

function hasComments(svg: SVGSVGElement): boolean {
  const walker = svg.ownerDocument.createTreeWalker(svg, NodeFilter.SHOW_COMMENT);

  return walker.nextNode() !== null;
}

export const performance002CommentsFound: AnalysisRule = {
  id: "PERFORMANCE_002",
  category: "performance",
  title: "Comments Found",
  description: "The SVG contains XML comments.",
  severity: "info",
  scoreImpact: 1,
  fixType: "auto",
  introducedIn: "0.2.0",
  status: "implemented",
  analyze(svg) {
    if (!hasComments(svg)) {
      return null;
    }

    return createRuleFinding(performance002CommentsFound, {
      recommendation: "Remove comments.",
    });
  },
};
