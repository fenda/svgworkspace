"use client";

import { create } from "zustand";
import { EXAMPLE_SVG } from "@/lib/mock-data";
import {
  createSvgDocument,
  type SvgDocument,
  type SvgLoadSource,
} from "@/lib/svg";

type SvgWorkspaceStore = {
  document: SvgDocument | null;
  source: SvgLoadSource | null;
  error: string | null;
  isProcessing: boolean;
  loadFromContent: (
    content: string,
    filename: string,
    source: SvgLoadSource,
  ) => void;
  loadFromFile: (file: File) => Promise<void>;
  loadExample: () => void;
  clear: () => void;
};

export const useSvgWorkspaceStore = create<SvgWorkspaceStore>((set) => ({
  document: null,
  source: null,
  error: null,
  isProcessing: false,

  loadFromContent: (content, filename, source) => {
    try {
      const document = createSvgDocument(filename, content);
      set({ document, source, error: null, isProcessing: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unable to process SVG.",
        isProcessing: false,
      });
    }
  },

  loadFromFile: async (file) => {
    set({ isProcessing: true, error: null });

    try {
      const { readSvgFile } = await import("@/lib/svg/load");
      const { filename, content } = await readSvgFile(file);
      const document = createSvgDocument(filename, content);
      set({ document, source: "upload", error: null, isProcessing: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unable to read SVG file.",
        isProcessing: false,
      });
    }
  },

  loadExample: () => {
    set({
      document: createSvgDocument("logo-example.svg", EXAMPLE_SVG),
      source: "example",
      error: null,
      isProcessing: false,
    });
  },

  clear: () => {
    set({ document: null, source: null, error: null, isProcessing: false });
  },
}));
