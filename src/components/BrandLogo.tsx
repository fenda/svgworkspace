import { Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--brand)]">
        <Code2 className="size-4 text-white" />
      </div>
      <span className="text-sm font-bold text-white">SVG Workspace</span>
    </div>
  );
}
