"use client";

import { Code2 } from "lucide-react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { APP_VERSION, SHORT_COMMIT_SHA } from "@/lib/app-version";
import { openCookieSettings } from "@/lib/cookie-consent";
import {
  GITHUB_URL,
  HYPEBERRIES_TOOLS_URL,
  HYPEBERRIES_URL,
} from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#0a0a0c]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-600">
            <Code2 className="size-4 text-white" />
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-white">SVG Workspace</p>
            <p
              className="text-xs text-zinc-500"
              title={SHORT_COMMIT_SHA ? `Commit ${SHORT_COMMIT_SHA}` : undefined}
            >
              {APP_VERSION}
              {SHORT_COMMIT_SHA ? (
                <span className="ml-2 text-zinc-600">{SHORT_COMMIT_SHA}</span>
              ) : null}
            </p>
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
        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the SVG Workspace GitHub repository"
            className="inline-flex items-center gap-1.5 text-zinc-300 transition-colors hover:text-zinc-100 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
          >
            <GitHubIcon className="size-4" />
            GitHub
          </a>
          <span className="text-zinc-700">•</span>
          <a
            href={HYPEBERRIES_TOOLS_URL}
            className="text-zinc-300 transition-colors hover:text-zinc-100 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
          >
            All Hypeberries tools
          </a>
          <span className="text-zinc-700">•</span>
          <button
            type="button"
            onClick={() => void openCookieSettings()}
            className="text-zinc-300 transition-colors hover:text-zinc-100 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
          >
            Cookie settings
          </button>
          <span className="text-zinc-700">•</span>
          <span className="text-zinc-300">Privacy-first</span>
        </div>
      </div>
    </footer>
  );
}
