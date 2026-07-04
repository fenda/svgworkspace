"use client";

import { ChevronRight, Palette, Sparkles, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSvgWorkspace } from "@/hooks/use-svg-workspace";
import { cn } from "@/lib/utils";

export function ImprovementList() {
  const { document } = useSvgWorkspace();

  if (!document) {
    return null;
  }

  const { analysis, metadata } = document;

  const improvements = [
    {
      id: "optimize",
      title: "Optimize SVG",
      description: "Remove unnecessary data and reduce file size.",
      badge: analysis.estimatedReduction !== "0%" ? "Best impact" : undefined,
      icon: Sparkles,
      iconColor: "text-emerald-400 bg-emerald-400/10",
      metric: `${analysis.estimatedReduction} smaller`,
      visible: analysis.estimatedReduction !== "0%",
    },
    {
      id: "colors",
      title: "Replace Colors",
      description:
        "Convert hardcoded fills to currentColor to make your SVG flexible.",
      icon: Palette,
      iconColor: "text-violet-400 bg-violet-400/10",
      metric: `${metadata.colors} colors`,
      visible: metadata.colors > 0,
    },
    {
      id: "clean",
      title: "Clean SVG",
      description: "Remove metadata and editor-specific information.",
      icon: Wrench,
      iconColor: "text-amber-400 bg-amber-400/10",
      metric: analysis.estimatedSavings,
      visible: analysis.summary.some(
        (row) => row.label === "Illustrator metadata" && row.value === "Detected",
      ),
    },
  ].filter((item) => item.visible);

  const visibleCount = Math.max(improvements.length, 1);

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-white">Improve your SVG</h3>
        <p className="mt-1 text-sm text-zinc-500">
          We found {visibleCount} opportunities to improve your SVG.
        </p>
      </div>

      <div className="space-y-2">
        {improvements.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-[#0d0d10] p-4 text-sm text-zinc-500">
            No obvious improvements found for this SVG.
          </p>
        ) : (
          improvements.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className="group flex w-full items-center gap-4 rounded-xl border border-white/10 bg-[#0d0d10] p-4 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.02]"
            >
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-lg",
                  item.iconColor,
                )}
              >
                <Icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-200">
                    {item.title}
                  </span>
                  {item.badge ? (
                    <Badge className="bg-emerald-500/15 text-[10px] text-emerald-400 hover:bg-emerald-500/15">
                      {item.badge}
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {item.description}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="font-metric text-xs font-medium text-zinc-400">
                  {item.metric}
                </span>
                <ChevronRight className="size-4 text-zinc-600 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-zinc-400" />
              </div>
            </button>
          );
        })
        )}
      </div>
    </section>
  );
}
