"use client";

import { CheckCircle2, Code2 } from "lucide-react";
import { AnalysisCard } from "./AnalysisCard";
import { DetailsCard } from "./DetailsCard";
import { PreviewCard } from "./PreviewCard";
import { useSvgWorkspace } from "@/hooks/use-svg-workspace";

export function Workspace() {
  const { document } = useSvgWorkspace();

  if (!document) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#111114]">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--brand-muted)]">
            <Code2 className="size-4 text-[#8b84f7]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-200">Current SVG</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500">
              <span className="truncate">{document.filename}</span>
              <CheckCircle2 className="size-3 shrink-0 text-emerald-500" />
            </p>
          </div>
        </div>
        {/* Preview polish: header actions are intentionally hidden to keep
            the launch surface focused. Restore the Replace / Clear / Open
            controls here if they become part of the main workflow again. */}
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,1fr)] lg:items-stretch">
        <PreviewCard />
        <AnalysisCard />
      </div>

      <div className="space-y-4 border-t border-white/10 p-5">
        <DetailsCard />
      </div>
      {/* Preview polish: keep Continue Working ready to restore after the public Preview. */}
      {/*
      <div className="space-y-8 border-t border-white/10 p-5">
        <ContinueWorking />
      </div>
      */}
    </section>
  );
}
