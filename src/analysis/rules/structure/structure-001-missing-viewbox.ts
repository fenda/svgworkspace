import type { AnalysisRule } from "@/analysis/models";
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
    const viewBox = svg.getAttribute("viewBox")?.trim();

    if (viewBox) {
      return null;
    }

    return createRuleFinding(structure001MissingViewBox, {
      recommendation: "Add a viewBox that matches the artwork dimensions.",
    });
  },
};
