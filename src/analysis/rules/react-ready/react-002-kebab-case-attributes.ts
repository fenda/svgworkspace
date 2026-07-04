import type { AnalysisRule } from "@/analysis/models";
import { hasReactKebabCaseAttributes } from "./shared";

export const react002KebabCaseAttributes: AnalysisRule = {
  id: "REACT_002",
  category: "react-ready",
  title: "Kebab-case Attributes",
  description: "Some SVG attributes need camelCase names when used in JSX.",
  severity: "warning",
  scoreImpact: 4,
  fixType: "manual",
  introducedIn: "0.3.0",
  status: "implemented",
  analyze(svg) {
    if (!hasReactKebabCaseAttributes(svg)) {
      return null;
    }

    return {
      id: react002KebabCaseAttributes.id,
      category: react002KebabCaseAttributes.category,
      severity: react002KebabCaseAttributes.severity ?? "warning",
      title: react002KebabCaseAttributes.title ?? "Kebab-case Attributes",
      description: react002KebabCaseAttributes.description ?? "",
      recommendation: "Convert JSX-sensitive SVG attributes to camelCase before using this SVG in React.",
      scoreImpact: react002KebabCaseAttributes.scoreImpact ?? 0,
    };
  },
};
