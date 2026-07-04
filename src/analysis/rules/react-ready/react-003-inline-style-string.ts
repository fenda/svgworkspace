import type { AnalysisRule } from "@/analysis/models";
import { hasInlineStyleString } from "./shared";

export const react003InlineStyleString: AnalysisRule = {
  id: "REACT_003",
  category: "react-ready",
  title: "Inline Style String",
  description: "JSX expects style values as objects, not CSS strings.",
  severity: "warning",
  scoreImpact: 4,
  fixType: "manual",
  introducedIn: "0.3.0",
  status: "implemented",
  analyze(svg) {
    if (!hasInlineStyleString(svg)) {
      return null;
    }

    return {
      id: react003InlineStyleString.id,
      category: react003InlineStyleString.category,
      severity: react003InlineStyleString.severity ?? "warning",
      title: react003InlineStyleString.title ?? "Inline Style String",
      description: react003InlineStyleString.description ?? "",
      recommendation: "Convert inline style strings to JSX style objects before using this SVG in React.",
      scoreImpact: react003InlineStyleString.scoreImpact ?? 0,
    };
  },
};
