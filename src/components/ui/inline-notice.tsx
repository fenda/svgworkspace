"use client";

import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type InlineNoticeProps = {
  title: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
};

export function InlineNotice({
  title,
  message,
  onDismiss,
  className = "",
}: InlineNoticeProps) {
  return (
    <div
      className={`rounded-xl border border-amber-500/20 bg-amber-500/[0.08] p-4 text-left ${className}`.trim()}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-300">
          <AlertTriangle className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-amber-100">{title}</p>
            {onDismiss ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="-mr-2 -mt-2 size-8 shrink-0 text-amber-200/70 hover:bg-white/5 hover:text-amber-100"
                onClick={onDismiss}
                aria-label="Dismiss message"
              >
                <X className="size-4" />
              </Button>
            ) : null}
          </div>
          <p className="mt-1 whitespace-pre-line text-xs leading-5 text-amber-200/90">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
