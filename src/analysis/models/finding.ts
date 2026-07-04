import type { Severity } from "./severity";

export type FindingCategory =
  | "structure"
  | "performance"
  | "colors"
  | "accessibility"
  | "maintainability"
  | "react-ready"
  | "compatibility";

export type Finding = {
  id: string;
  category: FindingCategory;
  severity: Severity;
  fixType?: "auto" | "manual" | "choice";
  title: string;
  description: string;
  recommendation: string;
  scoreImpact: number;
};
