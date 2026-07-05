import type { AnalysisRule } from "@/analysis/models";
import {
  hasHardcodedPaint,
  hasTransformableCurrentColorAttribute,
} from "@/lib/svg/current-color";
import { createRuleFinding } from "../utils";

export const colors001HardcodedFillColors: AnalysisRule = {
  id: "COLORS_001",
  category: "colors",
  title: "Hardcoded Fill Colors",
  description: "One or more elements use fixed fill colors.",
  severity: "warning",
  scoreImpact: 3,
  fixType: "choice",
  introducedIn: "0.2.0",
  status: "implemented",
  analyze(svg) {
    if (!hasHardcodedPaint(svg, "fill")) {
      return null;
    }

    const canTransform = hasTransformableCurrentColorAttribute(svg, "fill");

    return createRuleFinding(colors001HardcodedFillColors, {
      fixType: canTransform ? "choice" : "manual",
      recommendation: canTransform
        ? "Convert eligible fill attributes to currentColor when appropriate."
        : "Review fixed fill colors manually. This SVG does not expose a safe direct fill-attribute transform.",
    });
  },
};
