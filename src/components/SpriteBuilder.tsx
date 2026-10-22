"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Copy, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildSpriteFromSources, takeQueuedSpriteBuilderSources, type SpriteBuildResult } from "@/lib/svg/sprite-builder";
import { copySvgWithFeedback, downloadSvgWithFeedback } from "@/output/perform-svg-export";

function getSymbolChildrenMarkup(markup: string): string {
  return markup
    .replace(/^<symbol[^>]*>/, "")
    .replace(/<\/symbol>$/, "");
}

export function SpriteBuilder() {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [result, setResult] = useState<SpriteBuildResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const sources = takeQueuedSpriteBuilderSources();
      if (sources.length) setResult(buildSpriteFromSources(sources));
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const build = async (files: FileList | null) => {
    if (!files?.length) return;
    const sources = await Promise.all(
      Array.from(files)
        .filter((file) => file.name.toLowerCase().endsWith(".svg"))
        .map(async (file) => ({ filename: file.name, content: await file.text() })),
    );
    setResult(buildSpriteFromSources(sources));
  };

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-5 py-10">
      <header className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--brand)]">Sprite Builder</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100">Build a sprite from SVG icons.</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">Icons stay in your browser. Each source becomes a symbol with a stable filename-based ID and isolated internal references.</p>
      </header>

      <section
        aria-label="Add SVG icon files to the sprite builder"
        onDragEnter={(event) => {
          event.preventDefault();
          dragDepth.current += 1;
          setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          event.preventDefault();
          dragDepth.current = Math.max(0, dragDepth.current - 1);
          if (dragDepth.current === 0) setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          dragDepth.current = 0;
          setIsDragging(false);
          void build(event.dataTransfer.files);
        }}
        className={`rounded-2xl border border-dashed bg-[#111114] p-8 text-center transition-colors ${
          isDragging
            ? "border-[var(--brand)] bg-[var(--brand)]/5"
            : "border-white/15"
        }`}
      >
        <input ref={inputRef} id={inputId} type="file" accept=".svg,image/svg+xml" multiple className="sr-only" onChange={(event) => { void build(event.target.files); event.target.value = ""; }} />
        <Upload aria-hidden="true" className="mx-auto size-8 text-[var(--brand)]" />
        <p className="mt-3 text-sm font-medium text-zinc-200">Drop SVG icons here</p>
        <p className="mt-1 text-xs text-zinc-500">Multiple files supported. Files without a usable canvas are skipped.</p>
        <Button className="mt-5 bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)]" onClick={() => inputRef.current?.click()}>Browse icon files</Button>
      </section>

      {result ? (
        <section className="rounded-xl border border-white/10 bg-[#0d0d10] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="text-sm font-medium text-zinc-100">Generated sprite</h2><p className="mt-1 text-xs text-zinc-500">{result.symbols.length} {result.symbols.length === 1 ? "symbol" : "symbols"} ready to export.</p></div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={!result.symbols.length} onClick={() => void copySvgWithFeedback({ svgMarkup: result.markup, successMessage: "Copied sprite" })}><Copy className="size-3.5" />Copy</Button>
              <Button variant="outline" size="sm" disabled={!result.symbols.length} onClick={() => downloadSvgWithFeedback({ svgMarkup: result.markup, filename: "sprite.svg", successMessage: "Downloaded sprite" })}><Download className="size-3.5" />Download</Button>
            </div>
          </div>
          {result.warnings.length ? <div className="mt-4 rounded-lg border border-amber-400/20 bg-amber-400/5 p-3 text-xs leading-5 text-amber-100">{result.warnings.map((warning) => <p key={warning}>{warning}</p>)}</div> : null}
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {result.symbols.map((symbol) => <article key={symbol.id} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"><div className="flex aspect-square items-center justify-center rounded-md bg-white/[0.03] p-6" dangerouslySetInnerHTML={{ __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${symbol.viewBox}" aria-hidden="true">${getSymbolChildrenMarkup(symbol.markup)}</svg>` }} /><p className="mt-3 truncate text-sm text-zinc-200">{symbol.id}</p><p className="mt-1 font-metric text-xs text-zinc-500">{symbol.viewBox}</p></article>)}
          </div>
        </section>
      ) : null}
    </main>
  );
}
