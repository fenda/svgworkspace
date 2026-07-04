import type { AnalysisRule } from "@/analysis/models";

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
  analyze(svg) {
    if (!hasDuplicateIds(svg)) {
      return null;
    }

    return {
      id: "STRUCTURE_003",
      category: "structure",
      severity: "warning",
      title: "Duplicate IDs",
      description: "The SVG contains duplicate id attributes.",
      recommendation: "Ensure each id is unique within the SVG.",
      scoreImpact: 4,
    };
  },
};
