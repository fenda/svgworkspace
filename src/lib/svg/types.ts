import type { AnalysisResult } from "@/analysis";
import type { SvgGeometryInfo } from "@/lib/svg/geometry";

export type SvgType = "icon" | "logo" | "sprite_sheet";

export type SvgSymbolElementCounts = {
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
};

export type SvgSpriteDefinition = {
  id: string;
  kind: string;
  markup: string;
  references: string[];
  hasStyleUsage: boolean;
};

export type SvgSpriteResources = {
  namespaceAttributes: string;
  styleBlocks: string[];
  definitions: SvgSpriteDefinition[];
};

export type SvgSymbolPreview = {
  key: string;
  index: number;
  id: string | null;
  title: string | null;
  desc: string | null;
  viewBox: string | null;
  width: string | null;
  height: string | null;
  estimatedDimensions: string | null;
  childMarkup: string;
  previewMarkup: string | null;
  previewUnavailableReason: string | null;
  elementCounts: SvgSymbolElementCounts;
  referencedDefinitionIds: string[];
  unresolvedReferenceIds: string[];
  hasSharedDefinitionReferences: boolean;
  hasStyleUsage: boolean;
  hasSharedStyleUsage: boolean;
  usesGradients: boolean;
  usesClipPaths: boolean;
  usesMasks: boolean;
  usesFilters: boolean;
  usesMarkers: boolean;
};

export type SvgMetadata = {
  filename: string;
  viewBox: string;
  size: string;
  byteLength: number;
  paths: number;
  colors: number;
  scalable: string;
  scalableExplanation: string;
};

export type OptimizationStepStatus =
  | "changed"
  | "unchanged"
  | "skipped"
  | "failed";

export type OptimizationChange = {
  type: string;
  label: string;
  count?: number;
};

export type OptimizationStep = {
  id: string;
  label: string;
  description?: string;
  status: OptimizationStepStatus;
  beforeSizeBytes: number;
  afterSizeBytes: number;
  savedBytes: number;
  savedPercentage: number;
  changes?: OptimizationChange[];
  warning?: string;
};

export type OptimizationReport = {
  originalSizeBytes: number;
  optimizedSizeBytes: number;
  savedBytes: number;
  savedPercentage: number;
  startedAt?: string;
  completedAt?: string;
  steps: OptimizationStep[];
  appliedCount: number;
  appliedLabels: string[];
  changedStepCount: number;
  unchangedStepCount: number;
  skippedStepCount: number;
  failedStepCount: number;
};

export type SvgDocument = {
  filename: string;
  originalContent: string;
  content: string;
  symbols: SvgSymbolPreview[];
  spriteResources: SvgSpriteResources | null;
  originalGeometry: SvgGeometryInfo;
  geometry: SvgGeometryInfo;
  originalMetadata: SvgMetadata;
  metadata: SvgMetadata;
  analysis: AnalysisResult;
};

export type SvgLoadSource = "upload" | "paste" | "example";
