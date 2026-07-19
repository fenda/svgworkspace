import { analyzeSvg } from "@/analysis";
import { extractSvgMetadata } from "@/lib/svg/metadata";
import { parseSvgMarkup } from "@/lib/svg/parse";
import { collectSvgSymbols } from "@/lib/svg/sprites";
import type { SvgDocument } from "@/lib/svg/types";
import { createValidationError } from "@/lib/svg/validation";

const DRAWABLE_SELECTORS = [
  "path",
  "circle",
  "rect",
  "ellipse",
  "polygon",
  "polyline",
  "line",
  "text",
  "image",
  "use",
].join(",");

export function hasDrawableContent(svg: SVGSVGElement): boolean {
  return svg.querySelector(DRAWABLE_SELECTORS) !== null;
}

export async function readSvgFile(file: File): Promise<{ filename: string; content: string }> {
  const isSvg =
    file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg");

  if (!isSvg) {
    throw createValidationError("unsupported_file");
  }

  return {
    filename: file.name,
    content: await file.text(),
  };
}

export function createSvgDocument(
  filename: string,
  content: string,
  originalContent = content,
): SvgDocument {
  const svg = parseSvgMarkup(content.trim());
  const originalSvg = parseSvgMarkup(originalContent.trim());

  if (!hasDrawableContent(svg)) {
    throw createValidationError("empty_svg");
  }

  return {
    filename,
    originalContent,
    content,
    symbols: collectSvgSymbols(svg),
    originalMetadata: extractSvgMetadata(originalSvg, originalContent, filename),
    metadata: extractSvgMetadata(svg, content, filename),
    analysis: analyzeSvg(svg),
  };
}

export function loadSvgFromString(
  content: string,
  filename = "pasted.svg",
): SvgDocument {
  return createSvgDocument(filename, content);
}

export function loadSvgFromFile(file: File): Promise<SvgDocument> {
  return readSvgFile(file).then(({ filename, content }) =>
    createSvgDocument(filename, content),
  );
}

export type { SvgLoadSource } from "@/lib/svg/types";
