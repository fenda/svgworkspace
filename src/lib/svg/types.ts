import type { AnalysisResult } from "@/analysis";

export type SvgMetadata = {
  filename: string;
  viewBox: string;
  size: string;
  paths: number;
  colors: number;
  responsive: string;
};

export type SvgDocument = {
  filename: string;
  content: string;
  metadata: SvgMetadata;
  analysis: AnalysisResult;
};

export type SvgLoadSource = "upload" | "paste" | "example";
