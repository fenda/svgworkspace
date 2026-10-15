import assert from "node:assert/strict";
import test from "node:test";
import { createSvgDiff } from "./diff-svg.ts";

test("createSvgDiff tracks original and current line numbers", () => {
  const diff = createSvgDiff("first\nsecond\nthird", "first\nupdated\nthird\nfourth");

  assert.deepEqual(diff, [
    {
      kind: "context",
      text: "first",
      originalLineNumber: 1,
      currentLineNumber: 1,
    },
    {
      kind: "removed",
      text: "second",
      originalLineNumber: 2,
      currentLineNumber: null,
    },
    {
      kind: "added",
      text: "updated",
      originalLineNumber: null,
      currentLineNumber: 2,
    },
    {
      kind: "context",
      text: "third",
      originalLineNumber: 3,
      currentLineNumber: 3,
    },
    {
      kind: "added",
      text: "fourth",
      originalLineNumber: null,
      currentLineNumber: 4,
    },
  ]);
});
