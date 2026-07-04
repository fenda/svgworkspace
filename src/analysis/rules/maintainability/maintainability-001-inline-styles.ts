import type { AnalysisRule } from "@/analysis/models";
import { canConvertInlineStylesToAttributes } from "@/lib/svg/inline-styles";

function hasInlineStyles(svg: SVGSVGElement): boolean {
  return Array.from(svg.querySelectorAll("[style]")).some((element) =>
    Boolean(element.getAttribute("style")?.trim()),
  );
}

export const maintainability001InlineStyles: AnalysisRule = {
  id: "MAINTAINABILITY_001",
  category: "maintainability",
  analyze(svg) {
    if (!hasInlineStyles(svg)) {
      return null;
    }

    const canConvertSafely = canConvertInlineStylesToAttributes(svg);

    return {
      id: "MAINTAINABILITY_001",
      category: "maintainability",
      severity: "warning",
      fixType: canConvertSafely ? "auto" : "manual",
      title: "Inline Styles",
      description: "The SVG uses inline style attributes.",
      recommendation: canConvertSafely
        ? "Convert simple presentation styles to SVG attributes."
        : "Review inline styles manually. At least one declaration is not safe to convert automatically.",
      scoreImpact: 3,
    };
  },
};
