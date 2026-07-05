"use client";

import { useCallback, useId, useRef, useState } from "react";
import { CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InlineNotice } from "@/components/ui/inline-notice";
import { useSvgWorkspace } from "@/hooks/use-svg-workspace";
import { useSvgWorkspaceStore } from "@/stores/svg-workspace-store";
import { cn } from "@/lib/utils";

function scrollToWorkspace() {
  if (typeof window === "undefined") {
    return;
  }

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>("[data-workspace-root]")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

export function UploadDropzone() {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const {
    uploadValidation,
    isProcessing,
    loadFromContent,
    loadFromFile,
    dismissUploadValidation,
  } =
    useSvgWorkspace();

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;
      await loadFromFile(file);

      if (useSvgWorkspaceStore.getState().document) {
        scrollToWorkspace();
      }
    },
    [loadFromFile],
  );

  const handlePaste = useCallback(
    (text: string) => {
      const trimmed = text.trim();

      if (!trimmed) {
        return;
      }

      loadFromContent(trimmed, "pasted.svg", "paste");

      if (useSvgWorkspaceStore.getState().document) {
        scrollToWorkspace();
      }
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
        if (!text.trim()) return;
        event.preventDefault();
        handlePaste(text);
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
        or browse files or paste SVG
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
      </div>

      <p className="mt-5 text-xs text-zinc-500">
        Paste SVG <span className="font-metric text-zinc-400">⌘V</span>
      </p>

      {uploadValidation ? (
        <InlineNotice
          title={uploadValidation.title}
          message={uploadValidation.message}
          onDismiss={dismissUploadValidation}
          className="mt-4 w-full max-w-md"
        />
      ) : null}
    </div>
  );
}
