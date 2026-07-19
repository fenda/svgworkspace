"use client";

import { getInsights } from "@/insights";
import { useSvgWorkspaceStore } from "@/stores/svg-workspace-store";

export function useSvgWorkspace() {
  const document = useSvgWorkspaceStore((state) => state.document);
  const source = useSvgWorkspaceStore((state) => state.source);
  const error = useSvgWorkspaceStore((state) => state.error);
  const uploadValidation = useSvgWorkspaceStore((state) => state.uploadValidation);
  const optimizationValidation = useSvgWorkspaceStore((state) => state.optimizationValidation);
  const optimizationReport = useSvgWorkspaceStore((state) => state.optimizationReport);
  const svgType = useSvgWorkspaceStore((state) => state.svgType);
  const selectedSymbolKey = useSvgWorkspaceStore((state) => state.selectedSymbolKey);
  const spriteSearchQuery = useSvgWorkspaceStore((state) => state.spriteSearchQuery);
  const spriteSortMode = useSvgWorkspaceStore((state) => state.spriteSortMode);
  const recentlySelectedSymbolKeys = useSvgWorkspaceStore((state) => state.recentlySelectedSymbolKeys);
  const previewBackground = useSvgWorkspaceStore((state) => state.previewBackground);
  const previewSizeMode = useSvgWorkspaceStore((state) => state.previewSizeMode);
  const previewSizeValue = useSvgWorkspaceStore((state) => state.previewSizeValue);
  const history = useSvgWorkspaceStore((state) => state.history);
  const historyIndex = useSvgWorkspaceStore((state) => state.historyIndex);
  const isProcessing = useSvgWorkspaceStore((state) => state.isProcessing);
  const loadFromContent = useSvgWorkspaceStore((state) => state.loadFromContent);
  const loadFromFile = useSvgWorkspaceStore((state) => state.loadFromFile);
  const applyCurrentSafeFixes = useSvgWorkspaceStore((state) => state.applyCurrentSafeFixes);
  const applySafeFixForFinding = useSvgWorkspaceStore((state) => state.applySafeFixForFinding);
  const applyTransformForFinding = useSvgWorkspaceStore((state) => state.applyTransformForFinding);
  const applyIconWorkspaceTransformation = useSvgWorkspaceStore((state) => state.applyIconWorkspaceTransformation);
  const undo = useSvgWorkspaceStore((state) => state.undo);
  const redo = useSvgWorkspaceStore((state) => state.redo);
  const resetToOriginal = useSvgWorkspaceStore((state) => state.resetToOriginal);
  const setSvgType = useSvgWorkspaceStore((state) => state.setSvgType);
  const setSelectedSymbolKey = useSvgWorkspaceStore((state) => state.setSelectedSymbolKey);
  const setSpriteSearchQuery = useSvgWorkspaceStore((state) => state.setSpriteSearchQuery);
  const setSpriteSortMode = useSvgWorkspaceStore((state) => state.setSpriteSortMode);
  const setPreviewBackground = useSvgWorkspaceStore((state) => state.setPreviewBackground);
  const setPreviewSize = useSvgWorkspaceStore((state) => state.setPreviewSize);
  const setPreviewSizeCustom = useSvgWorkspaceStore((state) => state.setPreviewSizeCustom);
  const loadExample = useSvgWorkspaceStore((state) => state.loadExample);
  const dismissUploadValidation = useSvgWorkspaceStore((state) => state.dismissUploadValidation);
  const dismissOptimizationValidation = useSvgWorkspaceStore((state) => state.dismissOptimizationValidation);
  const clear = useSvgWorkspaceStore((state) => state.clear);
  const insights =
    document
      ? getInsights({
          analysis: document.analysis,
          metadata: document.metadata,
          svgType,
        })
      : [];

  return {
    document,
    source,
    error,
    uploadValidation,
    optimizationValidation,
    optimizationReport,
    svgType,
    selectedSymbolKey,
    spriteSearchQuery,
    spriteSortMode,
    recentlySelectedSymbolKeys,
    previewBackground,
    previewSizeMode,
    previewSizeValue,
    history,
    historyIndex,
    insights,
    isProcessing,
    loadFromContent,
    loadFromFile,
    applyCurrentSafeFixes,
    applySafeFixForFinding,
    applyTransformForFinding,
    applyIconWorkspaceTransformation,
    undo,
    redo,
    resetToOriginal,
    setSvgType,
    setSelectedSymbolKey,
    setSpriteSearchQuery,
    setSpriteSortMode,
    setPreviewBackground,
    setPreviewSize,
    setPreviewSizeCustom,
    loadExample,
    dismissUploadValidation,
    dismissOptimizationValidation,
    clear,
  };
}
