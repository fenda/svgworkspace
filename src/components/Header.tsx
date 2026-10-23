"use client";

import { Command } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWorkspaceUiStore } from "@/stores/workspace-ui-store";

export function Header() {
  const openCommandPalette = useWorkspaceUiStore(
    (state) => state.openCommandPalette,
  );

  return (
    <header className="flex items-center justify-between px-6 py-4 lg:px-8">
      <div className="flex items-center gap-4">
        <BrandLogo />
        <Badge
          variant="outline"
          className="border-white/[0.08] bg-white/[0.02] px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-zinc-300"
        >
          Preview
        </Badge>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05]"
        onClick={openCommandPalette}
      >
        <Command className="size-3.5" />
        Command Palette
        <span className="ml-1 text-[10px] text-zinc-500">Ctrl/Cmd + K</span>
      </Button>
    </header>
  );
}
