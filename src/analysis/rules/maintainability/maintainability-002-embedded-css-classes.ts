import type { AnalysisRule } from "@/analysis/models";
import {
  canInlineCssClasses,
  hasEmbeddedCssClasses,
} from "@/lib/svg/css-classes";

export const maintainability002EmbeddedCssClasses: AnalysisRule = {
  id: "MAINTAINABILITY_002",
  category: "maintainability",
  analyze(svg) {
    if (!hasEmbeddedCssClasses(svg)) {
      return null;
    }

    const canInlineSafely = canInlineCssClasses(svg);

    return {
      id: "MAINTAINABILITY_002",
      category: "maintainability",
      severity: "warning",
      fixType: canInlineSafely ? "auto" : "manual",
      title: "Embedded CSS Classes",
      description:
        "The SVG uses internal CSS classes that can sometimes be converted into SVG presentation attributes.",
      recommendation: canInlineSafely
        ? "Inline simple class-based presentation styles as SVG attributes."
        : "Review embedded CSS manually. Complex selectors or unsupported declarations are not safe to inline automatically.",
      scoreImpact: 3,
    };
  },
};
