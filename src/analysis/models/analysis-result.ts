import type { Finding } from "./finding";
import type { SvgHealth } from "./svg-health";

export type AnalysisResult = {
  findings: Finding[];
  health: SvgHealth;
};
