"use client";

import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { BrandLogo } from "@/components/BrandLogo";
import { buttonVariants } from "@/components/ui/button";
import { openCookieSettings } from "@/lib/cookie-consent";
import {
  GITHUB_URL,
  HYPEBERRIES_TOOLS_URL,
  HYPEBERRIES_URL,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

const highlights = [
  "SVG Health",
  "Safe Optimizations",
  "Scalable SVG",
  "Before/After Diff",
  "Browser-first",
  "Transform Actions",
] as const;

export function MobileLanding() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-between">
        <div>
          <div className="mb-10 flex items-center justify-between">
            <BrandLogo />
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="Open the SVG Workspace GitHub repository"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "size-9 text-zinc-300 transition-colors duration-150 hover:bg-white/5 hover:text-zinc-100",
              )}
            >
              <GitHubIcon />
            </a>
          </div>

          <div className="space-y-5">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight">SVG Workspace</h1>
              <p className="text-base text-zinc-300">
                Understand and optimize SVGs before you ship.
              </p>
              <p className="text-sm text-zinc-400">
                Analyze SVG health, optimize safely, compare changes, and export
                cleaner SVGs directly in your browser.
              </p>
            </div>

            <div className="space-y-2 rounded-2xl border border-white/10 bg-[#111114] p-4">
              {highlights.map((highlight) => (
                <p key={highlight} className="text-sm text-zinc-300">
                  ✓ {highlight}
                </p>
              ))}
            </div>

            <div className="space-y-3 text-sm text-zinc-300">
              <p>SVG Workspace is currently optimized for desktop browsers.</p>
              <p>
                Continue on your desktop to analyze, optimize, compare, and
                export SVGs, including scalable SVG checks and Transform actions.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-8 text-sm">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View SVG Workspace on GitHub"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "border-white/10 bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05]",
              )}
            >
              View on GitHub
            </a>
            <a
              href={HYPEBERRIES_TOOLS_URL}
              className="text-zinc-300 transition-colors hover:text-zinc-100 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
            >
              All Hypeberries tools
            </a>
            <button
              type="button"
              onClick={() => void openCookieSettings()}
              className="text-zinc-400 transition-colors hover:text-zinc-200 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
            >
              Cookie settings
            </button>
          </div>
          <p className="text-xs text-zinc-500">
            Part of{" "}
            <a
              href={HYPEBERRIES_URL}
              className="text-zinc-300 underline-offset-4 transition-colors hover:text-zinc-100 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
            >
              Hypeberries
            </a>
            <span className="text-zinc-600"> — small tools, built to be useful.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
