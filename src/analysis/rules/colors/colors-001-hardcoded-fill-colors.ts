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

function hasHardcodedFill(svg: SVGSVGElement): boolean {
  return Array.from(svg.querySelectorAll("*")).some((element) => {
    const fill =
      element.getAttribute("fill")?.trim() ??
      getStyleValue(element.getAttribute("style") ?? "", "fill");

    return Boolean(fill && !isIgnoredPaint(fill));
  });
}

export const colors001HardcodedFillColors: AnalysisRule = {
  id: "COLORS_001",
  category: "colors",
  title: "Hardcoded Fill Colors",
  description: "One or more elements use fixed fill colors.",
  severity: "warning",
  scoreImpact: 3,
  fixType: "choice",
  introducedIn: "0.2.0",
  status: "implemented",
  analyze(svg) {
    if (!hasHardcodedFill(svg)) {
      return null;
    }

    return createRuleFinding(colors001HardcodedFillColors, {
      recommendation: "Use currentColor or CSS variables when appropriate.",
    });
  },
};
