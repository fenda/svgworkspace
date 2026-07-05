"use client";

import { heroBadges, heroHighlights } from "@/lib/mock-data";

export function Hero() {
  return (
    <section className="space-y-5 pt-1">
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-tight">
        Understand and optimize SVGs before you{" "}
        <span className="bg-gradient-to-r from-[#7c75f5] via-violet-400 to-blue-400 bg-clip-text text-transparent">
          ship.
        </span>
      </h1>
      <div className="max-w-2xl space-y-2 text-base text-zinc-300 sm:text-lg">
        <p>
          Analyze SVG health, apply safe optimizations, compare changes, and
          export cleaner SVGs directly in your browser.
        </p>
        <p className="text-sm text-zinc-400 sm:text-base">
          SVG Workspace also includes scalable SVG analysis and Transform
          actions such as Generate ViewBox when the next step depends on
          intent.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 pt-0.5">
        {heroBadges.map((badge) => (
          <span
            key={badge}
            className="rounded-full border border-white/[0.06] px-2.5 py-0.5 text-[11px] text-zinc-300"
          >
            {badge}
          </span>
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {heroHighlights.map((highlight) => (
          <div
            key={highlight.title}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3"
          >
            <p className="text-sm font-medium text-zinc-100">{highlight.title}</p>
            <p className="mt-1 text-xs leading-5 text-zinc-400">
              {highlight.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
