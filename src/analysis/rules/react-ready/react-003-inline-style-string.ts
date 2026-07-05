import type { AnalysisRule } from "@/analysis/models";
import { hasInlineStyleString } from "./shared";
import { createRuleFinding } from "../utils";

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

    return createRuleFinding(react003InlineStyleString, {
      recommendation: "Convert inline style strings to JSX style objects before using this SVG in React.",
    });
  },
};
