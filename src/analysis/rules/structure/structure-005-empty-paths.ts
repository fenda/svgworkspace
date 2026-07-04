import type { AnalysisRule } from "@/analysis/models";

function hasEmptyPaths(svg: SVGSVGElement): boolean {
  return Array.from(svg.querySelectorAll("path")).some((path) => {
    const d = path.getAttribute("d")?.trim();

    return !d;
  });
}

export const structure005EmptyPaths: AnalysisRule = {
  id: "STRUCTURE_005",
  category: "structure",
  analyze(svg) {
    if (!hasEmptyPaths(svg)) {
      return null;
    }

    return {
      id: "STRUCTURE_005",
      category: "structure",
      severity: "warning",
      title: "Empty Paths",
      description: "The SVG contains path elements without path data.",
      recommendation: "Remove empty paths or provide valid path data.",
      scoreImpact: 3,
    };
  },
};
