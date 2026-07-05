"use client";

import dynamic from "next/dynamic";
import { useSvgWorkspace } from "@/hooks/use-svg-workspace";

const Workspace = dynamic(
  () => import("@/components/workspace/Workspace").then((mod) => mod.Workspace),
  {
    ssr: false,
    loading: () => null,
  },
);

export function WorkspaceSection() {
  const { document } = useSvgWorkspace();

  if (!document) {
    return null;
  }

  return <Workspace />;
}
