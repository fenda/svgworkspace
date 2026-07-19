import type { AnalysisRule } from "@/analysis/models";
import { getSpriteScalabilitySummary, isSpriteContainerSvg } from "@/lib/svg";
import { analyzeScalability } from "@/lib/svg/viewbox";
import { createRuleFinding } from "../utils";

export const structure001MissingViewBox: AnalysisRule = {
  id: "STRUCTURE_001",
  category: "structure",
  title: "Missing viewBox",
  description: "The SVG does not contain a viewBox attribute.",
  severity: "warning",
  scoreImpact: 5,
  fixType: "manual",
  introducedIn: "0.2.0",
  status: "implemented",
  analyze(svg) {
    if (isSpriteContainerSvg(svg)) {
      const spriteScalability = getSpriteScalabilitySummary(svg);

      if (spriteScalability.symbolsMissingUsableViewBox === 0) {
        return null;
      }

      const affectedCount = spriteScalability.symbolsMissingUsableViewBox;

      return createRuleFinding(structure001MissingViewBox, {
        title: "Some symbols are missing a viewBox",
        description:
          affectedCount === 1
            ? "1 symbol cannot scale correctly because it does not define a valid viewBox."
            : `${affectedCount} symbols cannot scale correctly because they do not define a valid viewBox.`,
        recommendation: "Review affected symbols and add valid viewBox values.",
      });
    }

    const scalability = analyzeScalability(svg);

    if (scalability.state !== "not_scalable") {
      return null;
    }

    return createRuleFinding(structure001MissingViewBox, {
      fixType: scalability.canGenerateViewBox ? "choice" : "manual",
      recommendation: scalability.canGenerateViewBox
        ? "Generate a viewBox from the existing width and height attributes."
        : "Add a viewBox that matches the artwork dimensions.",
    });
  },
};
