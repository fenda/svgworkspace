"use client";

import { useEffect, useRef } from "react";
import { isIconWorkspaceEligible } from "@/actions/icon-workspace";
import { AnalysisCard } from "./AnalysisCard";
import { DetailsCard } from "./DetailsCard";
import { ExportStudioCard } from "./ExportStudioCard";
import { IconWorkspaceCard } from "./IconWorkspaceCard";
import { PreviewCard } from "./PreviewCard";
import { WorkspaceToolbar } from "./WorkspaceToolbar";
import { useSvgWorkspace } from "@/hooks/use-svg-workspace";
import { matchesShortcut } from "@/lib/workspace-shortcuts";
import { useWorkspaceUiStore } from "@/stores/workspace-ui-store";

export function Workspace() {
  const {
    document: currentDocument,
    undo,
    redo,
  } = useSvgWorkspace();
  const focusMode = useWorkspaceUiStore((state) => state.focusMode);
  const commandPaletteOpen = useWorkspaceUiStore(
    (state) => state.commandPaletteOpen,
  );
  const openCommandPalette = useWorkspaceUiStore(
    (state) => state.openCommandPalette,
  );
  const closeCommandPalette = useWorkspaceUiStore(
    (state) => state.closeCommandPalette,
  );
  const lastActiveWorkspace = useWorkspaceUiStore(
    (state) => state.lastActiveWorkspace,
  );
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

      if (matchesShortcut("command-palette", event)) {
        event.preventDefault();
        openCommandPalette();
        return;
      }

      if (matchesShortcut("redo", event)) {
        event.preventDefault();
        redo();
        return;
      }

      if (matchesShortcut("undo", event)) {
        event.preventDefault();
        undo();
        return;
      }

      if (event.key === "Escape" && commandPaletteOpen) {
        event.preventDefault();
        closeCommandPalette();
        return;
      }

      if (
        matchesShortcut("focus-search", event) &&
        currentDocument?.symbols.length
      ) {
        event.preventDefault();
        globalThis.document
          .querySelector<HTMLInputElement>("[data-sprite-search]")
          ?.focus();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    closeCommandPalette,
    commandPaletteOpen,
    currentDocument?.symbols.length,
    openCommandPalette,
    redo,
    undo,
  ]);

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

  const secondaryWorkspace =
    lastActiveWorkspace && lastActiveWorkspace !== "preview"
      ? lastActiveWorkspace
      : isIconWorkspaceEligible(currentDocument)
        ? "icon-workspace"
        : "health";
  const showHealthCard = !focusMode || secondaryWorkspace === "health";
  const showIconWorkspace =
    isIconWorkspaceEligible(currentDocument) &&
    (!focusMode || secondaryWorkspace === "icon-workspace");
  const showInspector = !focusMode || secondaryWorkspace === "inspector";
  const showExportStudio = !focusMode || secondaryWorkspace === "export-studio";

  return (
    <section
      data-workspace-root
      aria-busy={false}
      className="overflow-hidden rounded-2xl border border-white/10 bg-[#111114]"
    >
      <div className="space-y-4 p-5">
        <WorkspaceToolbar />
      </div>

      <div className="grid gap-4 px-5 pb-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,1fr)] lg:items-stretch">
        <PreviewCard
          key={`${currentDocument.filename}:${currentDocument.originalContent}`}
        />
        {showHealthCard ? <AnalysisCard /> : null}
      </div>

      <div className="space-y-4 border-t border-white/10 p-5">
        {showIconWorkspace ? <IconWorkspaceCard key={currentDocument.content} /> : null}
        {showInspector ? <DetailsCard /> : null}
        {showExportStudio ? <ExportStudioCard /> : null}
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
