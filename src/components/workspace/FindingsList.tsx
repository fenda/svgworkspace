"use client";

import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import type { Finding, Severity } from "@/analysis";
import {
  getSeverityIconClass,
  getSeverityTextClass,
} from "@/analysis/display";
import { cn } from "@/lib/utils";

export function SeverityIcon({ severity }: { severity: Severity }) {
  const className = cn("size-4 shrink-0", getSeverityIconClass(severity));

  switch (severity) {
    case "success":
      return <CheckCircle2 className={className} />;
    case "info":
      return <Info className={className} />;
    case "error":
      return <XCircle className={className} />;
    case "warning":
      return <AlertCircle className={className} />;
  }
}

export function FindingsEmptyState() {
  return (
    <p className="text-sm text-emerald-400">✓ No issues detected.</p>
  );
}

export function FindingsList({
  findings,
  compact = false,
}: {
  findings: Finding[];
  compact?: boolean;
}) {
  if (findings.length === 0) {
    return <FindingsEmptyState />;
  }

  return (
    <ul className={cn("space-y-2", !compact && "space-y-3")}>
      {findings.map((finding) => (
        <li
          key={finding.id}
          className={cn(
            compact
              ? "flex items-start gap-2 text-sm"
              : "rounded-lg border border-white/[0.06] bg-white/[0.02] p-3",
          )}
        >
          <SeverityIcon severity={finding.severity} />
          <div className="min-w-0">
            <p
              className={cn(
                "font-medium",
                compact ? "text-sm" : "text-sm text-zinc-200",
                getSeverityTextClass(finding.severity),
              )}
            >
              {finding.title}
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">{finding.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
