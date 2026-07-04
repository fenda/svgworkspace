"use client";

import { ChevronRight } from "lucide-react";
import { quickActions } from "@/lib/mock-data";

export function QuickActions() {
  return (
    <section className="space-y-4">
      <p className="text-sm text-zinc-500">Already know what you want?</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              className="group flex min-h-[52px] items-center gap-3 rounded-xl border border-white/10 bg-[#111114] px-3 py-4 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.03]"
            >
              <Icon className={`size-[18px] shrink-0 ${action.color}`} />
              <span className="flex-1 text-xs font-medium text-zinc-300">
                {action.label}
              </span>
              <ChevronRight className="size-3.5 shrink-0 text-zinc-600 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-zinc-400" />
            </button>
          );
        })}
      </div>
    </section>
  );
}
