import type { Metadata } from "next";
import { ToolPlaceholder } from "@/components/layout/ToolPlaceholder";
import { createNoIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = createNoIndexMetadata(
  "Optimize",
  "Future standalone optimization tools for SVG Workspace.",
  "/optimize/",
);

export default function OptimizePage() {
  return (
    <ToolPlaceholder
      title="Optimize"
      description="SVG optimization tools will run entirely in your browser."
    />
  );
}
