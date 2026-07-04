"use client";

import { useRef } from "react";
import {
  CheckCircle2,
  Code2,
  ExternalLink,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { AnalysisCard } from "./AnalysisCard";
import { ContinueWorking } from "./ContinueWorking";
import { DetailsCard } from "./DetailsCard";
import { PreviewCard } from "./PreviewCard";
import { Button } from "@/components/ui/button";
import { useSvgWorkspace } from "@/hooks/use-svg-workspace";

export function Workspace() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { document, loadFromFile, clear } = useSvgWorkspace();

  if (!document) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#111114]">
      <input
        ref={inputRef}
        type="file"
        accept=".svg,image/svg+xml"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            void loadFromFile(file);
          }
          event.target.value = "";
        }}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--brand-muted)]">
            <Code2 className="size-4 text-[#8b84f7]" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-200">Workspace</p>
            <p className="flex items-center gap-1.5 text-xs text-zinc-500">
              {document.filename}
              <CheckCircle2 className="size-3 text-emerald-500" />
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs text-zinc-400 transition-colors duration-150 hover:bg-white/5 hover:text-zinc-200"
            onClick={() => inputRef.current?.click()}
          >
            <RefreshCw className="size-3.5" />
            Replace SVG
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs text-zinc-400 transition-colors duration-150 hover:bg-white/5 hover:text-zinc-200"
            onClick={clear}
          >
            <Trash2 className="size-3.5" />
            Clear
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-zinc-400 transition-colors duration-150 hover:bg-white/5 hover:text-zinc-200"
          >
            <ExternalLink className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.95fr)] lg:items-stretch">
        <PreviewCard />
        <AnalysisCard />
      </div>

      <div className="space-y-4 border-t border-white/10 p-5">
        <DetailsCard />
      </div>

      <div className="space-y-8 border-t border-white/10 p-5">
        <ContinueWorking />
      </div>
    </section>
  );
}
