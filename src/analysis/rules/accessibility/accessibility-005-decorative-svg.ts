import type { AnalysisRule } from "@/analysis/models";
import { isDecorativeSvg } from "./shared";

export const accessibility005DecorativeSvg: AnalysisRule = {
  id: "ACCESSIBILITY_005",
  category: "accessibility",
  title: "Decorative SVG",
  description:
    "This SVG appears to be marked as decorative, so it may not need a title or description.",
  severity: "info",
  scoreImpact: 0,
  fixType: "manual",
  introducedIn: "0.2.2",
  status: "implemented",
  analyze(svg) {
    if (!isDecorativeSvg(svg)) {
      return null;
    }

    return {
      id: accessibility005DecorativeSvg.id,
      category: accessibility005DecorativeSvg.category,
      severity: accessibility005DecorativeSvg.severity ?? "info",
      title: accessibility005DecorativeSvg.title ?? "Decorative SVG",
      description: accessibility005DecorativeSvg.description ?? "",
      recommendation:
        "Confirm that this SVG is intentionally decorative and can remain hidden from assistive technologies.",
      scoreImpact: accessibility005DecorativeSvg.scoreImpact ?? 0,
    };
  },
};
