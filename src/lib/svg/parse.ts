import { assertBrowser } from "@/lib/browser/assert-browser";

export function parseSvgMarkup(content: string): SVGSVGElement {
  assertBrowser();

  const doc = new DOMParser().parseFromString(content, "image/svg+xml");
  const parserError = doc.querySelector("parsererror");

  if (parserError) {
    throw new Error("Invalid SVG markup.");
  }

  const root = doc.documentElement;

  if (root.tagName.toLowerCase() !== "svg") {
    throw new Error("Root element must be an <svg> tag.");
  }

  return root as unknown as SVGSVGElement;
}

export function serializeSvg(svg: SVGSVGElement): string {
  assertBrowser();
  return new XMLSerializer().serializeToString(svg);
}
