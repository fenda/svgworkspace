"use client";

import { useSvgWorkspaceStore } from "@/stores/svg-workspace-store";

export function useSvgWorkspace() {
  const document = useSvgWorkspaceStore((state) => state.document);
  const source = useSvgWorkspaceStore((state) => state.source);
  const error = useSvgWorkspaceStore((state) => state.error);
  const isProcessing = useSvgWorkspaceStore((state) => state.isProcessing);
  const loadFromContent = useSvgWorkspaceStore((state) => state.loadFromContent);
  const loadFromFile = useSvgWorkspaceStore((state) => state.loadFromFile);
  const applyCurrentSafeFixes = useSvgWorkspaceStore((state) => state.applyCurrentSafeFixes);
  const applySafeFixForFinding = useSvgWorkspaceStore((state) => state.applySafeFixForFinding);
  const loadExample = useSvgWorkspaceStore((state) => state.loadExample);
  const clear = useSvgWorkspaceStore((state) => state.clear);

  return {
    document,
    source,
    error,
    isProcessing,
    loadFromContent,
    loadFromFile,
    applyCurrentSafeFixes,
    applySafeFixForFinding,
    loadExample,
    clear,
  };
}
