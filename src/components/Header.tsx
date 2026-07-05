"use client";

import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 lg:px-8">
      <Badge
        variant="outline"
        className="border-white/[0.08] bg-white/[0.02] px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-zinc-300"
      >
        Preview
      </Badge>
    </header>
  );
}
