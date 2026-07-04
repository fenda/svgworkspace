import { AppShell } from "@/components/layout/AppShell";

export function ToolPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <AppShell>
      <section className="space-y-3 py-8">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="max-w-xl text-sm text-zinc-400">{description}</p>
      </section>
    </AppShell>
  );
}
