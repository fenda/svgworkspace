export type CssReviewReason =
  | "complex selector"
  | "unsupported declarations"
  | "unsupported syntax";

export function summarizeCssReviewReasons(
  reasons: CssReviewReason[],
): string | null {
  if (reasons.length === 0) {
    return null;
  }

  const uniqueReasons = Array.from(new Set(reasons));
  const count = reasons.length;
  const ruleLabel = count === 1 ? "rule needs" : "rules need";

  return `${count} embedded CSS ${ruleLabel} manual review because of ${uniqueReasons.join(", ")}.`;
}
