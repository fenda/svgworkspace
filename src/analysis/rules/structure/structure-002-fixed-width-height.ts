import type { AnalysisRule } from "@/analysis/models";
import { hasValidViewBox } from "@/lib/svg/viewbox";

export const structure002FixedWidthHeight: AnalysisRule = {
  id: "STRUCTURE_002",
  category: "structure",
  analyze(svg) {
    const width = svg.getAttribute("width")?.trim();
    const height = svg.getAttribute("height")?.trim();
    const canRemoveSafely = hasValidViewBox(svg);

    if (!width || !height) {
      return null;
    }

    return {
      id: "STRUCTURE_002",
      category: "structure",
      severity: "info",
      fixType: canRemoveSafely ? "auto" : "manual",
      title: "Fixed Width & Height",
      description: "The SVG defines explicit width and height attributes.",
      recommendation: canRemoveSafely
        ? "Remove width and height to rely on the existing viewBox for responsiveness."
        : "Keep width and height until a valid viewBox exists. Removing them now would be unsafe.",
      scoreImpact: 2,
    };
  },
};
