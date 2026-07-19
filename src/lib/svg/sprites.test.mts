import assert from "node:assert/strict";
import test from "node:test";
import {
  createSpriteSymbolPreviews,
  createSpriteSymbolPreview,
  resolveSpriteViewBox,
  summarizeSpriteViewBoxes,
} from "./sprites.ts";

test("resolveSpriteViewBox preserves a valid viewBox", () => {
  assert.equal(
    resolveSpriteViewBox({
      viewBox: "0 0 24 24",
      width: null,
      height: null,
    }),
    "0 0 24 24",
  );
});

test("resolveSpriteViewBox derives a fallback from width and height", () => {
  assert.equal(
    resolveSpriteViewBox({
      viewBox: null,
      width: "16",
      height: "20",
    }),
    "0 0 16 20",
  );
});

test("createSpriteSymbolPreview preserves unnamed symbols", () => {
  const symbol = createSpriteSymbolPreview({
    id: null,
    viewBox: "0 0 24 24",
    width: null,
    height: null,
    childMarkup: "<path d=\"M2 2h20v20H2z\" />",
    elementCounts: { paths: 1, shapes: 0, uses: 0, groups: 0 },
  });

  assert.equal(symbol.id, null);
  assert.match(symbol.previewMarkup ?? "", /viewBox="0 0 24 24"/);
});

test("createSpriteSymbolPreview marks symbols without a usable viewBox as unavailable", () => {
  const symbol = createSpriteSymbolPreview({
    id: "missing-box",
    viewBox: null,
    width: null,
    height: null,
    childMarkup: "<path d=\"M2 2h20v20H2z\" />",
    elementCounts: { paths: 1, shapes: 0, uses: 0, groups: 0 },
  });

  assert.equal(symbol.previewMarkup, null);
  assert.match(symbol.previewUnavailableReason ?? "", /no usable viewBox/i);
});

test("createSpriteSymbolPreviews supports empty and multi-symbol galleries", () => {
  assert.equal(createSpriteSymbolPreviews([]).length, 0);

  const symbols = createSpriteSymbolPreviews([
    {
      id: "arrow-left",
      viewBox: "0 0 24 24",
      width: null,
      height: null,
      childMarkup: "<path d=\"M12 4 4 12l8 8\" />",
      elementCounts: { paths: 1, shapes: 0, uses: 0, groups: 0 },
    },
    {
      id: "fallback-box",
      viewBox: null,
      width: "12",
      height: "12",
      childMarkup: "<rect x=\"2\" y=\"2\" width=\"8\" height=\"8\" />",
      elementCounts: { paths: 0, shapes: 1, uses: 0, groups: 0 },
    },
  ]);

  assert.equal(symbols.length, 2);
  assert.equal(symbols[0]?.id, "arrow-left");
  assert.equal(symbols[1]?.viewBox, "0 0 12 12");
});

test("mixed valid and malformed symbol inputs do not break the gallery", () => {
  const symbols = createSpriteSymbolPreviews([
    {
      id: "valid",
      viewBox: "0 0 24 24",
      width: null,
      height: null,
      childMarkup: "<path d=\"M2 2h20v20H2z\" />",
      elementCounts: { paths: 1, shapes: 0, uses: 0, groups: 0 },
    },
    {
      id: "broken",
      viewBox: "oops",
      width: null,
      height: null,
      childMarkup: "",
      elementCounts: { paths: 0, shapes: 0, uses: 0, groups: 0 },
    },
  ]);

  assert.equal(symbols.length, 2);
  assert.ok(symbols[0]?.previewMarkup);
  assert.equal(symbols[1]?.previewMarkup, null);
});

test("summarizeSpriteViewBoxes reports a clean sprite when every symbol has a valid viewBox", () => {
  const summary = summarizeSpriteViewBoxes([
    "0 0 24 24",
    "0 0 16 16",
  ]);

  assert.equal(summary.isSpriteContainer, true);
  assert.equal(summary.totalSymbols, 2);
  assert.equal(summary.symbolsWithValidViewBox, 2);
  assert.equal(summary.symbolsMissingUsableViewBox, 0);
});

test("summarizeSpriteViewBoxes aggregates missing and invalid symbol viewBoxes", () => {
  const summary = summarizeSpriteViewBoxes([
    "0 0 24 24",
    null,
    "oops",
  ]);

  assert.equal(summary.totalSymbols, 3);
  assert.equal(summary.symbolsWithValidViewBox, 1);
  assert.equal(summary.symbolsMissingUsableViewBox, 2);
});
