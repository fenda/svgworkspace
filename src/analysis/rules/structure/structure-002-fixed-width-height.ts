import type { AnalysisRule } from "@/analysis/models";
import { hasValidViewBox } from "@/lib/svg/viewbox";
import { createRuleFinding } from "../utils";

export const structure002FixedWidthHeight: AnalysisRule = {
  id: "STRUCTURE_002",
  category: "structure",
  title: "Fixed Width & Height",
  description: "The SVG defines explicit width and height attributes.",
  severity: "info",
  scoreImpact: 2,
  fixType: "manual",
  introducedIn: "0.2.0",
  status: "implemented",
  analyze(svg) {
    const width = svg.getAttribute("width")?.trim();
    const height = svg.getAttribute("height")?.trim();
    const canRemoveSafely = hasValidViewBox(svg);

    if (!width || !height) {
      return null;
    }

    return createRuleFinding(structure002FixedWidthHeight, {
      fixType: canRemoveSafely ? "auto" : "manual",
      recommendation: canRemoveSafely
        ? "Remove width and height to rely on the existing viewBox for correct scaling."
        : "Keep width and height until a valid viewBox exists. Removing them now would be unsafe.",
    });
  },
};
