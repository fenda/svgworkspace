"use client";

import { CheckCircle2, Code2 } from "lucide-react";
import { EXAMPLE_SVG } from "@/lib/mock-data";

function ScoreRing() {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (92 / 100) * circumference;

  return (
    <div className="relative mx-auto flex size-16 items-center justify-center">
      <svg className="size-full -rotate-90" viewBox="0 0 72 72">
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          className="text-white/5"
        />
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-emerald-500"
        />
      </svg>
      <span className="font-metric absolute text-lg font-bold text-emerald-400">
        A
      </span>
    </div>
  );
}

export function AppPreviewMock() {
  return (
    <div className="group relative mx-auto w-full max-w-4xl">
      <div
        aria-hidden
        className="absolute -inset-x-8 bottom-0 h-24 bg-[var(--brand)]/20 blur-3xl transition-opacity duration-150 group-hover:opacity-100"
      />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111114] shadow-[0_24px_80px_rgba(0,0,0,0.45)] transition-all duration-150 group-hover:-translate-y-0.5 group-hover:border-white/[0.14]">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <div className="size-2.5 rounded-full bg-white/10" />
          <div className="size-2.5 rounded-full bg-white/10" />
          <div className="size-2.5 rounded-full bg-white/10" />
          <span className="ml-2 text-xs text-zinc-500">svg-workspace</span>
        </div>

        <div className="flex min-h-[280px] sm:min-h-[320px]">
          <aside className="hidden w-36 shrink-0 border-r border-white/10 bg-[#0a0a0c] p-3 sm:block">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-md bg-[var(--brand-muted)]">
                <Code2 className="size-3 text-[#8b84f7]" />
              </div>
              <span className="text-[10px] font-medium text-zinc-400">
                Workspace
              </span>
            </div>
            {["Workspace", "Optimize", "Convert", "Colors"].map((item, i) => (
              <div
                key={item}
                className={`mb-1 rounded-md px-2 py-1.5 text-[10px] ${
                  i === 0
                    ? "bg-[var(--brand-muted)] text-[#a09af8]"
                    : "text-zinc-600"
                }`}
              >
                {item}
              </div>
            ))}
          </aside>

          <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
            <div className="flex-1 border-b border-white/10 p-4 lg:border-r lg:border-b-0">
              <p className="mb-3 text-[10px] font-medium text-zinc-400">
                SVG Preview
              </p>
              <div
                className="flex aspect-[4/3] items-center justify-center rounded-lg"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, #1a1a1e 25%, transparent 25%), linear-gradient(-45deg, #1a1a1e 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a1e 75%), linear-gradient(-45deg, transparent 75%, #1a1a1e 75%)",
                  backgroundSize: "12px 12px",
                  backgroundPosition: "0 0, 0 6px, 6px -6px, -6px 0px",
                  backgroundColor: "#141418",
                }}
              >
                <div
                  className="size-20 sm:size-24 [&>svg]:size-full"
                  dangerouslySetInnerHTML={{ __html: EXAMPLE_SVG }}
                />
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {[
                  { label: "ViewBox", value: "24×24" },
                  { label: "Size", value: "2.4 KB" },
                  { label: "Paths", value: "3" },
                  { label: "Colors", value: "2" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-md border border-white/[0.06] px-2 py-1.5 text-center"
                  >
                    <p className="text-[8px] uppercase tracking-wider text-zinc-600">
                      {item.label}
                    </p>
                    <p className="font-metric text-[10px] text-zinc-400">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full shrink-0 p-4 lg:w-52">
              <p className="mb-3 text-[10px] font-medium text-zinc-400">
                SVG Analysis
              </p>
              <ScoreRing />
              <p className="font-metric mt-2 text-center text-sm font-bold text-white">
                92 <span className="font-normal text-zinc-500">/ 100</span>
              </p>
              <p className="mt-1 text-center text-[10px] text-emerald-400">
                Production Ready
              </p>
              <div className="mt-4 space-y-1.5">
                {["Well structured", "Accessible", "Responsive"].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-1.5 text-[10px] text-zinc-500"
                  >
                    <CheckCircle2 className="size-3 text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
