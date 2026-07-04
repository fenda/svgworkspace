"use client";

import { create } from "zustand";
import type { Finding } from "@/analysis";
import {
  applySafeFixes,
  applySafeFixForFinding,
} from "@/actions/safe-fixes/apply-safe-fixes";
import { EXAMPLE_SVG } from "@/lib/mock-data";
import {
  createSvgDocument,
  createValidationState,
  getValidationState,
  hasDrawableContent,
  parseSvgMarkup,
  type SvgDocument,
  type SvgLoadSource,
  type SvgValidationState,
} from "@/lib/svg";

type SvgWorkspaceStore = {
  document: SvgDocument | null;
  source: SvgLoadSource | null;
  error: string | null;
  uploadValidation: SvgValidationState | null;
  optimizationValidation: SvgValidationState | null;
  isProcessing: boolean;
  loadFromContent: (
    content: string,
    filename: string,
    source: SvgLoadSource,
  ) => void;
  loadFromFile: (file: File) => Promise<void>;
  applyCurrentSafeFixes: () => void;
  applySafeFixForFinding: (finding: Finding) => void;
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
      const nextContent = applySafeFixes(document.content);
      const nextSvg = parseSvgMarkup(nextContent.trim());

      if (!hasDrawableContent(nextSvg)) {
        set({
          optimizationValidation: createValidationState(
            "optimization_cancelled",
          ),
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
      isProcessing: false,
    });
  },
}));
