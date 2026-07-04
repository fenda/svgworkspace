import { assertBrowser } from "@/lib/browser/assert-browser";

export async function copySvg(content: string): Promise<void> {
  assertBrowser();
  await navigator.clipboard.writeText(content);
}
