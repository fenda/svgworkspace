import type { AnalysisResult } from "@/analysis/models/analysis-result";
import type { SvgMetadata, SvgType } from "@/lib/svg/types";

export type Insight = {
  id: string;
  title: string;
  explanation: string;
  suggestedAction?: string;
};

export type InsightContext = {
  analysis: AnalysisResult;
  metadata: SvgMetadata;
  svgType: SvgType | null;
};
