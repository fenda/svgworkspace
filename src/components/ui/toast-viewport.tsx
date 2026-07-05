"use client";

import { Check, TriangleAlert, X } from "lucide-react";
import { useToastStore } from "@/stores/toast-store";

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(320px,calc(100vw-2rem))] flex-col gap-2 md:right-6 md:top-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={
            toast.variant === "warning"
              ? "pointer-events-auto flex items-start gap-3 rounded-xl border border-amber-400/25 bg-[#14110c]/95 px-3 py-3 text-sm text-amber-100 shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur"
              : "pointer-events-auto flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-[#0d0f0f]/95 px-3 py-2.5 text-sm text-emerald-200 shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur"
          }
        >
          <span
            className={
              toast.variant === "warning"
                ? "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-amber-300"
                : "flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300"
            }
          >
            {toast.variant === "warning" ? (
              <TriangleAlert className="size-3.5" />
            ) : (
              <Check className="size-3.5" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            {toast.title ? (
              <p className="text-sm font-medium text-current">{toast.title}</p>
            ) : null}
            <p className={toast.title ? "mt-0.5 leading-5" : undefined}>
              {toast.message}
            </p>
          </div>
          {toast.dismissible ? (
            <button
              type="button"
              aria-label={`Dismiss ${toast.title ?? "notification"}`}
              className="mt-0.5 shrink-0 rounded-md p-1 text-amber-200/80 transition hover:bg-white/[0.05] hover:text-amber-100"
              onClick={() => dismissToast(toast.id)}
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
