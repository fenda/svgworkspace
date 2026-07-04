"use client";

import { Badge } from "@/components/ui/badge";
import { continueActions } from "@/lib/mock-data";

export function ContinueWorking() {
  return (
    <section className="space-y-4">
      <h3 className="text-base font-bold text-white">Continue working</h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {continueActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              className="flex flex-col items-start gap-3 rounded-xl border border-white/10 bg-[#0d0d10] p-4 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.02]"
            >
              <Badge
                variant="outline"
                className="border-white/[0.08] bg-white/[0.02] px-1.5 py-0 text-[9px] uppercase tracking-wide text-zinc-500"
              >
                Coming Soon
              </Badge>
              <Icon className={`size-5 ${action.color}`} />
              <div>
                <p className="text-sm font-medium text-zinc-200">
                  {action.label}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
