export { extractSvgMetadata } from "./metadata";
export {
  createSvgDocument,
  hasDrawableContent,
  loadSvgFromFile,
  loadSvgFromString,
  readSvgFile,
} from "./load";
export { parseSvgMarkup, serializeSvg } from "./parse";
export {
  createValidationError,
  createValidationState,
  getValidationState,
  SvgWorkspaceValidationError,
} from "./validation";
export type { SvgDocument, SvgLoadSource, SvgMetadata } from "./types";
export type { SvgValidationCode, SvgValidationState } from "./validation";
