import type {
  OptimizationReport,
  SvgDocument,
  SvgSpriteResources,
  SvgSymbolPreview,
} from "@/lib/svg";

export type ExportSourceId =
  | "original_svg"
  | "current_svg"
  | "optimized_svg"
  | "original_sprite"
  | "current_sprite"
  | "optimized_sprite"
  | "selected_symbol";

export type ExportSourceDefinition = {
  id: ExportSourceId;
  title: string;
  description: string;
  isVisible: (context: ExportStudioContext) => boolean;
  resolve: (context: ExportStudioContext) => ResolvedExportSource;
};

export type ExportStudioContext = {
  document: SvgDocument;
  optimizationReport: OptimizationReport | null;
  selectedSymbolKey: string | null;
  resolveSelectedSymbolExport?: (
    symbol: SvgSymbolPreview,
    resources: SvgSpriteResources | null,
  ) => {
    markup: string | null;
    warnings: string[];
    filename: string;
  };
};

export type ResolvedExportSource = {
  id: ExportSourceId;
  title: string;
  description: string;
  available: boolean;
  svgMarkup: string | null;
  filename: string | null;
  warning: string | null;
  warnings: string[];
  copyLabel: string;
  downloadLabel: string;
  copySuccessMessage: string;
  downloadSuccessMessage: string;
};
