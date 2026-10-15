import assert from "node:assert/strict";
import test from "node:test";

import { preservesSvgWhitespace } from "./whitespace.ts";

test("preserves whitespace for text-sensitive SVG elements", () => {
  ["text", "tspan", "textPath", "style", "foreignObject", "script"].forEach(
    (elementName) => {
      assert.equal(preservesSvgWhitespace(elementName), true);
    },
  );
});

test("treats structural SVG elements as safe whitespace cleanup targets", () => {
  ["svg", "g", "path", "defs"].forEach((elementName) => {
    assert.equal(preservesSvgWhitespace(elementName), false);
  });
});
