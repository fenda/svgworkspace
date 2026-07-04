import type { AnalysisRule } from "@/analysis/models";

export const structure001MissingViewBox: AnalysisRule = {
  id: "STRUCTURE_001",
  category: "structure",
  analyze(svg) {
    const viewBox = svg.getAttribute("viewBox")?.trim();

    if (viewBox) {
      return null;
    }

    return {
      id: "STRUCTURE_001",
      category: "structure",
      severity: "warning",
      title: "Missing viewBox",
      description: "The SVG does not contain a viewBox attribute.",
      recommendation: "Add a viewBox that matches the artwork dimensions.",
      scoreImpact: 5,
    };
  },
};
