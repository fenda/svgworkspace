import type { Metadata } from "next";
import { ToolPlaceholder } from "@/components/layout/ToolPlaceholder";
import { createNoIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = createNoIndexMetadata(
  "Inspect",
  "Future SVG inspection tools for SVG Workspace.",
  "/inspect/",
);

export default function InspectPage() {
  return (
    <ToolPlaceholder
      title="Inspect"
      description="Inspect SVG structure, metadata, and accessibility details locally."
    />
  );
}
