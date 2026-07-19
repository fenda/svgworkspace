"use client";

import { useEffect, useRef } from "react";
import { AnalysisCard } from "./AnalysisCard";
import { DetailsCard } from "./DetailsCard";
import { ExportStudioCard } from "./ExportStudioCard";
import { IconWorkspaceCard } from "./IconWorkspaceCard";
import { PreviewCard } from "./PreviewCard";
import { useSvgWorkspace } from "@/hooks/use-svg-workspace";

export function Workspace() {
  const {
    document: currentDocument,
    undo,
    redo,
  } = useSvgWorkspace();
  const hadDocumentRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const isModifierPressed = event.metaKey || event.ctrlKey;

      if (!isModifierPressed || event.altKey) {
        return;
      }

      const target = event.target;

      if (
        target instanceof HTMLElement &&
        (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable
        )
      ) {
        return;
      }

      if (event.key.toLowerCase() !== "z") {
        return;
      }

      event.preventDefault();

      if (event.shiftKey) {
        redo();
        return;
      }

      undo();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [redo, undo]);

  useEffect(() => {
    if (!currentDocument || typeof window === "undefined") {
      hadDocumentRef.current = false;
      return;
    }

    if (!hadDocumentRef.current) {
      window.requestAnimationFrame(() => {
        globalThis.document
          .querySelector<HTMLElement>("[data-workspace-root]")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    hadDocumentRef.current = true;
  }, [currentDocument]);

  if (!currentDocument) {
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
        <IconWorkspaceCard key={currentDocument.content} />
        <DetailsCard />
        <ExportStudioCard />
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
