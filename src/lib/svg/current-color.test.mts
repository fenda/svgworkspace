import assert from "node:assert/strict";
import test from "node:test";
import {
  isIgnoredPaintValue,
  isTransformableCurrentColorPaintValue,
} from "./current-color.ts";

test("isIgnoredPaintValue excludes keywords and references that should not transform", () => {
  assert.equal(isIgnoredPaintValue("none"), true);
  assert.equal(isIgnoredPaintValue("currentColor"), true);
  assert.equal(isIgnoredPaintValue("var(--icon-color)"), true);
  assert.equal(isIgnoredPaintValue("url(#gradient)"), true);
  assert.equal(isIgnoredPaintValue("#193f6f"), false);
});

test("isTransformableCurrentColorPaintValue accepts common solid paint values only", () => {
  assert.equal(isTransformableCurrentColorPaintValue("#193f6f"), true);
  assert.equal(isTransformableCurrentColorPaintValue("rgb(10, 20, 30)"), true);
  assert.equal(isTransformableCurrentColorPaintValue("red"), true);
  assert.equal(isTransformableCurrentColorPaintValue("none"), false);
  assert.equal(isTransformableCurrentColorPaintValue("url(#paint)"), false);
  assert.equal(isTransformableCurrentColorPaintValue("var(--paint)"), false);
});
