import type { SvgLoadSource } from "./types";

export type SvgValidationCode =
  | "unsupported_file"
  | "invalid_svg"
  | "invalid_pasted_content"
  | "empty_svg"
  | "optimization_cancelled"
  | "unexpected_error";

export type SvgValidationState = {
  code: SvgValidationCode;
  title: string;
  message: string;
};

const SVG_PARSE_ERROR_MESSAGES = new Set([
  "Invalid SVG markup.",
  "Root element must be an <svg> tag.",
]);

const VALIDATION_STATES: Record<SvgValidationCode, SvgValidationState> = {
  unsupported_file: {
    code: "unsupported_file",
    title: "Unsupported file",
    message:
      "SVG Workspace currently accepts SVG (.svg) files only.\n\nPlease choose a valid SVG file.",
  },
  invalid_svg: {
    code: "invalid_svg",
    title: "Invalid SVG",
    message:
      "We couldn't parse this file as a valid SVG.\n\nPlease verify the file and try again.",
  },
  invalid_pasted_content: {
    code: "invalid_pasted_content",
    title: "Invalid SVG",
    message: "The pasted content doesn't appear to contain valid SVG markup.",
  },
  empty_svg: {
    code: "empty_svg",
    title: "Empty SVG",
    message: "This SVG doesn't contain any drawable elements.",
  },
  optimization_cancelled: {
    code: "optimization_cancelled",
    title: "Optimization cancelled",
    message:
      "Applying safe fixes would remove all drawable elements from this SVG, so no changes were applied.",
  },
  unexpected_error: {
    code: "unexpected_error",
    title: "Something went wrong",
    message:
      "An unexpected error occurred while processing this SVG.\n\nPlease try again.",
  },
};

export class SvgWorkspaceValidationError extends Error {
  readonly code: SvgValidationCode;

  constructor(code: SvgValidationCode) {
    super(VALIDATION_STATES[code].message);
    this.name = "SvgWorkspaceValidationError";
    this.code = code;
  }
}

export function createValidationState(
  code: SvgValidationCode,
): SvgValidationState {
  return VALIDATION_STATES[code];
}

export function createValidationError(
  code: SvgValidationCode,
): SvgWorkspaceValidationError {
  return new SvgWorkspaceValidationError(code);
}

export function getValidationState(
  error: unknown,
  source: SvgLoadSource,
): SvgValidationState {
  if (error instanceof SvgWorkspaceValidationError) {
    return createValidationState(error.code);
  }

  if (
    error instanceof Error &&
    SVG_PARSE_ERROR_MESSAGES.has(error.message)
  ) {
    return createValidationState(
      source === "paste" ? "invalid_pasted_content" : "invalid_svg",
    );
  }

  return createValidationState("unexpected_error");
}
