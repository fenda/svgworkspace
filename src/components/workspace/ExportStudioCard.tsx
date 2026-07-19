"use client";

import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSvgWorkspace } from "@/hooks/use-svg-workspace";
import { resolveExportSources } from "@/export-studio";
import { getStandaloneSpriteSymbol } from "@/lib/svg";
import {
  copySvgWithFeedback,
  downloadSvgWithFeedback,
} from "@/output/perform-svg-export";

export function ExportStudioCard() {
  const {
    document,
    optimizationReport,
    selectedSymbolKey,
  } = useSvgWorkspace();

  if (!document) {
    return null;
  }

  const exportSources = resolveExportSources({
    document,
    optimizationReport,
    selectedSymbolKey,
    resolveSelectedSymbolExport: getStandaloneSpriteSymbol,
  });

  return (
    <div className="rounded-xl border border-white/10 bg-[#0d0d10] transition-colors duration-150 hover:border-white/[0.14]">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-sm font-medium text-zinc-200">Export Studio</p>
        <p className="mt-1 text-xs text-zinc-500">
          Export sources adapt to the current document state and reuse the existing copy/download pipeline.
        </p>
      </div>

      <div className="grid gap-3 px-4 py-4 lg:grid-cols-2 xl:grid-cols-3">
        {exportSources.map((source) => (
          <section
            key={source.id}
            aria-label={source.title}
            className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-3"
          >
            <div className="min-h-16">
              <p className="text-[10px] uppercase tracking-wider text-zinc-400">
                {source.title}
              </p>
              <p className="mt-2 text-sm text-zinc-300">
                {source.description}
              </p>
              {source.warning ? (
                <p
                  className={`mt-2 text-xs leading-5 ${
                    source.available ? "text-amber-300" : "text-zinc-500"
                  }`}
                >
                  {source.warning}
                </p>
              ) : null}
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!source.available || !source.svgMarkup}
                aria-label={`${source.copyLabel} ${source.title}`}
                className="justify-start border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05] disabled:text-zinc-600"
                onClick={() => {
                  if (!source.svgMarkup) {
                    return;
                  }

                  void copySvgWithFeedback({
                    svgMarkup: source.svgMarkup,
                    successMessage: source.copySuccessMessage,
                    warnings: source.warnings,
                  });
                }}
              >
                <Copy className="size-3.5" />
                {source.copyLabel}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!source.available || !source.svgMarkup}
                aria-label={`${source.downloadLabel} ${source.title}`}
                className="justify-start border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05] disabled:text-zinc-600"
                onClick={() => {
                  if (!source.svgMarkup) {
                    return;
                  }

                  downloadSvgWithFeedback({
                    svgMarkup: source.svgMarkup,
                    filename: source.filename,
                    successMessage: source.downloadSuccessMessage,
                    warnings: source.warnings,
                  });
                }}
              >
                <Download className="size-3.5" />
                {source.downloadLabel}
              </Button>
            </div>

            {source.filename ? (
              <p className="mt-3 truncate text-xs text-zinc-500">
                {source.filename}
              </p>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}
