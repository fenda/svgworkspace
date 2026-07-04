"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSvgWorkspace } from "@/hooks/use-svg-workspace";
import {
  getSeverityTextClass,
} from "@/analysis/display";
import { cn } from "@/lib/utils";
import { SeverityIcon } from "./FindingsList";
import { Button } from "@/components/ui/button";

export function AnalysisCard() {
  const { document } = useSvgWorkspace();

  if (!document) {
    return null;
  }

  const { findings } = document.analysis;
  const findingCount = findings.length;
  const hasFindings = findingCount > 0;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0d0d10] transition-colors duration-150 hover:border-white/[0.14]">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-sm font-medium text-zinc-200">SVG Grade</p>
      </div>

      <div className="space-y-4 border-b border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-lg border",
              hasFindings
                ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
            )}
          >
            {hasFindings ? (
              <AlertCircle className="size-5" />
            ) : (
              <CheckCircle2 className="size-5" />
            )}
          </div>
          <div>
            <p
              className={cn(
                "text-lg font-semibold",
                hasFindings ? "text-amber-300" : "text-emerald-300",
              )}
            >
              {hasFindings ? "Incomplete" : "Ready"}
            </p>
            <p className="text-sm text-zinc-400">
              {hasFindings
                ? `${findingCount} ${findingCount === 1 ? "finding" : "findings"} found`
                : "No issues detected."}
            </p>
          </div>
        </div>

        <p className="text-sm leading-6 text-zinc-500">
          {hasFindings
            ? "Complete the recommended improvements to calculate a production-ready grade."
            : "This SVG passed the current MVP checks."}
        </p>
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
