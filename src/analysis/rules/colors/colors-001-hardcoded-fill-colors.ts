import type { AnalysisRule } from "@/analysis/models";

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
  analyze(svg) {
    if (!hasHardcodedFill(svg)) {
      return null;
    }

    return {
      id: "COLORS_001",
      category: "colors",
      severity: "warning",
      title: "Hardcoded Fill Colors",
      description: "One or more elements use fixed fill colors.",
      recommendation: "Use currentColor or CSS variables when appropriate.",
      scoreImpact: 3,
    };
  },
};
