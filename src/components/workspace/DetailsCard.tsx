"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useSvgWorkspace } from "@/hooks/use-svg-workspace";
import { formatBytes, formatPercentage } from "@/lib/svg";
import type {
  OptimizationChange,
  OptimizationReport,
  OptimizationStep,
  SvgType,
} from "@/lib/svg/types";

const TYPE_OPTIONS: Array<{ value: null | SvgType; label: string }> = [
  { value: null, label: "Not specified" },
  { value: "icon", label: "Icon" },
  { value: "logo", label: "Logo" },
  { value: "sprite_sheet", label: "Sprite Sheet" },
];

function getTypeLabel(type: SvgType): string {
  switch (type) {
    case "icon":
      return "Icon";
    case "logo":
      return "Logo";
    case "sprite_sheet":
      return "Sprite Sheet";
  }
}

function formatStaticValue(value: string | number) {
  return (
    <p className="font-metric text-sm font-medium text-zinc-300">
      {value}
    </p>
  );
}

function formatSavedValue(bytesSaved: number, percentSaved: number): string {
  if (bytesSaved <= 0) {
    return "0 B";
  }

  return `${formatBytes(bytesSaved)} (${formatPercentage(percentSaved)})`;
}

function formatDeltaText(bytes: number): string {
  if (bytes > 0) {
    return `${formatBytes(bytes)} smaller`;
  }

  if (bytes < 0) {
    return `${formatBytes(Math.abs(bytes))} larger`;
  }

  return "size unchanged";
}

function formatStepValue(step: OptimizationStep): string {
  return `${formatBytes(step.afterSizeBytes)} · ${formatDeltaText(step.savedBytes)}`;
}

function formatFinalSummary(report: OptimizationReport): string {
  if (report.savedBytes > 0) {
    return `${formatBytes(report.savedBytes)} smaller · ${formatPercentage(report.savedPercentage)}`;
  }

  if (report.savedBytes < 0) {
    return `${formatBytes(Math.abs(report.savedBytes))} larger`;
  }

  return "Optimized size is unchanged.";
}

function formatChangeSummary(change: OptimizationChange): string {
  if (typeof change.count === "number") {
    return `${change.count} ${change.label.toLowerCase()}`;
  }

  return change.label;
}

function getSecondaryStepCountLabel(report: OptimizationReport): string | null {
  const count = report.unchangedStepCount + report.skippedStepCount + report.failedStepCount;

  if (count === 0) {
    return null;
  }

  if (report.failedStepCount > 0) {
    return `${count} additional ${count === 1 ? "step" : "steps"} were unchanged, skipped, or failed`;
  }

  return `${count} additional ${count === 1 ? "step" : "steps"} were unchanged or skipped`;
}

function getStepStatusText(step: OptimizationStep): string {
  switch (step.status) {
    case "changed":
      return "Changed";
    case "unchanged":
      return "No changes needed";
    case "skipped":
      return "Skipped";
    case "failed":
      return "Failed";
  }
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
  isSpecified: boolean,
  onSelectType: (type: SvgType | null) => void,
) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-metric text-sm font-medium text-zinc-300">
            {value}
          </p>
          <p className="mt-0.5 text-xs text-zinc-500">
            {isSpecified ? "Optional user context" : "Not specified"}
          </p>
        </div>
        <details className="group relative shrink-0">
          <summary className="list-none rounded-md border border-white/[0.08] bg-white/[0.02] px-2 py-1 text-[11px] text-zinc-300 transition hover:bg-white/[0.05] [&::-webkit-details-marker]:hidden">
            {isSpecified ? "Change" : "Set type"}
          </summary>
          <div className="absolute right-0 z-10 mt-2 min-w-40 rounded-lg border border-white/[0.08] bg-[#121216] p-1.5 shadow-[0_16px_36px_rgba(0,0,0,0.35)]">
            {TYPE_OPTIONS.map((option) => (
              <button
                key={option.label}
                type="button"
                className="flex w-full rounded-md px-2 py-1.5 text-left text-xs text-zinc-300 transition hover:bg-white/[0.05]"
                onClick={(event) => {
                  onSelectType(option.value);
                  const details = event.currentTarget.closest("details");

                  if (details instanceof HTMLDetailsElement) {
                    details.open = false;
                  }
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
}

export function DetailsCard() {
  const {
    document,
    optimizationReport,
    resetToOriginal,
    isProcessing,
    svgType,
    setSvgType,
    insights,
  } =
    useSvgWorkspace();

  if (!document) {
    return null;
  }

  const { metadata } = document;
  const hasChanges = document.content !== document.originalContent;
  const report = optimizationReport;
  const hasTimelineReport = Boolean(report);
  const showFallbackSummary = hasChanges && !hasTimelineReport;
  const summaryLabelClass = "text-[10px] uppercase tracking-wider text-zinc-400";
  const changedSteps = report?.steps.filter((step) => step.status === "changed") ?? [];
  const secondarySteps = report?.steps.filter((step) => step.status !== "changed") ?? [];
  const secondaryStepCountLabel = report ? getSecondaryStepCountLabel(report) : null;
  const informationItems = [
    formatValuePair(
      "Type",
      formatTypeValue(
        svgType ? getTypeLabel(svgType) : "Not specified",
        Boolean(svgType),
        setSvgType,
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
          <div className="mt-4 border-t border-white/[0.06] pt-3">
            <p className={summaryLabelClass}>Insights</p>
            <div className="mt-3 space-y-2">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className="rounded-md border border-white/[0.06] bg-black/10 px-3 py-2.5"
                >
                  <p className="text-sm font-medium text-zinc-200">
                    {insight.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-zinc-400">
                    {insight.explanation}
                  </p>
                  {insight.suggestedAction ? (
                    <p className="mt-1.5 text-[11px] text-zinc-500">
                      Suggested: {insight.suggestedAction}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className={summaryLabelClass}>
              Optimization Summary
            </p>
          </div>

          {report ? (
            <div className="mt-3 space-y-3">
              <div className="grid gap-2">
                <div className="rounded-md border border-white/[0.06] bg-black/10 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                    Original
                  </p>
                  {formatStaticValue(formatBytes(report.originalSizeBytes))}
                </div>
                <div className="rounded-md border border-white/[0.06] bg-black/10 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                    Optimized
                  </p>
                  {formatStaticValue(formatBytes(report.optimizedSizeBytes))}
                </div>
                <div className="rounded-md border border-white/[0.06] bg-black/10 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                    Saved
                  </p>
                  {formatStaticValue(
                    formatSavedValue(
                      report.savedBytes,
                      report.savedPercentage,
                    ),
                  )}
                </div>
                <div className="rounded-md border border-white/[0.06] bg-black/10 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                    Changed steps
                  </p>
                  {formatStaticValue(`${report.changedStepCount}`)}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-zinc-300">
                  {formatFinalSummary(report)}
                </p>
                {secondaryStepCountLabel ? (
                  <p className="text-xs leading-5 text-zinc-500">
                    {secondaryStepCountLabel}
                  </p>
                ) : null}
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
          <p className={summaryLabelClass}>Optimization Timeline</p>

          {report ? (
            <div className="mt-3 space-y-3">
              <ol className="space-y-3">
                <li className="rounded-md border border-white/[0.06] bg-black/10 px-3 py-2.5">
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Original
                  </p>
                  <p className="mt-1 font-metric text-sm font-medium text-zinc-200">
                    {formatBytes(report.originalSizeBytes)}
                  </p>
                </li>

                {changedSteps.map((step) => (
                  <li
                    key={step.id}
                    className="rounded-md border border-white/[0.06] bg-black/10 px-3 py-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-200">
                          {step.label}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {getStepStatusText(step)}
                        </p>
                      </div>
                      <p className="font-metric shrink-0 text-xs text-zinc-400">
                        {formatStepValue(step)}
                      </p>
                    </div>
                    {step.changes && step.changes.length > 0 ? (
                      <div className="mt-2 space-y-1">
                        {step.changes.map((change, index) => (
                          <p
                            key={`${step.id}-${change.type}-${index}`}
                            className="text-xs leading-5 text-zinc-400"
                          >
                            {formatChangeSummary(change)}
                          </p>
                        ))}
                      </div>
                    ) : step.description ? (
                      <p className="mt-2 text-xs leading-5 text-zinc-400">
                        {step.description}
                      </p>
                    ) : null}
                  </li>
                ))}

                <li className="rounded-md border border-white/[0.06] bg-black/10 px-3 py-2.5">
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Optimized
                  </p>
                  <p className="mt-1 font-metric text-sm font-medium text-zinc-200">
                    {formatBytes(report.optimizedSizeBytes)}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-zinc-400">
                    {formatFinalSummary(report)}
                  </p>
                </li>
              </ol>

              {secondarySteps.length > 0 ? (
                <details className="rounded-md border border-white/[0.06] bg-black/10 px-3 py-2.5">
                  <summary className="cursor-pointer list-none text-xs text-zinc-400 [&::-webkit-details-marker]:hidden">
                    {secondaryStepCountLabel}
                  </summary>
                  <div className="mt-2 space-y-2">
                    {secondarySteps.map((step) => (
                      <div key={`${step.id}-${step.status}`} className="text-xs text-zinc-400">
                        <p className="font-medium text-zinc-300">
                          {step.label}
                        </p>
                        <p className="mt-0.5">
                          {getStepStatusText(step)}
                        </p>
                      </div>
                    ))}
                  </div>
                </details>
              ) : null}
            </div>
          ) : showFallbackSummary ? (
            <p className="mt-3 text-sm text-zinc-400">
              No optimization timeline is available for the current output.
            </p>
          ) : (
            <p className="mt-3 text-sm text-zinc-400">
              No optimization timeline yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
