"use client";

import { Badge } from "@/components/ui/badge";
import { useSvgWorkspace } from "@/hooks/use-svg-workspace";
import {
  getSeverityIconClass,
  getSeverityTextClass,
} from "@/analysis/display";
import { FindingsEmptyState, SeverityIcon } from "./FindingsList";
import { cn } from "@/lib/utils";

export function ImprovementList() {
  const { document } = useSvgWorkspace();

  if (!document) {
    return null;
  }

  const { findings } = document.analysis;
  const findingCount = findings.length;

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-white">Improve your SVG</h3>
        <p className="mt-1 text-sm text-zinc-500">
          {findingCount === 0
            ? "No issues were detected in this SVG."
            : `We found ${findingCount} ${findingCount === 1 ? "issue" : "issues"} to review.`}
        </p>
      </div>

      <div className="space-y-2">
        {findingCount === 0 ? (
          <div className="rounded-xl border border-white/10 bg-[#0d0d10] p-4">
            <FindingsEmptyState />
          </div>
        ) : (
          findings.map((finding) => (
            <div
              key={finding.id}
              className="flex w-full items-start gap-4 rounded-xl border border-white/10 bg-[#0d0d10] p-4"
            >
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.03]",
                  getSeverityIconClass(finding.severity),
                )}
              >
                <SeverityIcon severity={finding.severity} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      getSeverityTextClass(finding.severity),
                    )}
                  >
                    {finding.title}
                  </span>
                  <Badge
                    variant="outline"
                    className="border-white/10 text-[10px] capitalize text-zinc-500"
                  >
                    {finding.category}
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {finding.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
