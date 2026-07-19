import type { AnalysisRule } from "@/analysis/models";
import { isSpriteContainerSvg } from "@/lib/svg";
import { analyzeScalability } from "@/lib/svg/viewbox";
import { createRuleFinding } from "../utils";

export const structure008InvalidViewBox: AnalysisRule = {
  id: "STRUCTURE_008",
  category: "structure",
  title: "Invalid viewBox",
  description: "The SVG contains a viewBox attribute that appears to be invalid.",
  severity: "warning",
  scoreImpact: 5,
  fixType: "manual",
  introducedIn: "0.4.6",
  status: "implemented",
  analyze(svg) {
    if (isSpriteContainerSvg(svg)) {
      return null;
    }

    const scalability = analyzeScalability(svg);

    if (scalability.state !== "invalid") {
      return null;
    }

    return createRuleFinding(structure008InvalidViewBox, {
      recommendation:
        "Fix the viewBox so it contains four valid numeric values with positive width and height.",
    });
  },
};
