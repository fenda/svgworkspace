import { accessibility001MissingTitle } from "./accessibility/accessibility-001-missing-title";
import { accessibility002EmptyTitle } from "./accessibility/accessibility-002-empty-title";
import { accessibility003MissingDesc } from "./accessibility/accessibility-003-missing-desc";
import { accessibility004EmptyDesc } from "./accessibility/accessibility-004-empty-desc";
import { accessibility005DecorativeSvg } from "./accessibility/accessibility-005-decorative-svg";
import { colors001HardcodedFillColors } from "./colors/colors-001-hardcoded-fill-colors";
import { colors002HardcodedStrokeColors } from "./colors/colors-002-hardcoded-stroke-colors";
import { maintainability001InlineStyles } from "./maintainability/maintainability-001-inline-styles";
import { performance001MetadataFound } from "./performance/performance-001-metadata-found";
import { performance002CommentsFound } from "./performance/performance-002-comments-found";
import { performance003HighDecimalPrecision } from "./performance/performance-003-high-decimal-precision";
import { performance004HiddenElements } from "./performance/performance-004-hidden-elements";
import { structure001MissingViewBox } from "./structure/structure-001-missing-viewbox";
import { structure002FixedWidthHeight } from "./structure/structure-002-fixed-width-height";
import { structure003DuplicateIds } from "./structure/structure-003-duplicate-ids";
import { structure004EmptyGroups } from "./structure/structure-004-empty-groups";
import { structure005EmptyPaths } from "./structure/structure-005-empty-paths";
import type { AnalysisRule } from "@/analysis/models";

export const analysisRules: AnalysisRule[] = [
  structure001MissingViewBox,
  structure002FixedWidthHeight,
  structure003DuplicateIds,
  structure004EmptyGroups,
  structure005EmptyPaths,
  performance001MetadataFound,
  performance002CommentsFound,
  performance003HighDecimalPrecision,
  performance004HiddenElements,
  colors001HardcodedFillColors,
  colors002HardcodedStrokeColors,
  accessibility001MissingTitle,
  accessibility002EmptyTitle,
  accessibility003MissingDesc,
  accessibility004EmptyDesc,
  accessibility005DecorativeSvg,
  maintainability001InlineStyles,
];
