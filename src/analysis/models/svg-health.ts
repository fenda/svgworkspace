import type { FindingCategory } from "./finding";

export const svgHealthCategories = [
  "structure",
  "performance",
  "colors",
  "accessibility",
  "maintainability",
] as const satisfies readonly FindingCategory[];

export type SvgHealthCategory = (typeof svgHealthCategories)[number];

export type SvgHealthCategoryScore = {
  category: SvgHealthCategory;
  score: number;
};

export type SvgHealth = {
  grade: string;
  score: number;
  potentialScore: number;
  findingCount: number;
  checkCount: number;
  categoryScores: SvgHealthCategoryScore[];
};
