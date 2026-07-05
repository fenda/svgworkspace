import type { AnalysisRule } from "@/analysis/models";
import { createRuleFinding } from "../utils";

function hasEmptyPaths(svg: SVGSVGElement): boolean {
  return Array.from(svg.querySelectorAll("path")).some((path) => {
    const d = path.getAttribute("d")?.trim();

    return !d;
  });
}

export const structure005EmptyPaths: AnalysisRule = {
  id: "STRUCTURE_005",
  category: "structure",
  title: "Empty Paths",
  description: "The SVG contains path elements without path data.",
  severity: "warning",
  scoreImpact: 3,
  fixType: "auto",
  introducedIn: "0.2.0",
  status: "implemented",
  analyze(svg) {
    if (!hasEmptyPaths(svg)) {
      return null;
    }

    return createRuleFinding(structure005EmptyPaths, {
      recommendation: "Remove empty paths or provide valid path data.",
    });
  },
};
