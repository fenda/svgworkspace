import type { Finding } from "./finding";

export type RuleFixType = "auto" | "manual" | "choice";

export type RuleStatus = "planned" | "implemented" | "deprecated";

export type AnalysisRule = {
  id: string;
  category: Finding["category"];
  title: string;
  description: string;
  severity: Finding["severity"];
  scoreImpact: number;
  fixType: RuleFixType;
  introducedIn: string;
  status: RuleStatus;
  analyze: (svg: SVGSVGElement) => Finding | null;
};
