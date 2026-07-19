export { extractSvgMetadata, formatBytes, formatPercentage } from "./metadata";
export {
  areGeometryAttributesEqual,
  areOutputDimensionsEqual,
  extractSvgGeometry,
  getGeometryAttributeSnapshot,
  validateCustomViewBox,
} from "./geometry";
export {
  areViewBoxesEqual,
  calculateLockedOutputSize,
  detectUniformPadding,
  expandViewBoxWithPadding,
  formatGeometryNumber,
  formatViewBox,
  getViewBoxDelta,
  normalizeToSquareCanvas,
  validateCustomViewBoxValues,
} from "./geometry-math";
export {
  createSvgDocument,
  hasDrawableContent,
  loadSvgFromFile,
  loadSvgFromString,
  readSvgFile,
} from "./load";
export { parseSvgMarkup, serializeSvg } from "./parse";
export {
  collectSvgSpriteData,
  collectSvgSymbols,
  createSpriteSymbolPreview,
  getSharedResourceUsageSummary,
  getStandaloneSpriteSymbol,
  getSymbolExportFilename,
  getSpriteScalabilitySummary,
  hasSharedResourceUsage,
  isSpriteContainerSvg,
  matchesSpriteSymbolSearch,
  resolveSpriteViewBox,
  sortSpriteSymbols,
  summarizeSpriteViewBoxes,
} from "./sprites";
export { hasValidViewBox } from "./viewbox";
export type { ParsedViewBox } from "./viewbox";
export { getAutomaticPreviewBackground } from "./preview-background";
export type { PreviewBackground } from "./preview-background";
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
  SvgSpriteResources,
  SvgSymbolElementCounts,
  SvgSymbolPreview,
  SvgType,
} from "./types";
export type { SvgGeometryInfo } from "./geometry";
export type { SvgValidationCode, SvgValidationState } from "./validation";
