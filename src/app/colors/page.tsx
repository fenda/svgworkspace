import type { Metadata } from "next";
import { ToolPlaceholder } from "@/components/layout/ToolPlaceholder";
import { createNoIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = createNoIndexMetadata(
  "Colors",
  "Future SVG color tools for SVG Workspace.",
  "/colors/",
);

export default function ColorsPage() {
  return (
    <ToolPlaceholder
      title="Colors"
      description="Replace hardcoded fills and manage SVG color tokens in the browser."
    />
  );
}
