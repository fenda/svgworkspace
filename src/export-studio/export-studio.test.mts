import assert from "node:assert/strict";
import test from "node:test";
import { buildExportFilename } from "./filename.ts";
import { resolveExportSources } from "./resolver.ts";
import type {
  OptimizationReport,
  SvgDocument,
  SvgMetadata,
  SvgSpriteResources,
  SvgSymbolPreview,
} from "../lib/svg/types.ts";

function createMetadata(): SvgMetadata {
  return {
    filename: "fixture.svg",
    viewBox: "0 0 24 24",
    size: "120 B",
    byteLength: 120,
    paths: 1,
    colors: 1,
    scalable: "Yes",
    scalableExplanation: "This SVG scales correctly.",
  };
}

function createSymbol(overrides: Partial<SvgSymbolPreview> = {}): SvgSymbolPreview {
  return {
    key: "arrow-left",
    index: 0,
    id: "arrow-left",
    title: null,
    desc: null,
    viewBox: "0 0 24 24",
    width: null,
    height: null,
    estimatedDimensions: "24 × 24",
    childMarkup: "<path d=\"M2 12h20\" />",
    previewMarkup: "<svg viewBox=\"0 0 24 24\"><path d=\"M2 12h20\" /></svg>",
    previewUnavailableReason: null,
    elementCounts: {
      paths: 1,
      groups: 0,
      circles: 0,
      rects: 0,
      polygons: 0,
      lines: 0,
      text: 0,
      defs: 0,
      styles: 0,
      uses: 0,
      shapes: 1,
    },
    referencedDefinitionIds: [],
    unresolvedReferenceIds: [],
    hasSharedDefinitionReferences: false,
    hasStyleUsage: false,
    hasSharedStyleUsage: false,
    usesGradients: false,
    usesClipPaths: false,
    usesMasks: false,
    usesFilters: false,
    usesMarkers: false,
    ...overrides,
  };
}

function createDocument(
  overrides: Partial<SvgDocument> = {},
): SvgDocument {
  const metadata = createMetadata();

  return {
    filename: "logo.svg",
    originalContent: "<svg viewBox=\"0 0 24 24\"><path d=\"M2 2h20v20H2z\" /></svg>",
    content: "<svg viewBox=\"0 0 24 24\"><path d=\"M2 2h20v20H2z\" /></svg>",
    symbols: [],
    spriteResources: null,
    originalGeometry: {} as SvgDocument["originalGeometry"],
    geometry: {} as SvgDocument["geometry"],
    originalMetadata: metadata,
    metadata,
    analysis: {} as SvgDocument["analysis"],
    ...overrides,
  };
}

function resolveSelectedSymbolExport(
  symbol: SvgSymbolPreview,
  resources: SvgSpriteResources | null,
) {
  void resources;

  return {
    markup: `<svg viewBox="${symbol.viewBox}">${symbol.childMarkup}</svg>`,
    warnings: [],
    filename: `${symbol.id ?? "symbol"}.svg`,
  };
}

const optimizationReport: OptimizationReport = {
  originalSizeBytes: 120,
  optimizedSizeBytes: 90,
  savedBytes: 30,
  savedPercentage: 25,
  steps: [],
  appliedCount: 1,
  appliedLabels: ["Remove comments"],
  changedStepCount: 1,
  unchangedStepCount: 0,
  skippedStepCount: 0,
  failedStepCount: 0,
};

test("buildExportFilename sanitizes names and avoids duplicate suffixes", () => {
  assert.equal(buildExportFilename("logo.svg"), "logo.svg");
  assert.equal(buildExportFilename("logo.svg", "current"), "logo-current.svg");
  assert.equal(buildExportFilename("logo-current.svg", "current"), "logo-current.svg");
  assert.equal(buildExportFilename("team / mark.svg", "optimized"), "team-mark-optimized.svg");
});

test("standalone documents resolve original, current, and unavailable optimized exports", () => {
  const document = createDocument({
    content: "<svg viewBox=\"0 0 24 24\"><path d=\"M4 4h16v16H4z\" /></svg>",
  });
  const sources = resolveExportSources({
    document,
    optimizationReport: null,
    selectedSymbolKey: null,
  });

  assert.deepEqual(
    sources.map((source) => source.id),
    ["original_svg", "current_svg", "optimized_svg"],
  );
  assert.equal(sources[0]?.available, true);
  assert.equal(sources[1]?.available, true);
  assert.equal(sources[2]?.available, false);
  assert.equal(sources[2]?.warning, "Optimized version not available yet.");
  assert.equal(sources[1]?.filename, "logo-current.svg");
});

test("optimized export becomes available after optimize svg runs", () => {
  const document = createDocument({
    content: "<svg viewBox=\"0 0 24 24\"><path d=\"M4 4h16v16H4z\" /></svg>",
  });
  const sources = resolveExportSources({
    document,
    optimizationReport,
    selectedSymbolKey: null,
  });
  const optimizedSource = sources.find((source) => source.id === "optimized_svg");

  assert.equal(optimizedSource?.available, true);
  assert.equal(optimizedSource?.filename, "logo-optimized.svg");
  assert.equal(optimizedSource?.svgMarkup, document.content);
});

test("sprite documents include selected symbol export state", () => {
  const symbol = createSymbol();
  const document = createDocument({
    filename: "icons.svg",
    originalContent: "<svg><symbol id=\"arrow-left\" viewBox=\"0 0 24 24\"><path d=\"M2 12h20\" /></symbol></svg>",
    content: "<svg><symbol id=\"arrow-left\" viewBox=\"0 0 24 24\"><path d=\"M2 12h20\" /></symbol></svg>",
    symbols: [symbol],
  });

  const withoutSelection = resolveExportSources({
    document,
    optimizationReport: null,
    selectedSymbolKey: null,
    resolveSelectedSymbolExport,
  });
  const unavailableSymbol = withoutSelection.find(
    (source) => source.id === "selected_symbol",
  );

  assert.deepEqual(
    withoutSelection.map((source) => source.id),
    ["original_sprite", "current_sprite", "optimized_sprite", "selected_symbol"],
  );
  assert.equal(unavailableSymbol?.available, false);
  assert.equal(unavailableSymbol?.warning, "Select a symbol to export it.");

  const withSelection = resolveExportSources({
    document,
    optimizationReport: null,
    selectedSymbolKey: symbol.key,
    resolveSelectedSymbolExport,
  });
  const selectedSymbol = withSelection.find(
    (source) => source.id === "selected_symbol",
  );

  assert.equal(selectedSymbol?.available, true);
  assert.equal(selectedSymbol?.filename, "arrow-left.svg");
  assert.match(selectedSymbol?.svgMarkup ?? "", /viewBox="0 0 24 24"/);
});
