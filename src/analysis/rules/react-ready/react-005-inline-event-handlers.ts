import type { AnalysisRule } from "@/analysis/models";
import { hasInlineEventAttributes } from "./shared";

export const react005InlineEventHandlers: AnalysisRule = {
  id: "REACT_005",
  category: "react-ready",
  title: "Inline Event Handlers",
  description:
    "Inline SVG event handler attributes should be reviewed before converting to React.",
  severity: "warning",
  scoreImpact: 4,
  fixType: "manual",
  introducedIn: "0.3.0",
  status: "implemented",
  analyze(svg) {
    if (!hasInlineEventAttributes(svg)) {
      return null;
    }

    return {
      id: react005InlineEventHandlers.id,
      category: react005InlineEventHandlers.category,
      severity: react005InlineEventHandlers.severity ?? "warning",
      title: react005InlineEventHandlers.title ?? "Inline Event Handlers",
      description: react005InlineEventHandlers.description ?? "",
      recommendation: "Move inline SVG event handler attributes into explicit React event props before conversion.",
      scoreImpact: react005InlineEventHandlers.scoreImpact ?? 0,
    };
  },
};
