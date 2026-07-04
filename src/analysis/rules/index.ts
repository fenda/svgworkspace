import { performance001MetadataFound } from "./performance/performance-001-metadata-found";
import { performance002CommentsFound } from "./performance/performance-002-comments-found";
import { structure001MissingViewBox } from "./structure/structure-001-missing-viewbox";
import { structure002FixedWidthHeight } from "./structure/structure-002-fixed-width-height";
import type { AnalysisRule } from "@/analysis/models";

export const analysisRules: AnalysisRule[] = [
  structure001MissingViewBox,
  structure002FixedWidthHeight,
  performance001MetadataFound,
  performance002CommentsFound,
];
