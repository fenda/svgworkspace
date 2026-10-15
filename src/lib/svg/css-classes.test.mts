import assert from "node:assert/strict";
import test from "node:test";
import { summarizeCssReviewReasons } from "./css-review.ts";

test("summarizeCssReviewReasons identifies selector and declaration blockers", () => {
  assert.equal(
    summarizeCssReviewReasons([
      "complex selector",
      "unsupported declarations",
    ]),
    "2 embedded CSS rules need manual review because of complex selector, unsupported declarations.",
  );
});
