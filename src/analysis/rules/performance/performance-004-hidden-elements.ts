import type { AnalysisRule } from "@/analysis/models";
import { createRuleFinding } from "../utils";

function getStyleValue(style: string, property: string): string | null {
  const pattern = new RegExp(`${property}\\s*:\\s*([^;]+)`, "i");
  const match = style.match(pattern);

  return match?.[1]?.trim() ?? null;
}

function isOpacityZero(value: string | null | undefined): boolean {
  if (!value) {
    return false;
  }

  return Number(value) === 0;
}

function hasHiddenElements(svg: SVGSVGElement): boolean {
  return Array.from(svg.querySelectorAll("*")).some((element) => {
    const style = element.getAttribute("style") ?? "";
    const display = element.getAttribute("display")?.trim();
    const visibility = element.getAttribute("visibility")?.trim();
    const opacity = element.getAttribute("opacity")?.trim();
    const styleDisplay = getStyleValue(style, "display");
    const styleVisibility = getStyleValue(style, "visibility");
    const styleOpacity = getStyleValue(style, "opacity");

    return (
      display === "none" ||
      visibility === "hidden" ||
      isOpacityZero(opacity) ||
      styleDisplay === "none" ||
      styleVisibility === "hidden" ||
      isOpacityZero(styleOpacity)
    );
  });
}

export const performance004HiddenElements: AnalysisRule = {
  id: "PERFORMANCE_004",
  category: "performance",
  title: "Hidden Elements",
  description: "The SVG contains elements that are hidden and do not affect rendering.",
  severity: "info",
  scoreImpact: 2,
  fixType: "auto",
  introducedIn: "0.2.0",
  status: "implemented",
  analyze(svg) {
    if (!hasHiddenElements(svg)) {
      return null;
    }

    return createRuleFinding(performance004HiddenElements, {
      recommendation: "Remove hidden elements that are not needed.",
    });
  },
};
