export type CheckStatus = "good" | "warning";

export type SvgMetadata = {
  filename: string;
  viewBox: string;
  size: string;
  paths: number;
  colors: number;
  responsive: string;
};

export type SvgAnalysis = {
  grade: string;
  score: number;
  maxScore: number;
  label: string;
  potentialGains: string[];
  improvementsFound: number;
  estimatedReduction: string;
  estimatedSavings: string;
  checks: { label: string; status: CheckStatus }[];
  summary: { label: string; value: string; status: CheckStatus }[];
};

export type SvgDocument = {
  filename: string;
  content: string;
  metadata: SvgMetadata;
  analysis: SvgAnalysis;
};

export type SvgLoadSource = "upload" | "paste" | "example";
