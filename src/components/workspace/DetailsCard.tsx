"use client";

import { Button } from "@/components/ui/button";
import { useSvgWorkspace } from "@/hooks/use-svg-workspace";
import { formatBytes } from "@/lib/svg";

function formatStaticValue(value: string | number) {
  return (
    <p className="font-metric mt-1 text-sm font-medium text-zinc-300">
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

export function DetailsCard() {
  const { document, optimizationReport, resetToOriginal, isProcessing } =
    useSvgWorkspace();

  if (!document) {
    return null;
  }

  const { metadata, originalMetadata } = document;
  const hasChanges = document.content !== document.originalContent;
  const metricItems = [
    {
      label: "ViewBox",
      content: formatStaticValue(metadata.viewBox),
    },
    {
      label: "Size",
      content: optimizationReport
        ? formatComparisonValue(metadata.size, originalMetadata.size)
        : formatStaticValue(metadata.size),
    },
    {
      label: "Saved",
      content: formatStaticValue(
        optimizationReport
          ? formatSavedValue(
              optimizationReport.bytesSaved,
              optimizationReport.percentSaved,
            )
          : "0 B",
      ),
    },
    {
      label: "Paths",
      content: formatStaticValue(metadata.paths),
    },
    {
      label: "Colors",
      content: formatStaticValue(metadata.colors),
    },
    {
      label: "Scalable",
      content: formatStaticValue(metadata.scalable),
    },
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-[#0d0d10] transition-colors duration-150 hover:border-white/[0.14]">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-sm font-medium text-zinc-200">SVG Details</p>
      </div>

      <div className="grid gap-4 px-4 py-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(260px,0.95fr)]">
        <div className="grid grid-cols-3 gap-3">
          {metricItems.map((item) => (
            <div
              key={item.label}
              className="min-w-0 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-3"
            >
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                {item.label}
              </p>
              {item.content}
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">
              Applied Optimizations
            </p>
            <div className="flex items-center gap-2">
              {optimizationReport?.appliedCount ? (
                <p className="text-xs text-zinc-400">
                  {optimizationReport.appliedCount} applied
                </p>
              ) : null}
              {hasChanges ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isProcessing}
                  className="h-7 border-white/[0.08] bg-white/[0.02] px-2.5 text-[11px] text-zinc-300"
                  onClick={resetToOriginal}
                >
                  Reset to original
                </Button>
              ) : null}
            </div>
          </div>

          {optimizationReport?.appliedLabels.length ? (
            <ul className="mt-3 max-h-40 space-y-1.5 overflow-y-auto pr-1">
              {optimizationReport.appliedLabels.map((label) => (
                <li key={label} className="text-sm text-zinc-300">
                  - {label}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-zinc-400">
              No optimizations applied yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
