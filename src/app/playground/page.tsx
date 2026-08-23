import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createNoIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = createNoIndexMetadata(
  "Playground",
  "Legacy SVG Workspace route.",
  "/playground/",
);

export default function PlaygroundPage() {
  redirect("/");
}
