import type { AnalysisRule } from "@/analysis/models";

export const structure002FixedWidthHeight: AnalysisRule = {
  id: "STRUCTURE_002",
  category: "structure",
  analyze(svg) {
    const width = svg.getAttribute("width")?.trim();
    const height = svg.getAttribute("height")?.trim();

    if (!width || !height) {
      return null;
    }

    return {
      id: "STRUCTURE_002",
      category: "structure",
      severity: "info",
      title: "Fixed Width & Height",
      description: "The SVG defines explicit width and height attributes.",
      recommendation: "Remove width and height when appropriate.",
      scoreImpact: 2,
    };
  },
};
