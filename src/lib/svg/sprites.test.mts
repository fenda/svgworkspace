import assert from "node:assert/strict";
import test from "node:test";
import {
  createSpriteSymbolPreviews,
  createSpriteSymbolPreview,
  getStandaloneSpriteSymbol,
  matchesSpriteSymbolSearch,
  resolveSpriteViewBox,
  sortSpriteSymbols,
  summarizeSpriteViewBoxes,
} from "./sprites.ts";

function createCounts(overrides: Partial<{
  paths: number;
  groups: number;
  circles: number;
  rects: number;
  polygons: number;
  lines: number;
  text: number;
  defs: number;
  styles: number;
  uses: number;
  shapes: number;
}> = {}) {
  return {
    paths: 0,
    groups: 0,
    circles: 0,
    rects: 0,
    polygons: 0,
    lines: 0,
    text: 0,
    defs: 0,
    styles: 0,
    uses: 0,
    shapes: 0,
    ...overrides,
  };
}

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
    elementCounts: createCounts({ paths: 1 }),
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
    elementCounts: createCounts({ paths: 1 }),
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
      elementCounts: createCounts({ paths: 1 }),
    },
    {
      id: "fallback-box",
      viewBox: null,
      width: "12",
      height: "12",
      childMarkup: "<rect x=\"2\" y=\"2\" width=\"8\" height=\"8\" />",
      elementCounts: createCounts({ rects: 1, shapes: 1 }),
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
      elementCounts: createCounts({ paths: 1 }),
    },
    {
      id: "broken",
      viewBox: "oops",
      width: null,
      height: null,
      childMarkup: "",
      elementCounts: createCounts(),
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

test("matchesSpriteSymbolSearch checks id, title, and description case-insensitively", () => {
  const symbol = createSpriteSymbolPreview({
    id: "arrow-left",
    title: "Arrow Left",
    desc: "Navigates back",
    viewBox: "0 0 24 24",
    width: null,
    height: null,
    childMarkup: "<path d=\"M2 2h20v20H2z\" />",
    elementCounts: createCounts({ paths: 1 }),
  });

  assert.equal(matchesSpriteSymbolSearch(symbol, "arrow"), true);
  assert.equal(matchesSpriteSymbolSearch(symbol, "NAVIGATES"), true);
  assert.equal(matchesSpriteSymbolSearch(symbol, "missing"), false);
});

test("sortSpriteSymbols supports original, alphabetical, and recent order", () => {
  const symbols = createSpriteSymbolPreviews([
    {
      key: "third",
      index: 2,
      id: "third",
      viewBox: "0 0 24 24",
      width: null,
      height: null,
      childMarkup: "<path d=\"M2 2h20v20H2z\" />",
      elementCounts: createCounts({ paths: 1 }),
    },
    {
      key: "alpha",
      index: 0,
      id: "alpha",
      viewBox: "0 0 24 24",
      width: null,
      height: null,
      childMarkup: "<path d=\"M2 2h20v20H2z\" />",
      elementCounts: createCounts({ paths: 1 }),
    },
    {
      key: "beta",
      index: 1,
      id: "beta",
      viewBox: "0 0 24 24",
      width: null,
      height: null,
      childMarkup: "<path d=\"M2 2h20v20H2z\" />",
      elementCounts: createCounts({ paths: 1 }),
    },
  ]);

  assert.deepEqual(
    sortSpriteSymbols(symbols, "original").map((symbol) => symbol.id),
    ["alpha", "beta", "third"],
  );
  assert.deepEqual(
    sortSpriteSymbols(symbols, "alphabetical").map((symbol) => symbol.id),
    ["alpha", "beta", "third"],
  );
  assert.deepEqual(
    sortSpriteSymbols(symbols, "recent", ["beta", "third"]).map((symbol) => symbol.id),
    ["beta", "third", "alpha"],
  );
});

test("getStandaloneSpriteSymbol includes only referenced shared defs and styles", () => {
  const symbol = createSpriteSymbolPreview({
    key: "brand-mark",
    index: 0,
    id: "brand-mark",
    viewBox: "0 0 24 24",
    width: null,
    height: null,
    childMarkup: "<path class=\"brand\" fill=\"url(#brand-gradient)\" d=\"M2 2h20v20H2z\" />",
    elementCounts: createCounts({ paths: 1 }),
    referencedDefinitionIds: ["brand-gradient"],
    hasSharedDefinitionReferences: true,
    hasSharedStyleUsage: true,
  });

  const result = getStandaloneSpriteSymbol(symbol, {
    namespaceAttributes: 'xmlns="http://www.w3.org/2000/svg"',
    styleBlocks: ["<style>.brand{stroke:#111}</style>"],
    definitions: [
      {
        id: "brand-gradient",
        kind: "lineargradient",
        markup: "<linearGradient id=\"brand-gradient\"><stop offset=\"0\" stop-color=\"#000\"/></linearGradient>",
        references: [],
        hasStyleUsage: false,
      },
      {
        id: "unused-gradient",
        kind: "lineargradient",
        markup: "<linearGradient id=\"unused-gradient\"><stop offset=\"0\" stop-color=\"#fff\"/></linearGradient>",
        references: [],
        hasStyleUsage: false,
      },
    ],
  });

  assert.match(result.markup ?? "", /brand-gradient/);
  assert.doesNotMatch(result.markup ?? "", /unused-gradient/);
  assert.match(result.markup ?? "", /<style>\.brand/);
  assert.equal(result.warnings.length, 0);
});
