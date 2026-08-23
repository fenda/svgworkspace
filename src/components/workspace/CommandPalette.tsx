"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Command, CornerDownLeft, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspaceActions } from "@/hooks/use-workspace-actions";
import { filterWorkspaceActions } from "@/lib/workspace-actions";
import { getShortcutLabel } from "@/lib/workspace-shortcuts";
import { useWorkspaceUiStore } from "@/stores/workspace-ui-store";

export function CommandPalette() {
  const actions = useWorkspaceActions();
  const commandPaletteOpen = useWorkspaceUiStore(
    (state) => state.commandPaletteOpen,
  );
  const closeCommandPalette = useWorkspaceUiStore(
    (state) => state.closeCommandPalette,
  );
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const filteredActions = useMemo(
    () => filterWorkspaceActions(actions, query),
    [actions, query],
  );

  useEffect(() => {
    if (!commandPaletteOpen) {
      return;
    }

    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, [commandPaletteOpen]);

  useEffect(() => {
    if (!commandPaletteOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeCommandPalette();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeCommandPalette, commandPaletteOpen]);

  if (!commandPaletteOpen) {
    return null;
  }

  const safeSelectedIndex =
    filteredActions.length === 0
      ? 0
      : Math.min(selectedIndex, filteredActions.length - 1);
  const selectedAction = filteredActions[safeSelectedIndex] ?? null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 px-4 py-10 backdrop-blur-sm md:px-6"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeCommandPalette();
        }
      }}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0f1013] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-3">
          <Search className="size-4 text-zinc-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setSelectedIndex((current) =>
                  Math.min(current + 1, filteredActions.length - 1),
                );
                return;
              }

              if (event.key === "ArrowUp") {
                event.preventDefault();
                setSelectedIndex((current) => Math.max(current - 1, 0));
                return;
              }

              if (event.key === "Enter") {
                event.preventDefault();
                selectedAction?.execute();
              }
            }}
            placeholder="Search actions, workspaces, and exports"
            aria-label="Search workspace actions"
            onBlur={() => {
              if (!commandPaletteOpen) {
                setQuery("");
                setSelectedIndex(0);
              }
            }}
            className="flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Close command palette"
            className="text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
            onClick={closeCommandPalette}
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-2 text-[11px] text-zinc-500">
          <div className="flex items-center gap-2">
            <Command className="size-3.5" />
            <span>{actions.length} workspace actions</span>
          </div>
          <div className="flex items-center gap-4">
            <span>{getShortcutLabel("undo")}</span>
            <span>{getShortcutLabel("redo")}</span>
            <span>{getShortcutLabel("focus-search")}</span>
          </div>
        </div>

        <div
          ref={listRef}
          className="max-h-[60vh] overflow-y-auto p-2"
          role="listbox"
          aria-label="Workspace commands"
        >
          {filteredActions.length > 0 ? (
            filteredActions.map((action, index) => {
              const selected = index === safeSelectedIndex;

              return (
                <button
                  key={action.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`flex w-full items-start justify-between gap-4 rounded-xl px-3 py-3 text-left transition ${
                    selected
                      ? "bg-white/[0.08]"
                      : "hover:bg-white/[0.04]"
                  }`}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => action.execute()}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-100">
                      {action.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-zinc-400">
                      {action.description}
                    </p>
                    {!action.enabled && action.disabledReason ? (
                      <p className="mt-1 text-xs leading-5 text-amber-300">
                        {action.disabledReason}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-[11px] text-zinc-500">
                    {selected ? <CornerDownLeft className="size-3.5" /> : null}
                    <span>{action.enabled ? "Ready" : "Unavailable"}</span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="px-3 py-8 text-center">
              <p className="text-sm text-zinc-300">No actions match your search.</p>
              <p className="mt-1 text-xs text-zinc-500">
                Try a different keyword like optimize, export, geometry, or sprite.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
