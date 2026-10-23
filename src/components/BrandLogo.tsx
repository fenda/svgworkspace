import Image from "next/image";
import { HYPEBERRIES_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <a
      href={HYPEBERRIES_URL}
      aria-label="SVG Workspace, by Hypeberries"
      className={cn(
        "group grid justify-items-start gap-0.5 text-xs font-medium leading-none tracking-[0.005em] text-zinc-400 no-underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70",
        className,
      )}
    >
      <Image
        src="/svg-workspace-wordmark-reversed.svg"
        alt=""
        width="196"
        height="40"
        unoptimized
        className="block h-8 w-auto"
      />
      <span className="pl-5">
        by <strong className="font-bold text-[#e81baa] underline-offset-2 group-hover:underline">hypeberries</strong>
      </span>
    </a>
  );
}
