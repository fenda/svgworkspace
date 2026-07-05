"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code2, MessageSquare } from "lucide-react";
import { navItems } from "@/lib/mock-data";
import { GITHUB_ISSUES_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/" || pathname === "";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();
  const previewNavItems = navItems.filter((item) => item.href === "/");

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-16 flex-col border-r border-white/10 bg-[#0a0a0c] lg:w-56">
      <div className="flex items-center gap-2.5 px-4 py-5 lg:px-5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
          <Code2 className="size-4 text-white" />
        </div>
        <span className="hidden text-sm font-bold text-white lg:block">
          Workspace
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto px-2 pb-3 lg:px-3">
        {previewNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActiveRoute(pathname, item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150",
                active
                  ? "bg-indigo-600/20 text-indigo-300"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="hidden lg:block">{item.label}</span>
            </Link>
          );
        })}

        {/* Preview-only nav: keep future sections easy to restore after implementation begins.
        <div className="hidden lg:block">
          <div className="mx-3 border-t border-white/10" />
        </div>

        <div className="hidden px-3 lg:block">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-700">
            Coming Soon
          </p>
        </div>

        {sidebarSections.map((section) => (
          <div key={section.label} className="space-y-1 opacity-80">
            <p className="hidden px-3 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-700 lg:block">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActiveRoute(pathname, item.href);

                return (
                  <Link
                    key={`${section.label}-${item.label}`}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150",
                      active
                        ? "bg-indigo-600/20 text-indigo-300"
                        : "text-zinc-600 hover:bg-white/[0.03] hover:text-zinc-300",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
        */}
      </nav>

      <div className="border-t border-white/10 p-2 lg:p-3">
        <a
          href={GITHUB_ISSUES_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Feedback"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 transition-colors duration-150 hover:bg-white/5 hover:text-zinc-100"
        >
          <MessageSquare className="size-4 shrink-0" />
          <span className="hidden lg:block">Feedback</span>
        </a>
      </div>
    </aside>
  );
}
