import type { AnalysisRule } from "@/analysis/models";
import { canConvertInlineStylesToAttributes } from "@/lib/svg/inline-styles";
import { createRuleFinding } from "../utils";

function hasInlineStyles(svg: SVGSVGElement): boolean {
  return Array.from(svg.querySelectorAll("[style]")).some((element) =>
    Boolean(element.getAttribute("style")?.trim()),
  );
}

export const maintainability001InlineStyles: AnalysisRule = {
  id: "MAINTAINABILITY_001",
  category: "maintainability",
  title: "Inline Styles",
  description: "The SVG uses inline style attributes.",
  severity: "warning",
  scoreImpact: 3,
  fixType: "manual",
  introducedIn: "0.2.0",
  status: "implemented",
  analyze(svg) {
    if (!hasInlineStyles(svg)) {
      return null;
    }

    const canConvertSafely = canConvertInlineStylesToAttributes(svg);

    return createRuleFinding(maintainability001InlineStyles, {
      fixType: canConvertSafely ? "auto" : "manual",
      recommendation: canConvertSafely
        ? "Convert simple presentation styles to SVG attributes."
        : "Review inline styles manually. At least one declaration is not safe to convert automatically.",
    });
  },
};
