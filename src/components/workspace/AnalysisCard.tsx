"use client";

import { Badge } from "@/components/ui/badge";
import { useSvgWorkspace } from "@/hooks/use-svg-workspace";
import { getSeverityTextClass } from "@/analysis/display";
import type { SvgHealthCategory } from "@/analysis";
import { cn } from "@/lib/utils";
import { SeverityIcon } from "./FindingsList";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getFixType, isAutomaticFixFinding } from "@/actions/safe-fixes";

function getFixTypeLabel(fixType: ReturnType<typeof getFixType>): string {
  switch (fixType) {
    case "auto":
      return "Auto";
    case "choice":
      return "Choice";
    case "manual":
      return "Manual";
  }
}

function getFixButtonLabel(fixType: ReturnType<typeof getFixType>): string {
  switch (fixType) {
    case "auto":
      return "Fix";
    case "choice":
      return "Configure";
    case "manual":
      return "Review";
  }
}

function getCategoryLabel(category: SvgHealthCategory): string {
  switch (category) {
    case "structure":
      return "Structure";
    case "performance":
      return "Performance";
    case "colors":
      return "Colors";
    case "accessibility":
      return "Accessibility";
    case "maintainability":
      return "Maintainability";
    case "react-ready":
      return "React Ready";
  }
}

export function AnalysisCard() {
  const {
    document,
    error,
    isProcessing,
    applyCurrentSafeFixes,
    applySafeFixForFinding,
  } = useSvgWorkspace();

  if (!document) {
    return null;
  }

  const { findings, health } = document.analysis;
  const hasFindings = health.findingCount > 0;
  const automaticFixCount = findings.filter(isAutomaticFixFinding).length;
  const gradeTone = hasFindings
    ? "text-amber-300"
    : "text-emerald-300";
  const progressTone = hasFindings
    ? "[&_[data-slot=progress-indicator]]:bg-amber-400 [&_[data-slot=progress-track]]:bg-white/[0.06]"
    : "[&_[data-slot=progress-indicator]]:bg-emerald-400 [&_[data-slot=progress-track]]:bg-white/[0.06]";

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0d0d10] transition-colors duration-150 hover:border-white/[0.14] lg:max-h-[446px]">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-sm font-medium text-zinc-200">SVG Health</p>
      </div>

      <div className="space-y-2.5 border-b border-white/10 px-4 py-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              Grade
            </p>
            <p className={cn("mt-1 text-3xl font-semibold tracking-tight", gradeTone)}>
              {health.grade}
            </p>
          </div>
          <div className="text-right">
            <p className="font-metric text-2xl font-semibold text-zinc-100">
              {health.score}
              <span className="ml-1 text-sm font-normal text-zinc-500">/ 100</span>
            </p>
          </div>
        </div>

        <Progress value={health.score} className={progressTone} />

        <p className="text-sm text-zinc-300">
          {hasFindings ? `${health.findingCount} ${health.findingCount === 1 ? "Issue" : "Issues"} Found` : "No issues detected."}
          <span className="mx-1.5 text-zinc-600">/</span>
          {health.checkCount} {health.checkCount === 1 ? "Health Check" : "Health Checks"}
        </p>

        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            Health Areas
          </p>
          <div className="mt-2 space-y-2">
            {health.categoryScores.map(({ category, score }) => (
              <div key={category} className="grid grid-cols-[minmax(0,1fr)_36px] items-center gap-x-3 gap-y-1">
                <p className="truncate text-xs text-zinc-300">
                  {getCategoryLabel(category)}
                </p>
                <p className="text-right font-metric text-xs text-zinc-400">
                  {score}
                </p>
                <Progress
                  value={score}
                  className="col-span-2 [&_[data-slot=progress-indicator]]:bg-white/60 [&_[data-slot=progress-track]]:bg-white/[0.06]"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                Automatic fixes
              </p>
              <p className="mt-1 text-sm text-zinc-300">
                {automaticFixCount} {automaticFixCount === 1 ? "available" : "available"}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={automaticFixCount === 0 || isProcessing}
              className="border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05]"
              onClick={applyCurrentSafeFixes}
            >
              Apply Safe Fixes
            </Button>
          </div>
          {error ? (
            <p className="mt-2 text-xs text-amber-400">{error}</p>
          ) : null}
        </div>
        {/* TODO: Potential score intentionally hidden for MVP.
            Reintroduce once automatic actions exist so the score can reflect
            only improvements SVG Workspace can currently apply. */}
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-4 py-3">
        <div className="mb-2.5 flex items-center justify-between gap-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            Issues
          </p>
          {hasFindings ? (
            <p className="text-xs text-zinc-600">Scrollable list</p>
          ) : null}
        </div>

        {hasFindings ? (
          <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
            {findings.map((finding) => {
              const fixType = getFixType(finding);
              const isAutoFix = fixType === "auto";

              return (
                <div key={finding.id} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <div className="flex items-start gap-3">
                    <SeverityIcon severity={finding.severity} />
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          getSeverityTextClass(finding.severity),
                        )}
                      >
                        {finding.title}
                      </p>
                      <p className="mt-0.5 text-xs leading-5 text-zinc-500">
                        {finding.description}
                      </p>
                      <Badge
                        variant="outline"
                        className="mt-1.5 border-white/[0.06] bg-transparent px-1.5 py-0 text-[9px] font-normal capitalize text-zinc-600"
                      >
                        {finding.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="mt-1.5 ml-2 border-white/[0.06] bg-transparent px-1.5 py-0 text-[9px] font-normal uppercase text-zinc-600"
                      >
                        {getFixTypeLabel(fixType)}
                      </Badge>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!isAutoFix || isProcessing}
                      className="h-7 shrink-0 border-white/[0.08] bg-white/[0.02] px-2.5 text-[11px] text-zinc-500 opacity-100"
                      onClick={() => {
                        if (isAutoFix) {
                          applySafeFixForFinding(finding);
                        }
                      }}
                    >
                      {getFixButtonLabel(fixType)}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
            <p className="text-sm text-emerald-400">No open issues.</p>
          </div>
        )}
      </div>
    </div>
  );
}
