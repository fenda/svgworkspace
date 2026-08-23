import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found | SVG Workspace",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0c] px-6 text-center text-white">
      <div className="max-w-md space-y-4">
        <p className="text-sm font-medium text-zinc-400">404</p>
        <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="text-sm leading-6 text-zinc-400">
          This page does not exist or is not publicly available yet.
        </p>
        <Link
          href="/"
          className="inline-flex rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/[0.07] hover:text-white"
        >
          Return to SVG Workspace
        </Link>
      </div>
    </main>
  );
}
