import { assertBrowser } from "@/lib/browser/assert-browser";

function getDownloadFilename(filename?: string): string {
  const trimmed = filename?.trim();

  if (!trimmed) {
    return "optimized.svg";
  }

  return trimmed.toLowerCase().endsWith(".svg") ? trimmed : `${trimmed}.svg`;
}

export function downloadSvg(content: string, filename?: string): void {
  assertBrowser();

  const blob = new Blob([content], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = getDownloadFilename(filename);
  anchor.click();

  URL.revokeObjectURL(url);
}
