import type { AnalysisRule } from "@/analysis/models";
import { hasClassAttribute } from "./shared";

export const react001ClassAttribute: AnalysisRule = {
  id: "REACT_001",
  category: "react-ready",
  title: "class Attribute",
  description: "React uses className instead of class in JSX.",
  severity: "warning",
  scoreImpact: 3,
  fixType: "manual",
  introducedIn: "0.3.0",
  status: "implemented",
  analyze(svg) {
    if (!hasClassAttribute(svg)) {
      return null;
    }

    return {
      id: react001ClassAttribute.id,
      category: react001ClassAttribute.category,
      severity: react001ClassAttribute.severity ?? "warning",
      title: react001ClassAttribute.title ?? "class Attribute",
      description: react001ClassAttribute.description ?? "",
      recommendation: "Rename class attributes to className before using this SVG in JSX.",
      scoreImpact: react001ClassAttribute.scoreImpact ?? 0,
    };
  },
};
