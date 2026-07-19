export { extractSvgMetadata, formatBytes, formatPercentage } from "./metadata";
export {
  createSvgDocument,
  hasDrawableContent,
  loadSvgFromFile,
  loadSvgFromString,
  readSvgFile,
} from "./load";
export { parseSvgMarkup, serializeSvg } from "./parse";
export {
  collectSvgSymbols,
  createSpriteSymbolPreview,
  getSpriteScalabilitySummary,
  isSpriteContainerSvg,
  resolveSpriteViewBox,
  summarizeSpriteViewBoxes,
} from "./sprites";
export { hasValidViewBox } from "./viewbox";
export {
  createValidationError,
  createValidationState,
  getValidationState,
  SvgWorkspaceValidationError,
} from "./validation";
export type {
  OptimizationReport,
  SvgDocument,
  SvgLoadSource,
  SvgMetadata,
  SvgSymbolElementCounts,
  SvgSymbolPreview,
  SvgType,
} from "./types";
export type { SvgValidationCode, SvgValidationState } from "./validation";
