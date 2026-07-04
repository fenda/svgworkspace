"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useSvgWorkspace } from "@/hooks/use-svg-workspace";
import { cn } from "@/lib/utils";

function ScoreRing({ score, grade }: { score: number; grade: string }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex size-32 items-center justify-center">
      <svg className="size-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-white/5"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-emerald-500"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-metric text-3xl font-bold text-emerald-400">
          {grade}
        </span>
      </div>
    </div>
  );
}

export function AnalysisCard() {
  const { document } = useSvgWorkspace();

  if (!document) {
    return null;
  }

  const analysisData = document.analysis;

  return (
    <div className="rounded-xl border border-white/10 bg-[#0d0d10] transition-colors duration-150 hover:border-white/[0.14]">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-sm font-medium text-zinc-200">SVG Analysis</p>
      </div>

      <div className="flex flex-col items-center gap-3 px-6 pt-6 pb-5">
        <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
          SVG Grade
        </p>
        <ScoreRing score={analysisData.score} grade={analysisData.grade} />
        <div className="space-y-1 text-center">
          <p className="font-metric text-lg font-bold text-white">
            {analysisData.score}{" "}
            <span className="font-normal text-zinc-500">
              / {analysisData.maxScore}
            </span>
          </p>
          <p className="text-sm font-medium text-emerald-400">
            {analysisData.label}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
          Potential gains
        </p>
        <div className="grid grid-cols-3 gap-2">
          {analysisData.potentialGains.map((gain) => (
            <div
              key={gain}
              className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2 py-2.5 text-center"
            >
              <p className="font-metric text-xs font-medium text-zinc-200">
                {gain}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2 border-t border-white/10 px-4 py-4">
        <ul className="space-y-2">
          {analysisData.checks.map((check) => (
            <li key={check.label} className="flex items-center gap-2 text-sm">
              {check.status === "good" ? (
                <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
              ) : (
                <AlertCircle className="size-4 shrink-0 text-amber-500" />
              )}
              <span
                className={cn(
                  check.status === "good" ? "text-zinc-300" : "text-amber-400/90",
                )}
              >
                {check.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="divide-y divide-white/5 border-t border-white/10">
        {analysisData.summary.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between px-4 py-2.5 text-sm"
          >
            <span className="text-zinc-500">{row.label}</span>
            <span
              className={cn(
                "font-medium",
                /\d|%|KB|×/i.test(row.value) && "font-metric",
                row.status === "good" ? "text-zinc-300" : "text-amber-400",
              )}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
