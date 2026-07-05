"use client";

import { Check } from "lucide-react";
import { useToastStore } from "@/stores/toast-store";

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(320px,calc(100vw-2rem))] flex-col gap-2 md:right-6 md:top-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-[#0d0f0f]/95 px-3 py-2.5 text-sm text-emerald-200 shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur"
        >
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
            <Check className="size-3.5" />
          </span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
