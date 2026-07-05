"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useSvgWorkspace } from "@/hooks/use-svg-workspace";
import { formatBytes } from "@/lib/svg";

function formatStaticValue(value: string | number) {
  return (
    <p className="font-metric text-sm font-medium text-zinc-300">
      {value}
    </p>
  );
}

function formatComparisonValue(current: string | number, original: string | number) {
  if (current === original) {
    return formatStaticValue(current);
  }

  return (
    <p className="font-metric mt-1 text-sm font-medium text-zinc-300">
      <span className="text-zinc-500">{original}</span>
      <span className="mx-1.5 text-zinc-600">→</span>
      <span>{current}</span>
    </p>
  );
}

function formatSavedValue(bytesSaved: number, percentSaved: number): string {
  if (bytesSaved <= 0) {
    return "0 B";
  }

  return `${formatBytes(bytesSaved)} (${percentSaved}%)`;
}

function formatValuePair(label: string, value: ReactNode) {
  return (
    <div
      key={label}
      className="grid gap-1 border-b border-white/[0.06] py-2.5 last:border-b-0 last:pb-0 first:pt-0 sm:grid-cols-[88px_minmax(0,1fr)] sm:items-start sm:gap-3"
    >
      <p className="text-[10px] uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <div className="min-w-0">{value}</div>
    </div>
  );
}

function formatTypeValue(
  value: string,
  confidence: string,
  explanation: string,
) {
  return (
    <div title={explanation}>
      <p className="font-metric text-sm font-medium text-zinc-300">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-zinc-500">
        <span className="capitalize">{confidence}</span>
        {" confidence"}
      </p>
    </div>
  );
}

export function DetailsCard() {
  const { document, optimizationReport, resetToOriginal, isProcessing } =
    useSvgWorkspace();

  if (!document) {
    return null;
  }

  const { metadata } = document;
  const hasChanges = document.content !== document.originalContent;
  const report = optimizationReport;
  const showKnownActionsSummary =
    hasChanges && Boolean(report?.appliedLabels.length);
  const showFallbackSummary = hasChanges && !showKnownActionsSummary;
  const summaryLabelClass = "text-[10px] uppercase tracking-wider text-zinc-400";
  const informationItems = [
    formatValuePair(
      "Type",
      formatTypeValue(
        metadata.type,
        metadata.typeConfidence,
        metadata.typeExplanation,
      ),
    ),
    formatValuePair("ViewBox", formatStaticValue(metadata.viewBox)),
    formatValuePair("Paths", formatStaticValue(metadata.paths)),
    formatValuePair("Colors", formatStaticValue(metadata.colors)),
    formatValuePair("Scalable", formatStaticValue(metadata.scalable)),
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-[#0d0d10] transition-colors duration-150 hover:border-white/[0.14]">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-sm font-medium text-zinc-200">Inspector</p>
      </div>

      <div className="grid gap-4 px-4 py-4 lg:grid-cols-3">
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-3">
          <p className={summaryLabelClass}>
            SVG Information
          </p>
          <div className="mt-3">
            {informationItems}
          </div>
        </div>

        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className={summaryLabelClass}>
              Optimization Summary
            </p>
          </div>

          {showKnownActionsSummary && report ? (
            <div className="mt-3 space-y-3">
              <div className="grid gap-2">
                <div className="rounded-md border border-white/[0.06] bg-black/10 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                    Applied
                  </p>
                  {formatStaticValue(`${report.appliedCount}`)}
                </div>
                <div className="rounded-md border border-white/[0.06] bg-black/10 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                    Size
                  </p>
                  {formatComparisonValue(
                    formatBytes(report.sizeAfter),
                    formatBytes(report.sizeBefore),
                  )}
                </div>
                <div className="rounded-md border border-white/[0.06] bg-black/10 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                    Saved
                  </p>
                  {formatStaticValue(
                    formatSavedValue(
                      report.bytesSaved,
                      report.percentSaved,
                    ),
                  )}
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isProcessing}
                className="h-7 w-fit border-white/[0.08] bg-white/[0.02] px-2.5 text-[11px] text-zinc-300"
                onClick={resetToOriginal}
              >
                Reset to original
              </Button>
            </div>
          ) : showFallbackSummary ? (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-zinc-300">
                Current output differs from the original SVG.
              </p>
              <p className="text-xs leading-5 text-zinc-500">
                Reset to original to restore the uploaded SVG exactly as it was.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isProcessing}
                className="h-7 w-fit border-white/[0.08] bg-white/[0.02] px-2.5 text-[11px] text-zinc-300"
                onClick={resetToOriginal}
              >
                Reset to original
              </Button>
            </div>
          ) : (
            <p className="mt-3 text-sm text-zinc-400">
              No optimizations applied yet.
            </p>
          )}
        </div>

        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-3">
          <p className={summaryLabelClass}>Applied</p>

          {showKnownActionsSummary && report ? (
            <div className="mt-3 max-h-48 overflow-y-auto pr-1">
              <ul className="grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {report.appliedLabels.map((label, index) => (
                  <li
                    key={`${label}-${index}`}
                    className="text-sm leading-5 text-zinc-300"
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          ) : showFallbackSummary ? (
            <p className="mt-3 text-sm text-zinc-400">
              No actions recorded.
            </p>
          ) : (
            <p className="mt-3 text-sm text-zinc-400">
              No actions applied yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
