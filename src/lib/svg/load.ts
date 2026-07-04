import { analyzeSvgElement } from "@/lib/svg/analyze";
import { parseSvgMarkup } from "@/lib/svg/parse";
import type { SvgDocument, SvgLoadSource } from "@/lib/svg/types";

export async function readSvgFile(file: File): Promise<{ filename: string; content: string }> {
  const isSvg =
    file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg");

  if (!isSvg) {
    throw new Error("Please choose an SVG file.");
  }

  return {
    filename: file.name,
    content: await file.text(),
  };
}

export function createSvgDocument(filename: string, content: string): SvgDocument {
  const svg = parseSvgMarkup(content.trim());
  const { metadata, analysis } = analyzeSvgElement(svg, content, filename);

  return {
    filename,
    content,
    metadata,
    analysis,
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

export type { SvgLoadSource };
