"use client";

import { Badge } from "@/components/ui/badge";
import { useSvgWorkspace } from "@/hooks/use-svg-workspace";
import { getSeverityTextClass } from "@/analysis/display";
import { cn } from "@/lib/utils";
import { SeverityIcon } from "./FindingsList";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function AnalysisCard() {
  const { document } = useSvgWorkspace();

  if (!document) {
    return null;
  }

  const { findings, health } = document.analysis;
  const hasFindings = health.findingCount > 0;
  const gradeTone = hasFindings
    ? "text-amber-300"
    : "text-emerald-300";
  const progressTone = hasFindings
    ? "[&_[data-slot=progress-indicator]]:bg-amber-400 [&_[data-slot=progress-track]]:bg-white/[0.06]"
    : "[&_[data-slot=progress-indicator]]:bg-emerald-400 [&_[data-slot=progress-track]]:bg-white/[0.06]";

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0d0d10] transition-colors duration-150 hover:border-white/[0.14]">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-sm font-medium text-zinc-200">SVG Health</p>
      </div>

      <div className="space-y-4 border-b border-white/10 px-4 py-4">
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
            <p className="mt-1 text-xs text-zinc-500">Based on current MVP checks</p>
          </div>
        </div>

        <Progress value={health.score} className={progressTone} />

        <div className="flex flex-wrap items-start justify-between gap-3 text-sm">
          <div>
            <p className="text-zinc-300">
              {hasFindings
                ? `${health.findingCount} ${health.findingCount === 1 ? "Issue" : "Issues"} Found`
                : "No issues detected."}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {health.checkCount} {health.checkCount === 1 ? "Health Check" : "Health Checks"}
            </p>
          </div>
        </div>
        {/* TODO: Potential score intentionally hidden for MVP.
            Reintroduce once automatic actions exist so the score can reflect
            only improvements SVG Workspace can currently apply. */}
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-4 py-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            Issues
          </p>
          {hasFindings ? (
            <p className="text-xs text-zinc-600">Scrollable list</p>
          ) : null}
        </div>

        {hasFindings ? (
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
            {findings.map((finding) => (
              <div
                key={finding.id}
                className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
              >
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
                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      {finding.description}
                    </p>
                    <Badge
                      variant="outline"
                      className="mt-2 border-white/[0.06] bg-transparent px-1.5 py-0 text-[9px] font-normal capitalize text-zinc-600"
                    >
                      {finding.category}
                    </Badge>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled
                    className="h-7 shrink-0 border-white/[0.08] bg-white/[0.02] px-2.5 text-[11px] text-zinc-500 opacity-100"
                  >
                    Review
                  </Button>
                </div>
              </div>
            ))}
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
