"use client";

import { heroBadges } from "@/lib/mock-data";

export function Hero() {
  return (
    <section className="space-y-5 pt-1">
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-tight">
        Start with your{" "}
        <span className="bg-gradient-to-r from-[#7c75f5] via-violet-400 to-blue-400 bg-clip-text text-transparent">
          SVG.
        </span>
      </h1>
      <div className="max-w-xl space-y-2 text-base text-zinc-300 sm:text-lg">
        <p>
          Upload an SVG and we&apos;ll analyze it, explain it, and help you
          choose the next best action.
        </p>
        <p className="text-sm text-zinc-400 sm:text-base">
          Everything happens in your browser. Private, fast and
          production-ready.
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
    </section>
  );
}
