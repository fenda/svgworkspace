"use client";

import { useState } from "react";
import { Check, Copy, Download, Grid3X3, Maximize2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSvgWorkspace } from "@/hooks/use-svg-workspace";
import { copySvg } from "@/output/copy-svg";
import { downloadSvg } from "@/output/download-svg";
import { cn } from "@/lib/utils";

export function PreviewCard() {
  const { document } = useSvgWorkspace();
  const [activeTab, setActiveTab] = useState<"preview" | "svg">("preview");
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">("idle");

  if (!document) {
    return null;
  }

  const { content, filename } = document;

  async function handleCopy() {
    try {
      await copySvg(content);
      setCopyState("success");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 2200);
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[#0d0d10] transition-colors duration-150 hover:border-white/[0.14]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02] p-1">
          {[
            { id: "preview", label: "Preview" },
            { id: "svg", label: "SVG" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as "preview" | "svg")}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-white/[0.08] text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === "preview" ? (
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
        ) : null}
      </div>

      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05]"
            onClick={() => void handleCopy()}
          >
            {copyState === "success" ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            Copy SVG
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05]"
            onClick={() => downloadSvg(content, filename)}
          >
            <Download className="size-3.5" />
            Download SVG
          </Button>
        </div>
        {copyState === "success" ? (
          <p className="text-xs text-emerald-400">Copied</p>
        ) : copyState === "error" ? (
          <p className="text-xs text-amber-400">Copy failed</p>
        ) : null}
      </div>

      {activeTab === "preview" ? (
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
      ) : (
        <div className="aspect-[16/10] overflow-hidden bg-[#111114]">
          <pre className="h-full overflow-auto p-4 text-xs leading-6 text-zinc-300">
            <code className="font-metric whitespace-pre-wrap break-all">{content}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
