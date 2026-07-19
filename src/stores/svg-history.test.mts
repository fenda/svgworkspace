import assert from "node:assert/strict";
import test from "node:test";
import {
  buildSvgHistoryState,
  MAX_SVG_HISTORY_ENTRIES,
} from "./svg-history.ts";

test("buildSvgHistoryState truncates redo history after undo", () => {
  const result = buildSvgHistoryState(
    ["<svg>a</svg>", "<svg>b</svg>", "<svg>c</svg>"],
    1,
    "<svg>b</svg>",
    "<svg>d</svg>",
  );

  assert.deepEqual(result.history, [
    "<svg>a</svg>",
    "<svg>b</svg>",
    "<svg>d</svg>",
  ]);
  assert.equal(result.historyIndex, 2);
});

test("buildSvgHistoryState caps stored entries to the maximum", () => {
  const entries = Array.from(
    { length: MAX_SVG_HISTORY_ENTRIES },
    (_, index) => `<svg>${index}</svg>`,
  );

  const result = buildSvgHistoryState(
    entries,
    entries.length - 1,
    entries[entries.length - 1] ?? "",
    "<svg>next</svg>",
  );

  assert.equal(result.history.length, MAX_SVG_HISTORY_ENTRIES);
  assert.equal(result.history[0], "<svg>1</svg>");
  assert.equal(
    result.history[result.history.length - 1],
    "<svg>next</svg>",
  );
  assert.equal(result.historyIndex, MAX_SVG_HISTORY_ENTRIES - 1);
});

test("buildSvgHistoryState avoids appending a duplicate next state", () => {
  const result = buildSvgHistoryState(
    ["<svg>a</svg>", "<svg>b</svg>"],
    1,
    "<svg>b</svg>",
    "<svg>b</svg>",
  );

  assert.deepEqual(result.history, ["<svg>a</svg>", "<svg>b</svg>"]);
  assert.equal(result.historyIndex, 1);
});
