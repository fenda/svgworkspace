"use client";

import { Focus, LoaderCircle, Search, SquareDashedMousePointer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSvgWorkspace } from "@/hooks/use-svg-workspace";
import { useWorkspaceUiStore } from "@/stores/workspace-ui-store";

export function WorkspaceToolbar() {
  const { document, isProcessing } = useSvgWorkspace();
  const focusMode = useWorkspaceUiStore((state) => state.focusMode);
  const openCommandPalette = useWorkspaceUiStore(
    (state) => state.openCommandPalette,
  );
  const toggleFocusMode = useWorkspaceUiStore(
    (state) => state.toggleFocusMode,
  );

  if (!document) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-3">
      <div className="space-y-1">
        <p className="text-sm font-medium text-zinc-200">Workspace</p>
        <p className="text-xs text-zinc-400">
          Keyboard-first controls for navigation, optimization, and export.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {isProcessing ? (
          <div
            role="status"
            aria-live="polite"
            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-1.5 text-xs text-zinc-300"
          >
            <LoaderCircle className="size-3.5 animate-spin" />
            Updating workspace
          </div>
        ) : null}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05]"
          onClick={openCommandPalette}
        >
          <Search className="size-3.5" />
          Command Palette
          <span className="ml-1 text-[11px] text-zinc-400">Ctrl/Cmd + K</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-pressed={focusMode}
          className="border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05]"
          onClick={toggleFocusMode}
        >
          {focusMode ? (
            <SquareDashedMousePointer className="size-3.5" />
          ) : (
            <Focus className="size-3.5" />
          )}
          {focusMode ? "Exit Focus Mode" : "Focus Mode"}
        </Button>
      </div>
    </div>
  );
}
