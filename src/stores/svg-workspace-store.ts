"use client";

import { create } from "zustand";
import type { Finding } from "@/analysis";
import {
  executeIconWorkspaceTransformation,
  getIconWorkspaceTransformationLabel,
  type IconWorkspaceTransformationPayload,
} from "@/actions/icon-workspace";
import {
  applySafeFixesWithReport,
  applySafeFixForFinding,
} from "@/actions/safe-fixes/apply-safe-fixes";
import { applyCurrentColorTransform } from "@/actions/transforms/current-color";
import { applyGenerateViewBox } from "@/actions/transforms/generate-viewbox";
import { EXAMPLE_SVG } from "@/lib/mock-data";
import {
  trackAnalyticsEvent,
  trackAnalysisCompleted,
} from "@/lib/analytics";
import {
  createSvgDocument,
  getAutomaticPreviewBackground,
  getValidationState,
  hasDrawableContent,
  parseSvgMarkup,
  type OptimizationReport,
  type PreviewBackground,
  type SvgDocument,
  type SvgLoadSource,
  type SvgType,
  type SvgValidationState,
} from "@/lib/svg";
import { buildSvgHistoryState } from "@/stores/svg-history";
import { showSuccessToast, showWarningToast } from "@/stores/toast-store";

type SpriteSortMode = "original" | "alphabetical" | "recent";
type PreviewSizeMode = "fit" | "fixed" | "custom";

const PREVIEW_BACKGROUND_STORAGE_KEY = "svg-workspace.preview-background";
function isStoredPreviewBackground(value: string | null): value is PreviewBackground {
  return (
    value === "transparent" ||
    value === "checkerboard" ||
    value === "light" ||
    value === "dark"
  );
}

function getInitialPreviewBackgroundState(): {
  previewBackground: PreviewBackground;
  hasManualPreviewBackground: boolean;
} {
  if (typeof window === "undefined") {
    return {
      previewBackground: "dark",
      hasManualPreviewBackground: false,
    };
  }

  const storedBackground = window.localStorage.getItem(PREVIEW_BACKGROUND_STORAGE_KEY);

  if (!isStoredPreviewBackground(storedBackground)) {
    return {
      previewBackground: "dark",
      hasManualPreviewBackground: false,
    };
  }

  return {
    previewBackground: storedBackground,
    hasManualPreviewBackground: true,
  };
}

function persistPreviewBackground(background: PreviewBackground): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PREVIEW_BACKGROUND_STORAGE_KEY, background);
}

function getLoadedPreviewBackground(
  content: string,
  previewBackground: PreviewBackground,
  hasManualPreviewBackground: boolean,
): PreviewBackground {
  if (hasManualPreviewBackground) {
    return previewBackground;
  }

  return getAutomaticPreviewBackground(content);
}

function getAvailableSymbolKeys(document: SvgDocument | null): Set<string> {
  return new Set(document?.symbols.map((symbol) => symbol.key) ?? []);
}

function filterRecentSelectionKeys(
  recentKeys: string[],
  availableKeys: Set<string>,
): string[] {
  return recentKeys.filter((key, index) => {
    return availableKeys.has(key) && recentKeys.indexOf(key) === index;
  });
}

function getPersistedSelectedSymbolKey(
  currentKey: string | null,
  availableKeys: Set<string>,
): string | null {
  if (!currentKey || !availableKeys.has(currentKey)) {
    return null;
  }

  return currentKey;
}

function updateRecentSelectionKeys(
  recentKeys: string[],
  key: string,
): string[] {
  return [key, ...recentKeys.filter((entry) => entry !== key)];
}

type SvgWorkspaceStore = {
  document: SvgDocument | null;
  source: SvgLoadSource | null;
  error: string | null;
  uploadValidation: SvgValidationState | null;
  optimizationValidation: SvgValidationState | null;
  optimizationReport: OptimizationReport | null;
  svgType: SvgType | null;
  selectedSymbolKey: string | null;
  spriteSearchQuery: string;
  spriteSortMode: SpriteSortMode;
  recentlySelectedSymbolKeys: string[];
  previewBackground: PreviewBackground;
  previewSizeMode: PreviewSizeMode;
  previewSizeValue: number | null;
  hasManualPreviewBackground: boolean;
  history: string[];
  historyIndex: number;
  isProcessing: boolean;
  loadFromContent: (
    content: string,
    filename: string,
    source: SvgLoadSource,
  ) => void;
  loadFromFile: (file: File) => Promise<void>;
  applyCurrentSafeFixes: () => void;
  applySafeFixForFinding: (finding: Finding) => void;
  applyTransformForFinding: (finding: Finding) => void;
  applyIconWorkspaceTransformation: (
    transformationId: string,
    payload?: IconWorkspaceTransformationPayload,
  ) => void;
  undo: () => void;
  redo: () => void;
  resetToOriginal: () => void;
  setSvgType: (svgType: SvgType | null) => void;
  setSelectedSymbolKey: (key: string | null) => void;
  setSpriteSearchQuery: (query: string) => void;
  setSpriteSortMode: (mode: SpriteSortMode) => void;
  setPreviewBackground: (background: PreviewBackground) => void;
  setPreviewSize: (size: number | null) => void;
  setPreviewSizeCustom: (size: number) => void;
  loadExample: () => void;
  dismissUploadValidation: () => void;
  dismissOptimizationValidation: () => void;
  clear: () => void;
};

const initialPreviewBackgroundState = getInitialPreviewBackgroundState();

export const useSvgWorkspaceStore = create<SvgWorkspaceStore>((set, get) => {
  function loadDocument(
    content: string,
    filename: string,
    source: SvgLoadSource,
  ): void {
    const state = get();

    try {
      const document = createSvgDocument(filename, content);
      set({
        document,
        source,
        error: null,
        uploadValidation: null,
        optimizationValidation: null,
        optimizationReport: null,
        svgType: null,
        selectedSymbolKey: null,
        spriteSearchQuery: "",
        spriteSortMode: "original",
        recentlySelectedSymbolKeys: [],
        previewBackground: getLoadedPreviewBackground(
          document.originalContent,
          state.previewBackground,
          state.hasManualPreviewBackground,
        ),
        previewSizeMode: "fit",
        previewSizeValue: null,
        history: [],
        historyIndex: -1,
        isProcessing: false,
      });
      trackAnalysisCompleted(document.analysis);
    } catch (error) {
      set({
        uploadValidation: getValidationState(error, source),
        isProcessing: false,
      });
    }
  }

  function commitDocumentChange(
    nextContent: string,
    options: {
      optimizationReport?: OptimizationReport | null;
      successToast?: string;
      trackTransformId?: string;
      pushHistory?: boolean;
      preserveHistoryState?: { history: string[]; historyIndex: number };
    } = {},
  ): boolean {
    const state = get();
    const document = state.document;

    if (!document) {
      return false;
    }

    const trimmedContent = nextContent.trim();

    if (trimmedContent === document.content.trim()) {
      set({
        error: null,
        optimizationValidation: null,
        isProcessing: false,
      });
      return false;
    }

    const nextSvg = parseSvgMarkup(trimmedContent);

    if (!hasDrawableContent(nextSvg)) {
      set({
        optimizationValidation: null,
        isProcessing: false,
      });
      showWarningToast(
        "Optimization cancelled",
        "Optimizing this SVG would remove all drawable elements, so no changes were applied.",
      );
      return false;
    }

    const nextDocument = createSvgDocument(
      document.filename,
      trimmedContent,
      document.originalContent,
    );
    const availableKeys = getAvailableSymbolKeys(nextDocument);
    const historyState = options.preserveHistoryState
      ? options.preserveHistoryState
      : options.pushHistory === false
        ? {
            history: state.history,
            historyIndex: state.historyIndex,
          }
        : buildSvgHistoryState(
            state.history,
            state.historyIndex,
            document.content,
            trimmedContent,
          );

    set({
      document: nextDocument,
      error: null,
      optimizationValidation: null,
      optimizationReport: options.optimizationReport ?? null,
      selectedSymbolKey: getPersistedSelectedSymbolKey(
        state.selectedSymbolKey,
        availableKeys,
      ),
      recentlySelectedSymbolKeys: filterRecentSelectionKeys(
        state.recentlySelectedSymbolKeys,
        availableKeys,
      ),
      history: historyState.history,
      historyIndex: historyState.historyIndex,
      isProcessing: false,
    });

    if (options.successToast) {
      showSuccessToast(options.successToast);
    }

    if (options.trackTransformId) {
      trackAnalyticsEvent("transform_applied", {
        transform_id: options.trackTransformId,
      });
    }

    trackAnalysisCompleted(nextDocument.analysis);
    return true;
  }

  return {
    document: null,
    source: null,
    error: null,
    uploadValidation: null,
    optimizationValidation: null,
    optimizationReport: null,
    svgType: null,
    selectedSymbolKey: null,
    spriteSearchQuery: "",
    spriteSortMode: "original",
    recentlySelectedSymbolKeys: [],
    previewBackground: initialPreviewBackgroundState.previewBackground,
    previewSizeMode: "fit",
    previewSizeValue: null,
    hasManualPreviewBackground:
      initialPreviewBackgroundState.hasManualPreviewBackground,
    history: [],
    historyIndex: -1,
    isProcessing: false,

    loadFromContent: (content, filename, source) => {
      loadDocument(content, filename, source);
    },

    loadFromFile: async (file) => {
      set({
        isProcessing: true,
        error: null,
        uploadValidation: null,
        optimizationValidation: null,
      });

      try {
        const { readSvgFile } = await import("@/lib/svg/load");
        const { filename, content } = await readSvgFile(file);
        loadDocument(content, filename, "upload");
        trackAnalyticsEvent("svg_uploaded");
      } catch (error) {
        set({
          uploadValidation: getValidationState(error, "upload"),
          isProcessing: false,
        });
      }
    },

    loadExample: () => {
      loadDocument(EXAMPLE_SVG, "logo-example.svg", "example");
    },

    applyCurrentSafeFixes: () => {
      const document = get().document;

      if (!document) {
        return;
      }

      trackAnalyticsEvent("optimize_clicked");
      set({ isProcessing: true, error: null, optimizationValidation: null });

      try {
        const { content: nextContent, report } = applySafeFixesWithReport(
          document.content,
        );

        commitDocumentChange(nextContent, {
          optimizationReport: report,
          successToast: "Optimized",
        });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Unable to apply safe fixes.",
          isProcessing: false,
        });
      }
    },

    applySafeFixForFinding: (finding) => {
      const document = get().document;

      if (!document) {
        return;
      }

      set({ isProcessing: true, error: null, optimizationValidation: null });

      try {
        const nextContent = applySafeFixForFinding(document.content, finding);

        commitDocumentChange(nextContent);
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Unable to apply this fix.",
          isProcessing: false,
        });
      }
    },

    applyTransformForFinding: (finding) => {
      const document = get().document;

      if (!document) {
        return;
      }

      const transformConfig =
        finding.id === "STRUCTURE_001"
          ? {
              apply: applyGenerateViewBox,
              toast: "Generated viewBox",
              analyticsId: "generate_viewbox",
            }
          : finding.id === "COLORS_001"
            ? {
                apply: (content: string) =>
                  applyCurrentColorTransform(content, "fill"),
                toast: "Converted to currentColor",
                analyticsId: "use_currentcolor",
              }
            : finding.id === "COLORS_002"
              ? {
                  apply: (content: string) =>
                    applyCurrentColorTransform(content, "stroke"),
                  toast: "Converted to currentColor",
                  analyticsId: "use_currentcolor",
                }
              : null;

      if (!transformConfig) {
        set({
          error: "This issue does not have a transform action yet.",
          isProcessing: false,
        });
        return;
      }

      set({ isProcessing: true, error: null, optimizationValidation: null });

      try {
        const nextContent = transformConfig.apply(document.content);

        commitDocumentChange(nextContent, {
          successToast: transformConfig.toast,
          trackTransformId: transformConfig.analyticsId,
        });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Unable to apply this transform.",
          isProcessing: false,
        });
      }
    },

    applyIconWorkspaceTransformation: (transformationId, payload) => {
      const document = get().document;

      if (!document) {
        return;
      }

      set({ isProcessing: true, error: null, optimizationValidation: null });

      try {
        const result = executeIconWorkspaceTransformation(
          document.content,
          document.originalContent,
          transformationId,
          payload,
        );
        const label = getIconWorkspaceTransformationLabel(transformationId);

        commitDocumentChange(result.svgMarkup, {
          successToast: result.summary ?? label,
          trackTransformId: transformationId,
        });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Unable to apply this icon transformation.",
          isProcessing: false,
        });
      }
    },

    undo: () => {
      const state = get();
      const document = state.document;

      if (!document || state.historyIndex <= 0) {
        return;
      }

      const nextIndex = state.historyIndex - 1;
      const nextContent = state.history[nextIndex];

      if (!nextContent) {
        return;
      }

      set({ isProcessing: true, error: null, optimizationValidation: null });
      commitDocumentChange(nextContent, {
        pushHistory: false,
        preserveHistoryState: {
          history: state.history,
          historyIndex: nextIndex,
        },
        successToast: "Undo",
      });
    },

    redo: () => {
      const state = get();
      const document = state.document;

      if (!document || state.historyIndex < 0 || state.historyIndex >= state.history.length - 1) {
        return;
      }

      const nextIndex = state.historyIndex + 1;
      const nextContent = state.history[nextIndex];

      if (!nextContent) {
        return;
      }

      set({ isProcessing: true, error: null, optimizationValidation: null });
      commitDocumentChange(nextContent, {
        pushHistory: false,
        preserveHistoryState: {
          history: state.history,
          historyIndex: nextIndex,
        },
        successToast: "Redo",
      });
    },

    resetToOriginal: () => {
      const document = get().document;

      if (!document || document.content === document.originalContent) {
        return;
      }

      set({ isProcessing: true, error: null, optimizationValidation: null });

      try {
        const nextDocument = createSvgDocument(
          document.filename,
          document.originalContent,
          document.originalContent,
        );
        const state = get();
        const availableKeys = getAvailableSymbolKeys(nextDocument);

        set({
          document: nextDocument,
          error: null,
          optimizationValidation: null,
          optimizationReport: null,
          selectedSymbolKey: getPersistedSelectedSymbolKey(
            state.selectedSymbolKey,
            availableKeys,
          ),
          recentlySelectedSymbolKeys: filterRecentSelectionKeys(
            state.recentlySelectedSymbolKeys,
            availableKeys,
          ),
          history: [],
          historyIndex: -1,
          isProcessing: false,
        });
        showSuccessToast("Reset to original");
        trackAnalyticsEvent("reset_to_original");
        trackAnalysisCompleted(nextDocument.analysis);
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Unable to reset to the original SVG.",
          isProcessing: false,
        });
      }
    },

    setSvgType: (svgType) => {
      set({ svgType });
    },

    setSelectedSymbolKey: (key) => {
      set((state) => {
        const availableKeys = getAvailableSymbolKeys(state.document);

        if (!key || !availableKeys.has(key)) {
          return { selectedSymbolKey: null };
        }

        return {
          selectedSymbolKey: key,
          recentlySelectedSymbolKeys: updateRecentSelectionKeys(
            state.recentlySelectedSymbolKeys,
            key,
          ),
        };
      });
    },

    setSpriteSearchQuery: (spriteSearchQuery) => {
      set({ spriteSearchQuery });
    },

    setSpriteSortMode: (spriteSortMode) => {
      set({ spriteSortMode });
    },

    setPreviewBackground: (previewBackground) => {
      persistPreviewBackground(previewBackground);
      set({
        previewBackground,
        hasManualPreviewBackground: true,
      });
    },

    setPreviewSize: (size) => {
      set({
        previewSizeMode: size === null ? "fit" : "fixed",
        previewSizeValue: size,
      });
    },

    setPreviewSizeCustom: (size) => {
      set({
        previewSizeMode: "custom",
        previewSizeValue: size,
      });
    },

    dismissUploadValidation: () => {
      set({ uploadValidation: null });
    },

    dismissOptimizationValidation: () => {
      set({ optimizationValidation: null });
    },

    clear: () => {
      set({
        document: null,
        source: null,
        error: null,
        uploadValidation: null,
        optimizationValidation: null,
        optimizationReport: null,
        svgType: null,
        selectedSymbolKey: null,
        spriteSearchQuery: "",
        spriteSortMode: "original",
        recentlySelectedSymbolKeys: [],
        previewSizeMode: "fit",
        previewSizeValue: null,
        history: [],
        historyIndex: -1,
        isProcessing: false,
      });
    },
  };
});
