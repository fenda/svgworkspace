import type { Metadata } from "next";
import { ToolPlaceholder } from "@/components/layout/ToolPlaceholder";
import { createNoIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = createNoIndexMetadata(
  "Sprite",
  "Future standalone sprite tools for SVG Workspace.",
  "/sprite/",
);

export default function SpritePage() {
  return (
    <ToolPlaceholder
      title="Sprite"
      description="Build and manage SVG sprites without uploading files to a server."
    />
  );
}
