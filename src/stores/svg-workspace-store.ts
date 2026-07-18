"use client";

import { create } from "zustand";
import type { Finding } from "@/analysis";
import {
  applySafeFixesWithReport,
  applySafeFixForFinding,
  getSafeFixLabelForFinding,
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
  getValidationState,
  hasDrawableContent,
  parseSvgMarkup,
  type SvgDocument,
  type SvgLoadSource,
  type OptimizationReport,
  type SvgType,
  type SvgValidationState,
} from "@/lib/svg";
import { showSuccessToast, showWarningToast } from "@/stores/toast-store";

type SvgWorkspaceStore = {
  document: SvgDocument | null;
  source: SvgLoadSource | null;
  error: string | null;
  uploadValidation: SvgValidationState | null;
  optimizationValidation: SvgValidationState | null;
  optimizationReport: OptimizationReport | null;
  svgType: SvgType | null;
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
  resetToOriginal: () => void;
  setSvgType: (svgType: SvgType | null) => void;
  loadExample: () => void;
  dismissUploadValidation: () => void;
  dismissOptimizationValidation: () => void;
  clear: () => void;
};

function buildUpdatedOptimizationReport({
  existingReport,
  document,
  nextDocument,
  nextAppliedLabels,
}: {
  existingReport: OptimizationReport | null;
  document: SvgDocument;
  nextDocument: SvgDocument;
  nextAppliedLabels: string[];
}): OptimizationReport {
  const sizeBefore = existingReport?.sizeBefore ?? document.originalMetadata.byteLength;
  const healthBefore = existingReport?.healthBefore ?? document.analysis.health.score;
  const sizeAfter = nextDocument.metadata.byteLength;
  const bytesSaved = Math.max(0, sizeBefore - sizeAfter);
  const percentSaved = sizeBefore > 0
    ? Math.round((bytesSaved / sizeBefore) * 100)
    : 0;

  return {
    appliedCount: nextAppliedLabels.length,
    appliedLabels: nextAppliedLabels,
    healthBefore,
    healthAfter: nextDocument.analysis.health.score,
    sizeBefore,
    sizeAfter,
    bytesSaved,
    percentSaved,
  };
}

export const useSvgWorkspaceStore = create<SvgWorkspaceStore>((set) => ({
  document: null,
  source: null,
  error: null,
  uploadValidation: null,
  optimizationValidation: null,
  optimizationReport: null,
  svgType: null,
  isProcessing: false,

  loadFromContent: (content, filename, source) => {
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
        isProcessing: false,
      });
      trackAnalysisCompleted(document.analysis);
    } catch (error) {
      set({
        uploadValidation: getValidationState(error, source),
        isProcessing: false,
      });
    }
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
      const document = createSvgDocument(filename, content);
      set({
        document,
        source: "upload",
        error: null,
        uploadValidation: null,
        optimizationValidation: null,
        optimizationReport: null,
        svgType: null,
        isProcessing: false,
      });
      trackAnalyticsEvent("svg_uploaded");
      trackAnalysisCompleted(document.analysis);
    } catch (error) {
      set({
        uploadValidation: getValidationState(error, "upload"),
        isProcessing: false,
      });
    }
  },

  loadExample: () => {
    const document = createSvgDocument("logo-example.svg", EXAMPLE_SVG);
    set({
      document,
      source: "example",
      error: null,
      uploadValidation: null,
      optimizationValidation: null,
      optimizationReport: null,
      svgType: null,
      isProcessing: false,
    });
    trackAnalysisCompleted(document.analysis);
  },

  applyCurrentSafeFixes: () => {
    const state = useSvgWorkspaceStore.getState();
    const document = state.document;

    if (!document) {
      return;
    }

    trackAnalyticsEvent("optimize_clicked");
    set({ isProcessing: true, error: null, optimizationValidation: null });

    try {
      const { content: nextContent, appliedLabels } = applySafeFixesWithReport(
        document.content,
      );
      const nextSvg = parseSvgMarkup(nextContent.trim());

      if (!hasDrawableContent(nextSvg)) {
        set({
          optimizationValidation: null,
          isProcessing: false,
        });
        showWarningToast(
          "Optimization cancelled",
          "Optimizing this SVG would remove all drawable elements, so no changes were applied.",
        );
        return;
      }

      const nextDocument = createSvgDocument(
        document.filename,
        nextContent,
        document.originalContent,
      );

      const priorLabels = state.optimizationReport?.appliedLabels ?? [];
      const nextAppliedLabels = [...priorLabels, ...appliedLabels];

      set({
        document: nextDocument,
        error: null,
        optimizationValidation: null,
        optimizationReport: buildUpdatedOptimizationReport({
          existingReport: state.optimizationReport,
          document,
          nextDocument,
          nextAppliedLabels,
        }),
        isProcessing: false,
      });
      showSuccessToast("Optimized");
      trackAnalysisCompleted(nextDocument.analysis);
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
    const state = useSvgWorkspaceStore.getState();
    const document = state.document;

    if (!document) {
      return;
    }

    set({ isProcessing: true, error: null, optimizationValidation: null });

    try {
      const nextContent = applySafeFixForFinding(document.content, finding);
      const nextSvg = parseSvgMarkup(nextContent.trim());

      if (!hasDrawableContent(nextSvg)) {
        set({
          optimizationValidation: null,
          isProcessing: false,
        });
        showWarningToast(
          "Optimization cancelled",
          "Optimizing this SVG would remove all drawable elements, so no changes were applied.",
        );
        return;
      }

      const nextDocument = createSvgDocument(
        document.filename,
        nextContent,
        document.originalContent,
      );
      const appliedLabel = getSafeFixLabelForFinding(finding.id);
      const priorLabels = state.optimizationReport?.appliedLabels ?? [];
      const nextAppliedLabels = appliedLabel
        ? [...priorLabels, appliedLabel]
        : priorLabels;

      set({
        document: nextDocument,
        error: null,
        optimizationValidation: null,
        optimizationReport:
          nextAppliedLabels.length > 0
            ? buildUpdatedOptimizationReport({
                existingReport: state.optimizationReport,
                document,
                nextDocument,
                nextAppliedLabels,
              })
            : state.optimizationReport,
        isProcessing: false,
      });
      trackAnalysisCompleted(nextDocument.analysis);
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
    const state = useSvgWorkspaceStore.getState();
    const document = state.document;

    if (!document) {
      return;
    }

    const transformConfig =
      finding.id === "STRUCTURE_001"
        ? {
            apply: applyGenerateViewBox,
            label: "Generate ViewBox",
          }
        : finding.id === "COLORS_001"
          ? {
              apply: (content: string) =>
                applyCurrentColorTransform(content, "fill"),
              label: "Converted colors to currentColor",
            }
          : finding.id === "COLORS_002"
            ? {
                apply: (content: string) =>
                  applyCurrentColorTransform(content, "stroke"),
                label: "Converted colors to currentColor",
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
      const nextSvg = parseSvgMarkup(nextContent.trim());

      if (!hasDrawableContent(nextSvg)) {
        set({
          optimizationValidation: null,
          isProcessing: false,
        });
        showWarningToast(
          "Optimization cancelled",
          "Optimizing this SVG would remove all drawable elements, so no changes were applied.",
        );
        return;
      }

      const nextDocument = createSvgDocument(
        document.filename,
        nextContent,
        document.originalContent,
      );

      const priorLabels = state.optimizationReport?.appliedLabels ?? [];
      const appliedLabels = [...priorLabels, transformConfig.label];

      set({
        document: nextDocument,
        error: null,
        optimizationValidation: null,
        optimizationReport: buildUpdatedOptimizationReport({
          existingReport: state.optimizationReport,
          document,
          nextDocument,
          nextAppliedLabels: appliedLabels,
        }),
        isProcessing: false,
      });
      showSuccessToast(
        finding.id === "STRUCTURE_001"
          ? "Generated viewBox"
          : "Converted to currentColor",
      );
      trackAnalyticsEvent("transform_applied", {
        transform_id:
          finding.id === "STRUCTURE_001"
            ? "generate_viewbox"
            : "use_currentcolor",
      });
      trackAnalysisCompleted(nextDocument.analysis);
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

  resetToOriginal: () => {
    const state = useSvgWorkspaceStore.getState();
    const document = state.document;

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

      set({
        document: nextDocument,
        error: null,
        optimizationValidation: null,
        optimizationReport: null,
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
      isProcessing: false,
    });
  },
}));
