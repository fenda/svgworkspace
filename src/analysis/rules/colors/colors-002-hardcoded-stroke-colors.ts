import type { AnalysisRule } from "@/analysis/models";
import { createRuleFinding } from "../utils";

function isIgnoredPaint(value: string): boolean {
  return (
    value === "none" ||
    value === "currentColor" ||
    value.startsWith("url(")
  );
}

function getStyleValue(style: string, property: string): string | null {
  const pattern = new RegExp(`${property}\\s*:\\s*([^;]+)`, "i");
  const match = style.match(pattern);

  return match?.[1]?.trim() ?? null;
}

function hasHardcodedStroke(svg: SVGSVGElement): boolean {
  return Array.from(svg.querySelectorAll("*")).some((element) => {
    const stroke =
      element.getAttribute("stroke")?.trim() ??
      getStyleValue(element.getAttribute("style") ?? "", "stroke");

    return Boolean(stroke && !isIgnoredPaint(stroke));
  });
}

export const colors002HardcodedStrokeColors: AnalysisRule = {
  id: "COLORS_002",
  category: "colors",
  title: "Hardcoded Stroke Colors",
  description: "One or more elements use fixed stroke colors.",
  severity: "warning",
  scoreImpact: 3,
  fixType: "choice",
  introducedIn: "0.2.0",
  status: "implemented",
  analyze(svg) {
    if (!hasHardcodedStroke(svg)) {
      return null;
    }

    return createRuleFinding(colors002HardcodedStrokeColors, {
      recommendation: "Use currentColor or CSS variables when appropriate.",
    });
  },
};
