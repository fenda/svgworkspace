/** Browser-only guard for APIs that require `window` / `document`. */
export function assertBrowser(): void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    throw new Error(
      "SVG Workspace runs entirely in the browser. This API is not available during static generation.",
    );
  }
}

export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}
