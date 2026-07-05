"use client";

import { useSvgWorkspaceStore } from "@/stores/svg-workspace-store";

export function useSvgWorkspace() {
  const document = useSvgWorkspaceStore((state) => state.document);
  const source = useSvgWorkspaceStore((state) => state.source);
  const error = useSvgWorkspaceStore((state) => state.error);
  const uploadValidation = useSvgWorkspaceStore((state) => state.uploadValidation);
  const optimizationValidation = useSvgWorkspaceStore((state) => state.optimizationValidation);
  const optimizationReport = useSvgWorkspaceStore((state) => state.optimizationReport);
  const isProcessing = useSvgWorkspaceStore((state) => state.isProcessing);
  const loadFromContent = useSvgWorkspaceStore((state) => state.loadFromContent);
  const loadFromFile = useSvgWorkspaceStore((state) => state.loadFromFile);
  const applyCurrentSafeFixes = useSvgWorkspaceStore((state) => state.applyCurrentSafeFixes);
  const applySafeFixForFinding = useSvgWorkspaceStore((state) => state.applySafeFixForFinding);
  const applyTransformForFinding = useSvgWorkspaceStore((state) => state.applyTransformForFinding);
  const resetToOriginal = useSvgWorkspaceStore((state) => state.resetToOriginal);
  const loadExample = useSvgWorkspaceStore((state) => state.loadExample);
  const dismissUploadValidation = useSvgWorkspaceStore((state) => state.dismissUploadValidation);
  const dismissOptimizationValidation = useSvgWorkspaceStore((state) => state.dismissOptimizationValidation);
  const clear = useSvgWorkspaceStore((state) => state.clear);

  return {
    document,
    source,
    error,
    uploadValidation,
    optimizationValidation,
    optimizationReport,
    isProcessing,
    loadFromContent,
    loadFromFile,
    applyCurrentSafeFixes,
    applySafeFixForFinding,
    applyTransformForFinding,
    resetToOriginal,
    loadExample,
    dismissUploadValidation,
    dismissOptimizationValidation,
    clear,
  };
}
