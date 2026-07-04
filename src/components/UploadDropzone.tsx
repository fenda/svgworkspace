"use client";

import { useCallback, useId, useRef, useState } from "react";
import { CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSvgWorkspace } from "@/hooks/use-svg-workspace";
import { cn } from "@/lib/utils";

function isSvgPaste(text: string): boolean {
  const trimmed = text.trim();
  return trimmed.startsWith("<svg") || trimmed.includes("<svg");
}

export function UploadDropzone() {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { error, isProcessing, loadFromContent, loadFromFile, loadExample } =
    useSvgWorkspace();

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;
      await loadFromFile(file);
    },
    [loadFromFile],
  );

  const handlePaste = useCallback(
    (text: string) => {
      if (!isSvgPaste(text)) return;
      loadFromContent(text.trim(), "pasted.svg", "paste");
    },
    [loadFromContent],
  );

  return (
    <div
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        void handleFiles(event.dataTransfer.files);
      }}
      onPaste={(event) => {
        const text = event.clipboardData.getData("text");
        if (isSvgPaste(text)) {
          event.preventDefault();
          handlePaste(text);
        }
      }}
      tabIndex={0}
      className={cn(
        "flex h-full min-h-[192px] flex-col items-center justify-center rounded-2xl border border-dashed bg-[#111114] p-5 text-center transition-all duration-150 outline-none",
        "border-[var(--brand)]/40 hover:border-[var(--brand)]/60 hover:shadow-[0_0_28px_var(--brand-glow)] focus-visible:border-[var(--brand)]/60 focus-visible:shadow-[0_0_28px_var(--brand-glow)]",
        isDragging &&
          "upload-drag-over scale-[1.01] border-[var(--brand)]/70 shadow-[0_0_32px_var(--brand-glow)]",
      )}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept=".svg,image/svg+xml"
        className="sr-only"
        onChange={(event) => {
          void handleFiles(event.target.files);
          event.target.value = "";
        }}
      />

      <div className="relative mb-4">
        <div
          aria-hidden
          className="absolute inset-0 scale-[1.6] rounded-full bg-[var(--brand)]/25 blur-2xl"
        />
        <div className="relative flex size-14 items-center justify-center rounded-xl bg-[var(--brand-muted)]">
          <CloudUpload className="size-7 text-[#8b84f7]" />
        </div>
      </div>

      <p className="mb-2 text-sm font-medium text-zinc-300">
        Drop your SVG here
      </p>
      <p className="mb-4 text-xs text-zinc-500">
        or browse, paste or explore an example
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          type="button"
          disabled={isProcessing}
          className="bg-[var(--brand)] text-white transition-colors duration-150 hover:bg-[var(--brand-hover)]"
          onClick={() => inputRef.current?.click()}
        >
          Browse Files
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isProcessing}
          className="border-white/10 bg-transparent text-zinc-300 transition-all duration-150 hover:border-white/20 hover:bg-white/5"
          onClick={loadExample}
        >
          ✨ Explore an Example
        </Button>
      </div>

      <p className="mt-5 text-xs text-zinc-500">
        Paste SVG <span className="font-metric text-zinc-400">⌘V</span>
      </p>

      {error ? (
        <p className="mt-4 text-xs text-amber-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
