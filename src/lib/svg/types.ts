import type { AnalysisResult } from "@/analysis";

export type SvgDetectedType =
  | "icon"
  | "logo"
  | "illustration"
  | "diagram"
  | "sprite_sheet"
  | "unknown";

export type SvgTypeConfidence = "high" | "medium" | "low";

export type SvgMetadata = {
  filename: string;
  viewBox: string;
  size: string;
  byteLength: number;
  paths: number;
  colors: number;
  scalable: string;
  scalableExplanation: string;
  type: string;
  typeConfidence: SvgTypeConfidence;
  typeExplanation: string;
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
  originalMetadata: SvgMetadata;
  metadata: SvgMetadata;
  analysis: AnalysisResult;
};

export type SvgLoadSource = "upload" | "paste" | "example";
