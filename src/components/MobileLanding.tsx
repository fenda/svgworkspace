import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { buttonVariants } from "@/components/ui/button";
import { GITHUB_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const highlights = [
  "SVG Health",
  "Safe Optimizations",
  "Scalable SVG",
  "Before/After Diff",
  "Browser-first",
  "Transform Actions",
] as const;

export function MobileLanding() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-between">
        <div>
          <div className="mb-10 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold tracking-tight">SVG Workspace</p>
            </div>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="Open the SVG Workspace GitHub repository"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "size-9 text-zinc-300 transition-colors duration-150 hover:bg-white/5 hover:text-zinc-100",
              )}
            >
              <GitHubIcon />
            </a>
          </div>

          <div className="space-y-5">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight">SVG Workspace</h1>
              <p className="text-base text-zinc-300">
                Understand and optimize SVGs before you ship.
              </p>
              <p className="text-sm text-zinc-400">
                Analyze SVG health, optimize safely, compare changes, and export
                cleaner SVGs directly in your browser.
              </p>
            </div>

            <div className="space-y-2 rounded-2xl border border-white/10 bg-[#111114] p-4">
              {highlights.map((highlight) => (
                <p key={highlight} className="text-sm text-zinc-300">
                  ✓ {highlight}
                </p>
              ))}
            </div>

            <div className="space-y-3 text-sm text-zinc-300">
              <p>SVG Workspace is currently optimized for desktop browsers.</p>
              <p>
                Continue on your desktop to analyze, optimize, compare, and
                export SVGs, including scalable SVG checks and Transform actions.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View SVG Workspace on GitHub"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "border-white/10 bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05]",
            )}
          >
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
