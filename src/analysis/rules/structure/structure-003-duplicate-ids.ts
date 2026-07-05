import type { AnalysisRule } from "@/analysis/models";
import { createRuleFinding } from "../utils";

function hasDuplicateIds(svg: SVGSVGElement): boolean {
  const seenIds = new Set<string>();

  return Array.from(svg.querySelectorAll("[id]")).some((element) => {
    const id = element.getAttribute("id")?.trim();

    if (!id) {
      return false;
    }

    if (seenIds.has(id)) {
      return true;
    }

    seenIds.add(id);
    return false;
  });
}

export const structure003DuplicateIds: AnalysisRule = {
  id: "STRUCTURE_003",
  category: "structure",
  title: "Duplicate IDs",
  description: "The SVG contains duplicate id attributes.",
  severity: "warning",
  scoreImpact: 4,
  fixType: "manual",
  introducedIn: "0.2.0",
  status: "implemented",
  analyze(svg) {
    if (!hasDuplicateIds(svg)) {
      return null;
    }

    return createRuleFinding(structure003DuplicateIds, {
      recommendation: "Ensure each id is unique within the SVG.",
    });
  },
};
