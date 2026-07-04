"use client";

import { continueActions } from "@/lib/mock-data";

export function ContinueWorking() {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-white">Continue working</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Choose what you&apos;d like to do next.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {continueActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              className="flex flex-col items-start gap-3 rounded-xl border border-white/10 bg-[#0d0d10] p-4 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.02]"
            >
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
