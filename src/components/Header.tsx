"use client";

import { Moon, Sun } from "lucide-react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { GITHUB_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="flex items-center justify-end gap-2 px-6 py-4 lg:px-8">
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
      <Button
        variant="ghost"
        size="icon"
        className="size-9 text-zinc-400 transition-colors duration-150 hover:bg-white/5 hover:text-zinc-200"
        onClick={() => setDark((d) => !d)}
        aria-label="Toggle theme"
      >
        {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </Button>
    </header>
  );
}
