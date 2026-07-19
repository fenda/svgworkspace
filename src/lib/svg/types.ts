import type { AnalysisResult } from "@/analysis";

export type SvgType = "icon" | "logo" | "sprite_sheet";

export type SvgSymbolElementCounts = {
  paths: number;
  shapes: number;
  uses: number;
  groups: number;
};

export type SvgSymbolPreview = {
  id: string | null;
  viewBox: string | null;
  childMarkup: string;
  previewMarkup: string | null;
  previewUnavailableReason: string | null;
  elementCounts: SvgSymbolElementCounts;
};

export type SvgMetadata = {
  filename: string;
  viewBox: string;
  size: string;
  byteLength: number;
  paths: number;
  colors: number;
  scalable: string;
  scalableExplanation: string;
};

export type OptimizationReport = {
  appliedCount: number;
  appliedLabels: string[];
  healthBefore: number;
  healthAfter: number;
  sizeBefore: number;
  sizeAfter: number;
  bytesSaved: number;
  percentSaved: number;
};

export type SvgDocument = {
  filename: string;
  originalContent: string;
  content: string;
  symbols: SvgSymbolPreview[];
  originalMetadata: SvgMetadata;
  metadata: SvgMetadata;
  analysis: AnalysisResult;
};

export type SvgLoadSource = "upload" | "paste" | "example";
