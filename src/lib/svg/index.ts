export { extractSvgMetadata, formatBytes } from "./metadata";
export {
  createSvgDocument,
  hasDrawableContent,
  loadSvgFromFile,
  loadSvgFromString,
  readSvgFile,
} from "./load";
export { parseSvgMarkup, serializeSvg } from "./parse";
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
} from "./types";
export type { SvgValidationCode, SvgValidationState } from "./validation";
