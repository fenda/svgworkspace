import type { AnalysisRule } from "@/analysis/models";
import {
  hasHardcodedPaint,
  hasTransformableCurrentColorAttribute,
} from "@/lib/svg/current-color";
import { createRuleFinding } from "../utils";

export const colors002HardcodedStrokeColors: AnalysisRule = {
  id: "COLORS_002",
  category: "colors",
  title: "Hardcoded Stroke Colors",
  description: "One or more elements use fixed stroke colors.",
  severity: "warning",
  scoreImpact: 3,
  fixType: "choice",
  introducedIn: "0.2.0",
  status: "implemented",
  analyze(svg) {
    if (!hasHardcodedPaint(svg, "stroke")) {
      return null;
    }

    const canTransform = hasTransformableCurrentColorAttribute(svg, "stroke");

    return createRuleFinding(colors002HardcodedStrokeColors, {
      fixType: canTransform ? "choice" : "manual",
      recommendation: canTransform
        ? "Convert eligible stroke attributes to currentColor when appropriate."
        : "Review fixed stroke colors manually. This SVG does not expose a safe direct stroke-attribute transform.",
    });
  },
};
