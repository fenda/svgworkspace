"use client";

import { motion } from "framer-motion";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { BrandLogo } from "@/components/BrandLogo";
import { AppPreviewMock } from "@/components/coming-soon/AppPreviewMock";
import { buttonVariants } from "@/components/ui/button";
import { GITHUB_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function ComingSoonPage() {
  return (
    <div className="coming-soon-bg relative flex min-h-screen flex-col">
      <header className="relative z-10 flex items-center justify-between px-6 py-5 lg:px-10">
        <BrandLogo />
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

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="flex w-full max-w-2xl flex-col items-center text-center"
        >
          <span className="mb-6 rounded-full border border-[var(--brand)]/30 bg-[var(--brand-muted)] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[#a09af8]">
            Coming Soon
          </span>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-tight">
            Start with your{" "}
            <span className="bg-gradient-to-r from-[#7c75f5] via-violet-400 to-blue-400 bg-clip-text text-transparent">
              SVG.
            </span>
          </h1>

          <div className="mt-6 max-w-lg space-y-3 text-base text-zinc-400 sm:text-lg">
            <p>
              SVG Workspace is a browser-based toolkit for analyzing, improving
              and converting SVGs.
            </p>
            <p className="text-sm text-zinc-500 sm:text-base">
              Everything happens locally in your browser. Private, fast and
              developer-first.
            </p>
          </div>

          <div className="mt-10 flex flex-col items-center gap-3">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-10 bg-[var(--brand)] px-6 text-white transition-colors duration-150 hover:bg-[var(--brand-hover)]",
              )}
            >
              Follow Development on GitHub
            </a>
            <p className="text-xs text-zinc-500">
              The project is actively being built in public.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.08 }}
          className="mt-16 w-full max-w-4xl sm:mt-20"
        >
          <AppPreviewMock />
        </motion.div>
      </main>

      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-10 text-center lg:px-10">
        <p className="text-sm font-bold text-white">SVG Workspace</p>
        <p className="mt-1 text-sm text-zinc-500">Built for developers.</p>
        <p className="mt-4 text-xs text-zinc-600">
          Browser only • No uploads • 100% private
        </p>
      </footer>
    </div>
  );
}
