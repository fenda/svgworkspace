"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  CodeXml,
  Copy,
  Download,
  Grid3X3,
  Maximize2,
  Minus,
  Moon,
  Plus,
  RotateCcw,
  Sparkles,
  Sun,
  Upload,
  Wrench,
} from "lucide-react";
import { applySafeFixesWithReport, applySafeFixForFindingId } from "@/actions/safe-fixes/apply-safe-fixes";
import { Button } from "@/components/ui/button";
import { createSvgDiff } from "@/output/diff-svg";
import { formatSvg } from "@/output/format-svg";
import { copySvgWithFeedback, downloadSvgWithFeedback } from "@/output/perform-svg-export";
import {
  buildSpriteFromSources,
  takeQueuedSpriteBuilderSources,
  type SpriteBuildResult,
  type SpriteBuilderSource,
} from "@/lib/svg/sprite-builder";
import type { PreviewBackground } from "@/lib/svg/preview-background";
import { showSuccessToast, showWarningToast } from "@/stores/toast-store";

type BuilderTab = "preview" | "svg" | "diff";

type SpriteBuilderTool = {
  id: "clean" | "comments" | "metadata" | "dimensions" | "precision" | "whitespace";
  label: string;
  description: string;
  findingId?: string;
};

const SPRITE_BUILDER_TOOLS: SpriteBuilderTool[] = [
  {
    id: "clean",
    label: "Clean all icons",
    description: "Run all safe automatic cleanup steps independently on every source icon.",
  },
  {
    id: "comments",
    label: "Remove comments",
    description: "Remove XML comments from every source icon.",
    findingId: "PERFORMANCE_002",
  },
  {
    id: "metadata",
    label: "Remove metadata",
    description: "Remove embedded metadata nodes that do not affect rendering.",
    findingId: "PERFORMANCE_001",
  },
  {
    id: "dimensions",
    label: "Remove fixed dimensions",
    description: "Remove width and height only when a source already has a valid viewBox.",
    findingId: "STRUCTURE_002",
  },
  {
    id: "precision",
    label: "Round decimals",
    description: "Round high-precision attribute values using the Workspace safe-fix rules.",
    findingId: "PERFORMANCE_003",
  },
  {
    id: "whitespace",
    label: "Normalize whitespace",
    description: "Remove structural whitespace while preserving text-sensitive SVG content.",
    findingId: "PERFORMANCE_007",
  },
];

const PREVIEW_BACKGROUNDS: {
  id: PreviewBackground;
  label: string;
  icon: typeof Grid3X3;
}[] = [
  { id: "transparent", label: "Transparent background", icon: Grid3X3 },
  { id: "checkerboard", label: "Checkerboard background", icon: Grid3X3 },
  { id: "light", label: "Light background", icon: Sun },
  { id: "dark", label: "Dark background", icon: Moon },
];

function getSymbolChildrenMarkup(markup: string): string {
  return markup
    .replace(/^<symbol[^>]*>/, "")
    .replace(/<\/symbol>$/, "");
}

function getPreviewCanvasStyle(background: PreviewBackground): CSSProperties {
  switch (background) {
    case "transparent":
      return { backgroundColor: "transparent" };
    case "checkerboard":
      return {
        backgroundImage:
          "linear-gradient(45deg, #1a1a1e 25%, transparent 25%), linear-gradient(-45deg, #1a1a1e 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a1e 75%), linear-gradient(-45deg, transparent 75%, #1a1a1e 75%)",
        backgroundSize: "16px 16px",
        backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
        backgroundColor: "#141418",
      };
    case "light":
      return { backgroundColor: "#f7f7f8" };
    case "dark":
      return { backgroundColor: "#09090b" };
  }
}

function getPreviewForegroundColor(background: PreviewBackground): string {
  return background === "light" ? "#111827" : "#f5f5f5";
}

function getDiffRowClass(kind: "context" | "added" | "removed"): string {
  if (kind === "added") return "bg-emerald-500/[0.08] text-emerald-200";
  if (kind === "removed") return "bg-red-500/[0.08] text-red-200";
  return "text-zinc-400";
}

function getDiffMarker(kind: "context" | "added" | "removed"): string {
  if (kind === "added") return "+";
  if (kind === "removed") return "-";
  return " ";
}

export function SpriteBuilder() {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [sources, setSources] = useState<SpriteBuilderSource[]>([]);
  const [originalSources, setOriginalSources] = useState<SpriteBuilderSource[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<BuilderTab>("preview");
  const [previewBackground, setPreviewBackground] = useState<PreviewBackground>("light");
  const [previewScale, setPreviewScale] = useState(100);

  const result = useMemo<SpriteBuildResult | null>(
    () => (sources.length > 0 ? buildSpriteFromSources(sources) : null),
    [sources],
  );
  const originalResult = useMemo<SpriteBuildResult | null>(
    () => originalSources.length > 0 ? buildSpriteFromSources(originalSources) : null,
    [originalSources],
  );
  const formattedMarkup = result ? formatSvg(result.markup) : "";
  const formattedOriginalMarkup = originalResult ? formatSvg(originalResult.markup) : "";
  const diffLines = useMemo(
    () => createSvgDiff(formattedOriginalMarkup, formattedMarkup),
    [formattedMarkup, formattedOriginalMarkup],
  );
  const hasChanges = Boolean(result && originalResult) && formattedMarkup !== formattedOriginalMarkup;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const queuedSources = takeQueuedSpriteBuilderSources();

      if (queuedSources.length > 0) {
        setSources(queuedSources);
        setOriginalSources(queuedSources);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  async function loadFiles(files: FileList | null) {
    if (!files?.length) return;

    const nextSources = await Promise.all(
      Array.from(files)
        .filter((file) => file.name.toLowerCase().endsWith(".svg"))
        .map(async (file) => ({ filename: file.name, content: await file.text() })),
    );

    setSources(nextSources);
    setOriginalSources(nextSources);
    setActiveTab("preview");
  }

  function applyTool(tool: SpriteBuilderTool) {
    if (sources.length === 0) return;

    let changedSourceCount = 0;
    let failedSourceCount = 0;
    const nextSources = sources.map((source) => {
      try {
        if (tool.id === "clean") {
          const { content, report } = applySafeFixesWithReport(source.content);

          if (report.appliedCount === 0) return source;

          changedSourceCount += 1;
          return { ...source, content };
        }

        const result = applySafeFixForFindingId(source.content, tool.findingId ?? "");

        if (!result.changed) return source;

        changedSourceCount += 1;
        return { ...source, content: result.content };
      } catch {
        failedSourceCount += 1;
        return source;
      }
    });

    if (changedSourceCount > 0) {
      setSources(nextSources);
      setActiveTab("preview");
      showSuccessToast(`${tool.label} applied to ${changedSourceCount} ${changedSourceCount === 1 ? "icon" : "icons"}`);
    } else {
      showSuccessToast("No applicable changes found");
    }

    if (failedSourceCount > 0) {
      showWarningToast(
        "Some icons were skipped",
        `${failedSourceCount} ${failedSourceCount === 1 ? "icon could" : "icons could"} not be processed. Their original source was preserved.`,
      );
    }
  }

  function resetSources() {
    setSources(originalSources);
    setActiveTab("preview");
    showSuccessToast("Reset icon sources");
  }

  return (
    <div className="space-y-6 py-6">
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
          void loadFiles(event.dataTransfer.files);
        }}
        className={`rounded-2xl border border-dashed bg-[#111114] p-8 text-center transition-colors ${isDragging ? "border-[var(--brand)] bg-[var(--brand)]/5" : "border-white/15"}`}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept=".svg,image/svg+xml"
          multiple
          className="sr-only"
          onChange={(event) => {
            void loadFiles(event.target.files);
            event.target.value = "";
          }}
        />
        <Upload aria-hidden="true" className="mx-auto size-8 text-[var(--brand)]" />
        <p className="mt-3 text-sm font-medium text-zinc-200">Drop SVG icons here</p>
        <p className="mt-1 text-xs text-zinc-500">Multiple files supported. Files without a usable canvas are skipped.</p>
        <Button className="mt-5 bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)]" onClick={() => inputRef.current?.click()}>
          Browse icon files
        </Button>
      </section>

      {result ? (
        <section className="rounded-xl border border-white/10 bg-[#0d0d10] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-medium text-zinc-100">Generated sprite</h2>
              <p className="mt-1 text-xs text-zinc-500">{result.symbols.length} {result.symbols.length === 1 ? "symbol" : "symbols"} ready to export.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={!result.symbols.length} onClick={() => void copySvgWithFeedback({ svgMarkup: result.markup, successMessage: "Copied sprite" })}>
                <Copy className="size-3.5" />Copy
              </Button>
              <Button variant="outline" size="sm" disabled={!result.symbols.length} onClick={() => downloadSvgWithFeedback({ svgMarkup: result.markup, filename: "sprite.svg", successMessage: "Downloaded sprite" })}>
                <Download className="size-3.5" />Download
              </Button>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-y border-white/[0.06] py-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="inline-flex w-fit rounded-xl border border-white/[0.08] bg-black/10 p-1" role="tablist" aria-label="Generated sprite view">
              {(["preview", "svg", "diff"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-3 py-1.5 text-sm capitalize transition ${activeTab === tab ? "bg-white/[0.1] text-zinc-100" : "text-zinc-400 hover:text-zinc-200"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "preview" ? (
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-xl border border-white/[0.08] bg-black/10 p-1">
                  <Button type="button" variant="ghost" size="icon-sm" aria-label="Decrease preview size" title="Decrease preview size" disabled={previewScale <= 50} onClick={() => setPreviewScale((value) => Math.max(50, value - 25))}>
                    <Minus className="size-4" />
                  </Button>
                  <span className="min-w-14 text-center font-metric text-sm text-zinc-300">{previewScale}%</span>
                  <Button type="button" variant="ghost" size="icon-sm" aria-label="Increase preview size" title="Increase preview size" disabled={previewScale >= 200} onClick={() => setPreviewScale((value) => Math.min(200, value + 25))}>
                    <Plus className="size-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon-sm" aria-label="Fit symbol previews" title="Fit symbol previews" onClick={() => setPreviewScale(100)}>
                    <Maximize2 className="size-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon-sm" aria-label="Reset preview controls" title="Reset preview controls" onClick={() => { setPreviewScale(100); setPreviewBackground("light"); }}>
                    <RotateCcw className="size-4" />
                  </Button>
                </div>
                <div className="flex items-center rounded-xl border border-white/[0.08] bg-black/10 p-1" role="group" aria-label="Preview background">
                  {PREVIEW_BACKGROUNDS.map((option) => {
                    const Icon = option.icon;
                    const active = previewBackground === option.id;
                    return (
                      <Button key={option.id} type="button" variant="ghost" size="icon-sm" aria-label={option.label} title={option.label} aria-pressed={active} className={active ? "bg-white/[0.1] text-zinc-100" : "text-zinc-400"} onClick={() => setPreviewBackground(option.id)}>
                        <Icon className="size-4" />
                      </Button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-5 rounded-xl border border-white/[0.06] bg-[#0b0b0d] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Wrench className="size-4 text-[var(--brand)]" aria-hidden="true" />
                  <h3 className="text-sm font-medium text-zinc-100">Sprite tools</h3>
                </div>
                <p className="mt-1 text-xs text-zinc-500">Safe Workspace cleanup runs independently on each source icon before the sprite is generated.</p>
              </div>
              {hasChanges ? (
                <Button type="button" variant="outline" size="sm" onClick={resetSources}>
                  <RotateCcw className="size-3.5" />Reset sources
                </Button>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {SPRITE_BUILDER_TOOLS.map((tool) => (
                <Button key={tool.id} type="button" variant={tool.id === "clean" ? "default" : "outline"} size="sm" disabled={sources.length === 0} title={tool.description} className={tool.id === "clean" ? "bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)]" : undefined} onClick={() => applyTool(tool)}>
                  {tool.id === "clean" ? <Sparkles className="size-3.5" /> : null}
                  {tool.label}
                </Button>
              ))}
            </div>
          </div>

          {result.warnings.length ? (
            <div className="mt-4 rounded-lg border border-amber-400/20 bg-amber-400/5 p-3 text-xs leading-5 text-amber-100">
              {result.warnings.map((warning) => <p key={warning}>{warning}</p>)}
            </div>
          ) : null}

          {activeTab === "preview" ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {result.symbols.map((symbol) => (
                <article key={symbol.id} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="flex aspect-square items-center justify-center overflow-hidden rounded-md border border-white/[0.04] p-6" style={{ ...getPreviewCanvasStyle(previewBackground), color: getPreviewForegroundColor(previewBackground) }}>
                    <div aria-hidden="true" className="flex h-full w-full items-center justify-center [&>svg]:h-full [&>svg]:w-full [&>svg]:max-h-full [&>svg]:max-w-full" style={{ transform: `scale(${previewScale / 100})`, transition: "transform 150ms ease" }} dangerouslySetInnerHTML={{ __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${symbol.viewBox}" aria-hidden="true">${getSymbolChildrenMarkup(symbol.markup)}</svg>` }} />
                  </div>
                  <p className="mt-3 truncate text-sm text-zinc-200">{symbol.id}</p>
                  <p className="mt-1 font-metric text-xs text-zinc-500">{symbol.viewBox}</p>
                </article>
              ))}
            </div>
          ) : null}

          {activeTab === "svg" ? (
            <pre className="mt-5 max-h-[38rem] overflow-auto rounded-xl border border-white/[0.06] bg-black/20 p-4 font-metric text-xs leading-5 text-zinc-300"><code>{formattedMarkup}</code></pre>
          ) : null}

          {activeTab === "diff" ? (
            <div className="mt-5 max-h-[38rem] overflow-auto rounded-xl border border-white/[0.06] bg-black/20 font-metric text-xs leading-5">
              {hasChanges ? diffLines.map((line, index) => (
                <div key={`${line.kind}-${index}`} className={`grid grid-cols-[2rem_2rem_1rem_minmax(0,1fr)] gap-2 px-3 py-0.5 ${getDiffRowClass(line.kind)}`}>
                  <span className="text-right text-zinc-600">{line.originalLineNumber ?? ""}</span>
                  <span className="text-right text-zinc-600">{line.currentLineNumber ?? ""}</span>
                  <span>{getDiffMarker(line.kind)}</span>
                  <code className="whitespace-pre-wrap break-all">{line.text}</code>
                </div>
              )) : (
                <div className="px-4 py-10 text-center">
                  <CodeXml className="mx-auto size-5 text-zinc-600" aria-hidden="true" />
                  <p className="mt-3 text-sm text-zinc-300">No generated sprite changes yet.</p>
                  <p className="mt-1 text-xs text-zinc-500">Run a safe tool to inspect its source-level changes here.</p>
                </div>
              )}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
