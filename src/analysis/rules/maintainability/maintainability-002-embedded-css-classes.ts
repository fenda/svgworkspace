import type { AnalysisRule } from "@/analysis/models";
import {
  canInlineCssClasses,
  hasEmbeddedCssClasses,
} from "@/lib/svg/css-classes";
import { createRuleFinding } from "../utils";

export const maintainability002EmbeddedCssClasses: AnalysisRule = {
  id: "MAINTAINABILITY_002",
  category: "maintainability",
  title: "Embedded CSS Classes",
  description:
    "The SVG uses internal CSS classes that can sometimes be converted into SVG presentation attributes.",
  severity: "warning",
  scoreImpact: 3,
  fixType: "manual",
  introducedIn: "0.4.1",
  status: "implemented",
  analyze(svg) {
    if (!hasEmbeddedCssClasses(svg)) {
      return null;
    }

    const canInlineSafely = canInlineCssClasses(svg);

    return createRuleFinding(maintainability002EmbeddedCssClasses, {
      fixType: canInlineSafely ? "auto" : "manual",
      recommendation: canInlineSafely
        ? "Inline safe simple class-based presentation styles as SVG attributes while preserving unsupported CSS."
        : "Review embedded CSS manually. Complex selectors or unsupported declarations are not safe to inline automatically.",
    });
  },
};
