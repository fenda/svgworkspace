import type { AnalysisRule } from "@/analysis/models";
import { hasXlinkAttributes } from "./shared";

export const react004XlinkAttribute: AnalysisRule = {
  id: "REACT_004",
  category: "react-ready",
  title: "xlink Attribute",
  description:
    "xlink attributes often need special handling or replacement when used in React.",
  severity: "info",
  scoreImpact: 2,
  fixType: "manual",
  introducedIn: "0.3.0",
  status: "implemented",
  analyze(svg) {
    if (!hasXlinkAttributes(svg)) {
      return null;
    }

    return {
      id: react004XlinkAttribute.id,
      category: react004XlinkAttribute.category,
      severity: react004XlinkAttribute.severity ?? "info",
      title: react004XlinkAttribute.title ?? "xlink Attribute",
      description: react004XlinkAttribute.description ?? "",
      recommendation: "Review xlink attributes and replace them with React-friendly equivalents where appropriate.",
      scoreImpact: react004XlinkAttribute.scoreImpact ?? 0,
    };
  },
};
