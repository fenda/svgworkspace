import type { Metadata } from "next";
import { ToolPlaceholder } from "@/components/layout/ToolPlaceholder";
import { createNoIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = createNoIndexMetadata(
  "Convert",
  "Future SVG conversion tools for SVG Workspace.",
  "/convert/",
);

export default function ConvertPage() {
  return (
    <ToolPlaceholder
      title="Convert"
      description="Convert SVGs to React, Vue, HTML, and more — client-side only."
    />
  );
}
