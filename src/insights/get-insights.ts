import type { Insight, InsightContext } from "./types";

function hasFinding(context: InsightContext, findingId: string): boolean {
  return context.analysis.findings.some((finding) => finding.id === findingId);
}

function getTypeInsight(context: InsightContext): Insight {
  switch (context.svgType) {
    case "icon":
      return hasFinding(context, "COLORS_001") || hasFinding(context, "COLORS_002")
        ? {
            id: "icon-currentcolor",
            title: "Consider currentColor",
            explanation:
              "This SVG is marked as an icon. Converting hardcoded colors to currentColor can make theming easier.",
            suggestedAction: "Convert to currentColor",
          }
        : {
            id: "icon-generic",
            title: "Good icon candidate",
            explanation:
              "This SVG is marked as an icon. Keep geometry simple and color behavior reusable if it will live in a UI system.",
          };
    case "logo":
      return hasFinding(context, "COLORS_001") || hasFinding(context, "COLORS_002")
        ? {
            id: "logo-colors",
            title: "Brand colors may be intentional",
            explanation:
              "This SVG is marked as a logo. Avoid converting to currentColor unless the mark is meant to inherit interface text color.",
            suggestedAction: "Review color transforms carefully",
          }
        : {
            id: "logo-generic",
            title: "Preserve brand intent",
            explanation:
              "This SVG is marked as a logo. Structural cleanup is often helpful, but style transforms should respect brand usage.",
          };
    case "sprite_sheet":
      return {
        id: "sprite-sheet-generic",
        title: "Symbol collection detected",
        explanation:
          "This SVG is marked as a sprite sheet. Future versions will support symbol-level inspection and optimization.",
      };
    case null:
      return {
        id: "generic-context",
        title: "Add context when it helps",
        explanation:
          "SVG Workspace can tailor insights when you specify whether this asset is an icon, logo, or sprite sheet.",
        suggestedAction: "Set type",
      };
  }
}

function getScalabilityInsight(context: InsightContext): Insight | null {
  if (hasFinding(context, "STRUCTURE_001")) {
    return {
      id: "scalability-viewbox",
      title: "Scalability needs review",
      explanation:
        "This SVG is missing a valid viewBox. Its scaling behavior may be limited until that is addressed.",
      suggestedAction: "Review Generate ViewBox",
    };
  }

  return null;
}

export function getInsights(context: InsightContext): Insight[] {
  const insights = [getTypeInsight(context)];
  const scalabilityInsight = getScalabilityInsight(context);

  if (scalabilityInsight) {
    insights.push(scalabilityInsight);
  }

  return insights;
}
