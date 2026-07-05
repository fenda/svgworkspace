import type { AnalysisRule } from "@/analysis/models";
import { hasClassAttribute } from "./shared";
import { createRuleFinding } from "../utils";

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

    return createRuleFinding(react001ClassAttribute, {
      recommendation: "Rename class attributes to className before using this SVG in JSX.",
    });
  },
};
