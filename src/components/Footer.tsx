import { Code2, Star } from "lucide-react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import Link from "next/link";
import { footerLinks } from "@/lib/mock-data";
import { buttonVariants } from "@/components/ui/button";
import { GITHUB_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#0a0a0c]">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-600">
                <Code2 className="size-4 text-white" />
              </div>
              <span className="text-sm font-bold text-white">
                Workspace
              </span>
            </div>
            <p className="text-sm text-zinc-500">
              The modern SVG toolkit for developers.
            </p>
            <p className="text-xs text-zinc-600">SVG Workspace v0.4.0</p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {(
              Object.entries(footerLinks) as [
                string,
                { label: string; href: string }[],
              ][]
            ).map(([category, links]) => (
              <div key={category}>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-400">
                  {category}
                </p>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-white/10 bg-[#111114] p-5">
            <div className="flex items-start gap-3">
              <GitHubIcon className="size-5 shrink-0 text-zinc-400" />
              <div className="space-y-3">
                <p className="text-sm font-medium text-zinc-200">
                  Star us on GitHub
                </p>
                <p className="text-xs text-zinc-500">
                  Help us grow and get notified of new features.
                </p>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ size: "sm", variant: "outline" }),
                    "gap-1.5 border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10",
                  )}
                >
                  <Star className="size-3.5" />
                  Star on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6 text-xs text-zinc-600">
          <span>Browser only</span>
          <span className="text-zinc-700">·</span>
          <span>No uploads</span>
          <span className="text-zinc-700">·</span>
          <span>100% private</span>
        </div>
      </div>
    </footer>
  );
}
