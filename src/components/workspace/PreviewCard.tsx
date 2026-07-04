"use client";

import { Grid3X3, Maximize2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSvgWorkspace } from "@/hooks/use-svg-workspace";

export function PreviewCard() {
  const { document } = useSvgWorkspace();

  if (!document) {
    return null;
  }

  const { content } = document;

  return (
    <div className="rounded-xl border border-white/10 bg-[#0d0d10] transition-colors duration-150 hover:border-white/[0.14]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <p className="text-sm font-medium text-zinc-200">SVG Preview</p>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-zinc-500 transition-colors duration-150 hover:bg-white/5 hover:text-zinc-300"
          >
            <Minus className="size-3.5" />
          </Button>
          <span className="font-metric min-w-[3rem] text-center text-xs text-zinc-400">
            100%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-zinc-500 transition-colors duration-150 hover:bg-white/5 hover:text-zinc-300"
          >
            <Plus className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-zinc-500 transition-colors duration-150 hover:bg-white/5 hover:text-zinc-300"
          >
            <Maximize2 className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-zinc-500 transition-colors duration-150 hover:bg-white/5 hover:text-zinc-300"
          >
            <Grid3X3 className="size-3.5" />
          </Button>
        </div>
      </div>

      <div
        className="flex aspect-[16/10] items-center justify-center p-8"
        style={{
          backgroundImage:
            "linear-gradient(45deg, #1a1a1e 25%, transparent 25%), linear-gradient(-45deg, #1a1a1e 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a1e 75%), linear-gradient(-45deg, transparent 75%, #1a1a1e 75%)",
          backgroundSize: "16px 16px",
          backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
          backgroundColor: "#141418",
        }}
      >
        <div
          className="size-32 [&>svg]:size-full"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}
