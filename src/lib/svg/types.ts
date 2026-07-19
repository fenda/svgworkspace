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

export type OptimizationStepStatus =
  | "changed"
  | "unchanged"
  | "skipped"
  | "failed";

export type OptimizationChange = {
  type: string;
  label: string;
  count?: number;
};

export type OptimizationStep = {
  id: string;
  label: string;
  description?: string;
  status: OptimizationStepStatus;
  beforeSizeBytes: number;
  afterSizeBytes: number;
  savedBytes: number;
  savedPercentage: number;
  changes?: OptimizationChange[];
  warning?: string;
};

export type OptimizationReport = {
  originalSizeBytes: number;
  optimizedSizeBytes: number;
  savedBytes: number;
  savedPercentage: number;
  startedAt?: string;
  completedAt?: string;
  steps: OptimizationStep[];
  appliedCount: number;
  appliedLabels: string[];
  changedStepCount: number;
  unchangedStepCount: number;
  skippedStepCount: number;
  failedStepCount: number;
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
