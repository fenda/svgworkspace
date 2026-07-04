"use client";

import { useEffect } from "react";
import { useSvgWorkspaceStore } from "@/stores/svg-workspace-store";

export function SvgWorkspaceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const document = useSvgWorkspaceStore((state) => state.document);
  const loadExample = useSvgWorkspaceStore((state) => state.loadExample);

  useEffect(() => {
    if (!document) {
      loadExample();
    }
  }, [document, loadExample]);

  return children;
}
