import { accessibility001MissingTitle } from "./accessibility/accessibility-001-missing-title";
import { accessibility002EmptyTitle } from "./accessibility/accessibility-002-empty-title";
import { accessibility003MissingDesc } from "./accessibility/accessibility-003-missing-desc";
import { accessibility004EmptyDesc } from "./accessibility/accessibility-004-empty-desc";
import { accessibility005DecorativeSvg } from "./accessibility/accessibility-005-decorative-svg";
import { colors001HardcodedFillColors } from "./colors/colors-001-hardcoded-fill-colors";
import { colors002HardcodedStrokeColors } from "./colors/colors-002-hardcoded-stroke-colors";
import { maintainability001InlineStyles } from "./maintainability/maintainability-001-inline-styles";
import { maintainability002EmbeddedCssClasses } from "./maintainability/maintainability-002-embedded-css-classes";
import { performance001MetadataFound } from "./performance/performance-001-metadata-found";
import { performance002CommentsFound } from "./performance/performance-002-comments-found";
import { performance003HighDecimalPrecision } from "./performance/performance-003-high-decimal-precision";
import { performance004HiddenElements } from "./performance/performance-004-hidden-elements";
import { performance005UnusedDefinitions } from "./performance/performance-005-unused-definitions";
import { performance006UnusedNamespaces } from "./performance/performance-006-unused-namespaces";
import { react001ClassAttribute } from "./react-ready/react-001-class-attribute";
import { react002KebabCaseAttributes } from "./react-ready/react-002-kebab-case-attributes";
import { react003InlineStyleString } from "./react-ready/react-003-inline-style-string";
import { react004XlinkAttribute } from "./react-ready/react-004-xlink-attribute";
import { react005InlineEventHandlers } from "./react-ready/react-005-inline-event-handlers";
import { structure001MissingViewBox } from "./structure/structure-001-missing-viewbox";
import { structure002FixedWidthHeight } from "./structure/structure-002-fixed-width-height";
import { structure003DuplicateIds } from "./structure/structure-003-duplicate-ids";
import { structure004EmptyGroups } from "./structure/structure-004-empty-groups";
import { structure005EmptyPaths } from "./structure/structure-005-empty-paths";
import { structure006EmptyDefinitions } from "./structure/structure-006-empty-definitions";
import { structure007EmptySymbols } from "./structure/structure-007-empty-symbols";
import { validateRuleMetadata } from "./utils";
import type { AnalysisRule } from "@/analysis/models";

const structureRules: AnalysisRule[] = [
  structure001MissingViewBox,
  structure002FixedWidthHeight,
  structure003DuplicateIds,
  structure004EmptyGroups,
  structure005EmptyPaths,
  structure006EmptyDefinitions,
  structure007EmptySymbols,
];

const performanceRules: AnalysisRule[] = [
  performance001MetadataFound,
  performance002CommentsFound,
  performance003HighDecimalPrecision,
  performance004HiddenElements,
  performance005UnusedDefinitions,
  performance006UnusedNamespaces,
];

const colorRules: AnalysisRule[] = [
  colors001HardcodedFillColors,
  colors002HardcodedStrokeColors,
];

const accessibilityRules: AnalysisRule[] = [
  accessibility001MissingTitle,
  accessibility002EmptyTitle,
  accessibility003MissingDesc,
  accessibility004EmptyDesc,
  accessibility005DecorativeSvg,
];

const maintainabilityRules: AnalysisRule[] = [
  maintainability001InlineStyles,
  maintainability002EmbeddedCssClasses,
];

const svgHealthRuleGroups: AnalysisRule[] = [
  ...structureRules,
  ...performanceRules,
  ...colorRules,
  ...accessibilityRules,
  ...maintainabilityRules,
];

const reactReadyRuleGroup: AnalysisRule[] = [
  react001ClassAttribute,
  react002KebabCaseAttributes,
  react003InlineStyleString,
  react004XlinkAttribute,
  react005InlineEventHandlers,
];

export const svgHealthRules = validateRuleMetadata(
  svgHealthRuleGroups,
  "svgHealthRules",
);

export const reactReadyRules = validateRuleMetadata(
  reactReadyRuleGroup,
  "reactReadyRules",
);
