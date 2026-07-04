"use client";

import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { buttonVariants } from "@/components/ui/button";
import { GITHUB_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="flex items-center justify-end px-6 py-4 lg:px-8">
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
