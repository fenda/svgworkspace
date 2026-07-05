"use client";

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
    <section
      data-workspace-root
      className="overflow-hidden rounded-2xl border border-white/10 bg-[#111114]"
    >
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
