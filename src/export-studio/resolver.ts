import type { OptimizationReport, SvgDocument } from "../lib/svg/types.ts";
import { buildExportFilename } from "./filename";
import type {
  ExportSourceDefinition,
  ExportStudioContext,
  ResolvedExportSource,
} from "./types";

function isSpriteDocument(document: SvgDocument): boolean {
  return document.symbols.length > 0;
}

function getHasChanges(document: SvgDocument): boolean {
  return document.content !== document.originalContent;
}

function getSelectedSymbolExport(context: ExportStudioContext) {
  const selectedSymbol = context.document.symbols.find(
    (symbol) => symbol.key === context.selectedSymbolKey,
  );

  if (!selectedSymbol || !context.resolveSelectedSymbolExport) {
    return null;
  }

  return context.resolveSelectedSymbolExport(
    selectedSymbol,
    context.document.spriteResources,
  );
}

function createSource(
  source: Omit<ResolvedExportSource, "copyLabel" | "downloadLabel">,
): ResolvedExportSource {
  return {
    copyLabel: "Copy",
    downloadLabel: "Download",
    ...source,
  };
}

function createOriginalSource(context: ExportStudioContext): ResolvedExportSource {
  const spriteDocument = isSpriteDocument(context.document);

  return createSource({
    id: spriteDocument ? "original_sprite" : "original_svg",
    title: spriteDocument ? "Original Sprite" : "Original SVG",
    description: spriteDocument
      ? "The uploaded sprite document before optimization or transformations."
      : "The uploaded SVG exactly as it was loaded into the workspace.",
    available: true,
    svgMarkup: context.document.originalContent,
    filename: buildExportFilename(context.document.filename),
    warning: null,
    warnings: [],
    copySuccessMessage: spriteDocument
      ? "Copied original sprite"
      : "Copied original SVG",
    downloadSuccessMessage: spriteDocument
      ? "Downloaded original sprite"
      : "Downloaded original SVG",
  });
}

function createCurrentSource(context: ExportStudioContext): ResolvedExportSource {
  const spriteDocument = isSpriteDocument(context.document);
  const hasChanges = getHasChanges(context.document);

  return createSource({
    id: spriteDocument ? "current_sprite" : "current_svg",
    title: spriteDocument ? "Current Sprite" : "Current SVG",
    description: spriteDocument
      ? "The current working sprite after any optimizations or transformations."
      : "The current working SVG after any optimizations or transformations.",
    available: true,
    svgMarkup: context.document.content,
    filename: buildExportFilename(context.document.filename, "current"),
    warning: hasChanges
      ? null
      : "Current document has not changed from original.",
    warnings: [],
    copySuccessMessage: spriteDocument
      ? "Copied current sprite"
      : "Copied current SVG",
    downloadSuccessMessage: spriteDocument
      ? "Downloaded current sprite"
      : "Downloaded current SVG",
  });
}

function createOptimizedSource(
  context: ExportStudioContext,
): ResolvedExportSource {
  const spriteDocument = isSpriteDocument(context.document);
  const report: OptimizationReport | null = context.optimizationReport;
  const available = Boolean(report);

  return createSource({
    id: spriteDocument ? "optimized_sprite" : "optimized_svg",
    title: spriteDocument ? "Optimized Sprite" : "Optimized SVG",
    description: spriteDocument
      ? "The most recent Optimize SVG result for the current sprite document."
      : "The most recent Optimize SVG result for the current document.",
    available,
    svgMarkup: available ? context.document.content : null,
    filename: available
      ? buildExportFilename(context.document.filename, "optimized")
      : null,
    warning: available ? null : "Optimized version not available yet.",
    warnings: [],
    copySuccessMessage: spriteDocument
      ? "Copied optimized sprite"
      : "Copied optimized SVG",
    downloadSuccessMessage: spriteDocument
      ? "Downloaded optimized sprite"
      : "Downloaded optimized SVG",
  });
}

function createSelectedSymbolSource(
  context: ExportStudioContext,
): ResolvedExportSource {
  const selectedSymbolExport = getSelectedSymbolExport(context);

  if (!context.selectedSymbolKey) {
    return createSource({
      id: "selected_symbol",
      title: "Selected Symbol",
      description: "The currently selected symbol exported as a standalone SVG.",
      available: false,
      svgMarkup: null,
      filename: null,
      warning: "Select a symbol to export it.",
      warnings: [],
      copySuccessMessage: "Copied symbol",
      downloadSuccessMessage: "Downloaded symbol",
    });
  }

  return createSource({
    id: "selected_symbol",
    title: "Selected Symbol",
    description: "The currently selected symbol exported as a standalone SVG.",
    available: Boolean(selectedSymbolExport?.markup),
    svgMarkup: selectedSymbolExport?.markup ?? null,
    filename: selectedSymbolExport?.filename ?? null,
    warning:
      selectedSymbolExport?.warnings[0] ??
      (selectedSymbolExport?.markup
        ? null
        : "This symbol is not ready for standalone export."),
    warnings: selectedSymbolExport?.warnings ?? [],
    copySuccessMessage: "Copied symbol",
    downloadSuccessMessage: "Downloaded symbol",
  });
}

const exportSourceRegistry: ExportSourceDefinition[] = [
  {
    id: "original_svg",
    title: "Original SVG",
    description: "",
    isVisible: (context) => !isSpriteDocument(context.document),
    resolve: createOriginalSource,
  },
  {
    id: "current_svg",
    title: "Current SVG",
    description: "",
    isVisible: (context) => !isSpriteDocument(context.document),
    resolve: createCurrentSource,
  },
  {
    id: "optimized_svg",
    title: "Optimized SVG",
    description: "",
    isVisible: (context) => !isSpriteDocument(context.document),
    resolve: createOptimizedSource,
  },
  {
    id: "original_sprite",
    title: "Original Sprite",
    description: "",
    isVisible: (context) => isSpriteDocument(context.document),
    resolve: createOriginalSource,
  },
  {
    id: "current_sprite",
    title: "Current Sprite",
    description: "",
    isVisible: (context) => isSpriteDocument(context.document),
    resolve: createCurrentSource,
  },
  {
    id: "optimized_sprite",
    title: "Optimized Sprite",
    description: "",
    isVisible: (context) => isSpriteDocument(context.document),
    resolve: createOptimizedSource,
  },
  {
    id: "selected_symbol",
    title: "Selected Symbol",
    description: "",
    isVisible: (context) => isSpriteDocument(context.document),
    resolve: createSelectedSymbolSource,
  },
];

export function resolveExportSources(
  context: ExportStudioContext,
): ResolvedExportSource[] {
  return exportSourceRegistry
    .filter((source) => source.isVisible(context))
    .map((source) => source.resolve(context));
}
