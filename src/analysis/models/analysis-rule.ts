import type { Finding } from "./finding";

export type AnalysisRule = {
  id: string;
  category: Finding["category"];
  analyze: (svg: SVGSVGElement) => Finding | null;
};
