"use client";

import { create } from "zustand";
import type { Finding } from "@/analysis";
import {
  applySafeFixesWithReport,
  applySafeFixForFinding,
} from "@/actions/safe-fixes/apply-safe-fixes";
import { applyGenerateViewBox } from "@/actions/transforms/generate-viewbox";
import { EXAMPLE_SVG } from "@/lib/mock-data";
import {
  createSvgDocument,
  createValidationState,
  getValidationState,
  hasDrawableContent,
  parseSvgMarkup,
  type SvgDocument,
  type SvgLoadSource,
  type OptimizationReport,
  type SvgValidationState,
} from "@/lib/svg";

type SvgWorkspaceStore = {
  document: SvgDocument | null;
  source: SvgLoadSource | null;
  error: string | null;
  uploadValidation: SvgValidationState | null;
  optimizationValidation: SvgValidationState | null;
  optimizationReport: OptimizationReport | null;
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
  loadExample: () => void;
  dismissUploadValidation: () => void;
  dismissOptimizationValidation: () => void;
  clear: () => void;
};

export const useSvgWorkspaceStore = create<SvgWorkspaceStore>((set) => ({
  document: null,
  source: null,
  error: null,
  uploadValidation: null,
  optimizationValidation: null,
  optimizationReport: null,
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
        isProcessing: false,
      });
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
        isProcessing: false,
      });
    } catch (error) {
      set({
        uploadValidation: getValidationState(error, "upload"),
        isProcessing: false,
      });
    }
  },

  loadExample: () => {
    set({
      document: createSvgDocument("logo-example.svg", EXAMPLE_SVG),
      source: "example",
      error: null,
      uploadValidation: null,
      optimizationValidation: null,
      optimizationReport: null,
      isProcessing: false,
    });
  },

  applyCurrentSafeFixes: () => {
    const state = useSvgWorkspaceStore.getState();
    const document = state.document;

    if (!document) {
      return;
    }

    set({ isProcessing: true, error: null, optimizationValidation: null });

    try {
      const { content: nextContent, appliedLabels } = applySafeFixesWithReport(
        document.content,
      );
      const nextSvg = parseSvgMarkup(nextContent.trim());

      if (!hasDrawableContent(nextSvg)) {
        set({
          optimizationValidation: createValidationState(
            "optimization_cancelled",
          ),
          optimizationReport: null,
          isProcessing: false,
        });
        return;
      }

      const nextDocument = createSvgDocument(
        document.filename,
        nextContent,
        document.originalContent,
      );

      const sizeBefore = document.metadata.byteLength;
      const sizeAfter = nextDocument.metadata.byteLength;
      const bytesSaved = Math.max(0, sizeBefore - sizeAfter);
      const percentSaved = sizeBefore > 0
        ? Math.round((bytesSaved / sizeBefore) * 100)
        : 0;

      set({
        document: nextDocument,
        error: null,
        optimizationValidation: null,
        optimizationReport: {
          appliedCount: appliedLabels.length,
          appliedLabels,
          healthBefore: document.analysis.health.score,
          healthAfter: nextDocument.analysis.health.score,
          sizeBefore,
          sizeAfter,
          bytesSaved,
          percentSaved,
        },
        isProcessing: false,
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
          optimizationValidation: createValidationState(
            "optimization_cancelled",
          ),
          optimizationReport: null,
          isProcessing: false,
        });
        return;
      }

      const nextDocument = createSvgDocument(
        document.filename,
        nextContent,
        document.originalContent,
      );

      set({
        document: nextDocument,
        error: null,
        optimizationValidation: null,
        optimizationReport: state.optimizationReport,
        isProcessing: false,
      });
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

    if (finding.id !== "STRUCTURE_001") {
      set({
        error: "This issue does not have a transform action yet.",
        isProcessing: false,
      });
      return;
    }

    set({ isProcessing: true, error: null, optimizationValidation: null });

    try {
      const nextContent = applyGenerateViewBox(document.content);
      const nextSvg = parseSvgMarkup(nextContent.trim());

      if (!hasDrawableContent(nextSvg)) {
        set({
          optimizationValidation: createValidationState(
            "optimization_cancelled",
          ),
          optimizationReport: null,
          isProcessing: false,
        });
        return;
      }

      const nextDocument = createSvgDocument(
        document.filename,
        nextContent,
        document.originalContent,
      );

      const priorLabels = state.optimizationReport?.appliedLabels ?? [];
      const appliedLabels = priorLabels.includes("Generate ViewBox")
        ? priorLabels
        : [...priorLabels, "Generate ViewBox"];
      const sizeBefore = state.optimizationReport?.sizeBefore ?? document.metadata.byteLength;
      const healthBefore = state.optimizationReport?.healthBefore ?? document.analysis.health.score;
      const sizeAfter = nextDocument.metadata.byteLength;
      const bytesSaved = Math.max(0, sizeBefore - sizeAfter);
      const percentSaved = sizeBefore > 0
        ? Math.round((bytesSaved / sizeBefore) * 100)
        : 0;

      set({
        document: nextDocument,
        error: null,
        optimizationValidation: null,
        optimizationReport: {
          appliedCount: appliedLabels.length,
          appliedLabels,
          healthBefore,
          healthAfter: nextDocument.analysis.health.score,
          sizeBefore,
          sizeAfter,
          bytesSaved,
          percentSaved,
        },
        isProcessing: false,
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
      isProcessing: false,
    });
  },
}));
