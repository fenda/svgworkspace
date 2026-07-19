import { trackAnalyticsEvent } from "@/lib/analytics";
import { downloadSvg } from "@/output/download-svg";
import { copySvg } from "@/output/copy-svg";
import { showSuccessToast, showWarningToast } from "@/stores/toast-store";

type PerformSvgExportOptions = {
  svgMarkup: string;
  filename?: string | null;
  successMessage: string;
  warnings?: string[];
};

function showExportWarnings(warnings: string[] | undefined): void {
  if (!warnings?.length) {
    return;
  }

  showWarningToast(
    "Export warning",
    warnings[0] ?? "Some dependencies could not be included.",
  );
}

export async function copySvgWithFeedback(
  options: PerformSvgExportOptions,
): Promise<void> {
  await copySvg(options.svgMarkup);
  showSuccessToast(options.successMessage);
  trackAnalyticsEvent("copy_clicked");
  showExportWarnings(options.warnings);
}

export function downloadSvgWithFeedback(
  options: PerformSvgExportOptions,
): void {
  downloadSvg(options.svgMarkup, options.filename ?? undefined);
  showSuccessToast(options.successMessage);
  trackAnalyticsEvent("download_clicked");
  showExportWarnings(options.warnings);
}
