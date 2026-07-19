import assert from "node:assert/strict";
import test from "node:test";
import {
  areViewBoxesEqual,
  calculateLockedOutputSize,
  detectUniformPadding,
  expandViewBoxWithPadding,
  formatViewBox,
  getViewBoxDelta,
  normalizeToSquareCanvas,
  validateCustomViewBoxValues,
} from "./geometry-math.ts";

test("normalizeToSquareCanvas expands portrait viewBoxes around their center", () => {
  const result = normalizeToSquareCanvas({
    minX: 0,
    minY: 0,
    width: 16,
    height: 24,
  });

  assert.equal(formatViewBox(result), "-4 0 24 24");
});

test("normalizeToSquareCanvas respects non-zero origins", () => {
  const result = normalizeToSquareCanvas({
    minX: 10,
    minY: 20,
    width: 16,
    height: 24,
  });

  assert.equal(formatViewBox(result), "6 20 24 24");
});

test("expandViewBoxWithPadding stacks uniformly", () => {
  const base = {
    minX: 0,
    minY: 0,
    width: 24,
    height: 24,
  };
  const padded = expandViewBoxWithPadding(base, 4);
  const stacked = expandViewBoxWithPadding(padded, 8);

  assert.equal(formatViewBox(padded), "-4 -4 32 32");
  assert.equal(formatViewBox(stacked), "-12 -12 48 48");
});

test("detectUniformPadding recognizes original and square-derived padding", () => {
  const base = {
    minX: 0,
    minY: 0,
    width: 16,
    height: 24,
  };
  const square = normalizeToSquareCanvas(base);
  const padded = expandViewBoxWithPadding(square, 4);

  assert.equal(detectUniformPadding(square, padded), 4);
  assert.equal(detectUniformPadding(base, square), null);
});

test("validateCustomViewBox rejects invalid dimensions", () => {
  const invalid = validateCustomViewBoxValues({
    minX: "0",
    minY: "0",
    width: "0",
    height: "24",
  });

  assert.equal(invalid.valid, false);
});

test("validateCustomViewBox returns parsed values for valid input", () => {
  const valid = validateCustomViewBoxValues({
    minX: "10",
    minY: "20",
    width: "16",
    height: "24",
  });

  assert.equal(valid.valid, true);

  if (valid.valid) {
    assert.equal(formatViewBox(valid.value), "10 20 16 24");
  }
});

test("calculateLockedOutputSize preserves aspect ratio from the longest side preset", () => {
  const result = calculateLockedOutputSize(24, {
    minX: 0,
    minY: 0,
    width: 16,
    height: 24,
  });

  assert.equal(result.width, 16);
  assert.equal(result.height, 24);
});

test("getViewBoxDelta reports canvas movement and growth", () => {
  const delta = getViewBoxDelta(
    { minX: 0, minY: 0, width: 16, height: 24 },
    { minX: -4, minY: 0, width: 24, height: 24 },
  );

  assert.equal(delta?.minX, -4);
  assert.equal(delta?.minY, 0);
  assert.equal(delta?.width, 8);
  assert.equal(delta?.height, 0);
});

test("areViewBoxesEqual compares geometry with tolerance", () => {
  assert.equal(
    areViewBoxesEqual(
      { minX: 0, minY: 0, width: 24, height: 24 },
      { minX: 0, minY: 0, width: 24, height: 24 },
    ),
    true,
  );
});
