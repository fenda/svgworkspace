"use client";

import { useSvgWorkspace } from "@/hooks/use-svg-workspace";
import { FindingsList } from "./FindingsList";

export function AnalysisCard() {
  const { document } = useSvgWorkspace();

  if (!document) {
    return null;
  }

  const { findings } = document.analysis;

  return (
    <div className="rounded-xl border border-white/10 bg-[#0d0d10] transition-colors duration-150 hover:border-white/[0.14]">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-sm font-medium text-zinc-200">SVG Analysis</p>
      </div>

      <div className="space-y-3 px-4 py-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
          Findings
        </p>
        <FindingsList findings={findings} />
      </div>
    </div>
  );
}
