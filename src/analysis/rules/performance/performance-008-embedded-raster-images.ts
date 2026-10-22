import type { AnalysisRule } from "@/analysis/models";
import { createRuleFinding } from "../utils";

function getEmbeddedRasterImageCount(svg: SVGSVGElement): number {
  return Array.from(svg.querySelectorAll("image")).filter((image) => {
    const href = image.getAttribute("href") ?? image.getAttribute("xlink:href") ?? "";
    return /^data:image\/(png|jpe?g|gif|webp);/i.test(href.trim());
  }).length;
}

export const performance008EmbeddedRasterImages: AnalysisRule = {
  id: "PERFORMANCE_008",
  category: "performance",
  title: "Embedded Raster Images",
  description: "The SVG embeds raster image data that can substantially increase its payload.",
  severity: "info",
  scoreImpact: 1,
  fixType: "manual",
  introducedIn: "0.5.7",
  status: "implemented",
  analyze(svg) {
    const count = getEmbeddedRasterImageCount(svg);
    if (!count) return null;
    return createRuleFinding(performance008EmbeddedRasterImages, {
      recommendation: `Review ${count} embedded raster ${count === 1 ? "image" : "images"}. Keep it only when raster content is intentional; SVG Workspace does not rewrite image data automatically.`,
    });
  },
};
