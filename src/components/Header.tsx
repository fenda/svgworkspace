"use client";

import { Badge } from "@/components/ui/badge";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { buttonVariants } from "@/components/ui/button";
import { GITHUB_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 lg:px-8">
      <Badge
        variant="outline"
        className="border-white/[0.08] bg-white/[0.02] px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-zinc-500"
      >
        Preview
      </Badge>

      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "size-9 text-zinc-400 transition-colors duration-150 hover:bg-white/5 hover:text-zinc-200",
        )}
      >
        <GitHubIcon />
      </a>
    </header>
  );
}
