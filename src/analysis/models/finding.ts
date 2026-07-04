import type { Severity } from "./severity";

export type FindingCategory =
  | "structure"
  | "performance"
  | "colors"
  | "accessibility"
  | "maintainability"
  | "compatibility";

export type Finding = {
  id: string;
  category: FindingCategory;
  severity: Severity;
  title: string;
  description: string;
  recommendation: string;
  scoreImpact: number;
};
