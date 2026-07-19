"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  Check,
  Copy,
  Download,
  FileDown,
  Files,
  Grid3X3,
  Maximize2,
  Minus,
  Moon,
  Search,
  Plus,
  RotateCcw,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSvgWorkspace } from "@/hooks/use-svg-workspace";
import { createSvgDiff } from "@/output/diff-svg";
import { formatSvg } from "@/output/format-svg";
import {
  copySvgWithFeedback,
  downloadSvgWithFeedback,
} from "@/output/perform-svg-export";
import { trackAnalyticsEvent } from "@/lib/analytics";
import {
  getSharedResourceUsageSummary,
  getStandaloneSpriteSymbol,
  matchesSpriteSymbolSearch,
  sortSpriteSymbols,
  type SvgSymbolPreview,
} from "@/lib/svg";
import {
  type PreviewBackground,
} from "@/lib/svg/preview-background";
import { cn } from "@/lib/utils";

type PreviewTab = "preview" | "svg" | "diff";
const MIN_ZOOM = 25;
const MAX_ZOOM = 3200;
const DEFAULT_INTRINSIC_SIZE = { width: 24, height: 24 };

const ZOOM_STEPS = [
  25, 50, 75, 100, 125, 150, 200, 300, 400, 600, 800, 1200, 1600, 2400, 3200,
] as const;
const EMPTY_SYMBOLS: SvgSymbolPreview[] = [];

const SPRITE_SORT_OPTIONS = [
  { value: "original", label: "Original order" },
  { value: "alphabetical", label: "Alphabetical" },
  { value: "recent", label: "Recently selected" },
] as const;

const previewTabs: {
  id: PreviewTab;
  label: string;
  tooltip: string;
}[] = [
  { id: "preview", label: "Preview", tooltip: "View the current SVG on the preview canvas" },
  { id: "svg", label: "SVG", tooltip: "Inspect the formatted current SVG markup" },
  { id: "diff", label: "Diff", tooltip: "Compare the original SVG against the current SVG" },
];

const backgroundOptions: {
  id: PreviewBackground;
  tooltip: string;
  icon: typeof Grid3X3;
}[] = [
  {
    id: "transparent",
    tooltip: "Transparent canvas background",
    icon: Grid3X3,
  },
  {
    id: "checkerboard",
    tooltip: "Checkerboard canvas background",
    icon: Grid3X3,
  },
  {
    id: "light",
    tooltip: "Light canvas background",
    icon: Sun,
  },
  {
    id: "dark",
    tooltip: "Dark canvas background",
    icon: Moon,
  },
] as const;

function getDiffRowClass(kind: "context" | "added" | "removed"): string {
  switch (kind) {
    case "added":
      return "bg-emerald-500/[0.08] text-emerald-200";
    case "removed":
      return "bg-red-500/[0.08] text-red-200";
    case "context":
      return "text-zinc-400";
  }
}

function getDiffMarker(kind: "context" | "added" | "removed"): string {
  switch (kind) {
    case "added":
      return "+";
    case "removed":
      return "-";
    case "context":
      return " ";
  }
}

function parseSvgLength(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const numericValue = Number.parseFloat(value);

  return Number.isFinite(numericValue) && numericValue > 0
    ? numericValue
    : null;
}

function getIntrinsicSvgSize(markup: string): { width: number; height: number } {
  if (typeof window === "undefined") {
    return DEFAULT_INTRINSIC_SIZE;
  }

  const parser = new window.DOMParser();
  const svgDocument = parser.parseFromString(markup, "image/svg+xml");
  const svg = svgDocument.documentElement;
  const viewBox = svg.getAttribute("viewBox");

  if (viewBox) {
    const parts = viewBox.trim().split(/[\s,]+/).map(Number);

    if (
      parts.length === 4 &&
      Number.isFinite(parts[2]) &&
      Number.isFinite(parts[3]) &&
      parts[2] > 0 &&
      parts[3] > 0
    ) {
      return { width: parts[2], height: parts[3] };
    }
  }

  const width = parseSvgLength(svg.getAttribute("width"));
  const height = parseSvgLength(svg.getAttribute("height"));

  if (width && height) {
    return { width, height };
  }

  return DEFAULT_INTRINSIC_SIZE;
}

function getPreviewCanvasStyle(background: PreviewBackground): CSSProperties {
  switch (background) {
    case "transparent":
      return {
        backgroundColor: "transparent",
      };
    case "checkerboard":
      return {
        backgroundImage:
          "linear-gradient(45deg, #1a1a1e 25%, transparent 25%), linear-gradient(-45deg, #1a1a1e 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a1e 75%), linear-gradient(-45deg, transparent 75%, #1a1a1e 75%)",
        backgroundSize: "16px 16px",
        backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
        backgroundColor: "#141418",
      };
    case "light":
      return {
        backgroundColor: "#f7f7f8",
      };
    case "dark":
      return {
        backgroundColor: "#09090b",
      };
  }
}

function getPreviewForegroundColor(background: PreviewBackground): string {
  return background === "light" ? "#111827" : "#f5f5f5";
}

function getNextZoom(value: number, direction: "in" | "out"): number {
  if (direction === "in") {
    return ZOOM_STEPS.find((step) => step > value) ?? value;
  }

  return [...ZOOM_STEPS].reverse().find((step) => step < value) ?? value;
}

function ControlTooltip({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="group/tooltip relative flex">
      {children}
      <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 rounded-md border border-white/[0.08] bg-[#050507] px-2 py-1 text-[10px] font-medium whitespace-nowrap text-zinc-300 opacity-0 shadow-lg transition-opacity duration-150 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100">
        {label}
      </span>
    </div>
  );
}

function getSymbolDisplayName(symbol: SvgSymbolPreview): string {
  return symbol.id?.trim() || "Unnamed symbol";
}

function formatBooleanFact(value: boolean): string {
  return value ? "Yes" : "No";
}

export function PreviewCard() {
  const {
    document,
    selectedSymbolKey,
    spriteSearchQuery,
    spriteSortMode,
    recentlySelectedSymbolKeys,
    previewBackground,
    previewSizeMode,
    previewSizeValue,
    setSelectedSymbolKey,
    setSpriteSearchQuery,
    setSpriteSortMode,
    setPreviewBackground,
    setPreviewSizeCustom,
    setPreviewSize,
  } = useSvgWorkspace();
  const [activeTab, setActiveTab] = useState<PreviewTab>("preview");
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">("idle");
  const [zoomPercent, setZoomPercent] = useState(100);
  const [fitZoomPercent, setFitZoomPercent] = useState(100);
  const hasTrackedDiffViewRef = useRef(false);
  const previewViewportRef = useRef<HTMLDivElement>(null);
  const lastMeasuredContentRef = useRef<string | null>(null);
  const content = document?.content ?? "";
  const intrinsicSize = getIntrinsicSvgSize(content);

  useEffect(() => {
    if (activeTab === "diff" && !hasTrackedDiffViewRef.current) {
      hasTrackedDiffViewRef.current = true;
      trackAnalyticsEvent("diff_viewed");
      return;
    }

    if (activeTab !== "diff") {
      hasTrackedDiffViewRef.current = false;
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "preview") {
      return;
    }

    const viewport = previewViewportRef.current;

    if (!viewport) {
      return;
    }

    const updateFitZoom = () => {
      const widthRatio = viewport.clientWidth / intrinsicSize.width;
      const heightRatio = viewport.clientHeight / intrinsicSize.height;
      const nextFitZoom = Math.max(
        MIN_ZOOM,
        Math.min(MAX_ZOOM, Math.floor(Math.min(widthRatio, heightRatio) * 100)),
      );
      const isNewContent = lastMeasuredContentRef.current !== content;

      if (isNewContent) {
        lastMeasuredContentRef.current = content;
      }

      setFitZoomPercent(nextFitZoom);

      if (isNewContent && previewSizeMode === "custom") {
        setZoomPercent(nextFitZoom);
      }
    };

    updateFitZoom();

    const observer = new ResizeObserver(updateFitZoom);
    observer.observe(viewport);

    return () => observer.disconnect();
  }, [activeTab, content, intrinsicSize.height, intrinsicSize.width, previewSizeMode]);

  const filename = document?.filename ?? "optimized.svg";
  const originalContent = document?.originalContent ?? "";
  const symbols = document?.symbols ?? EMPTY_SYMBOLS;
  const hasSymbols = symbols.length > 0;
  const spriteResources = document?.spriteResources ?? null;
  const formattedCurrent = document ? formatSvg(content) : "";
  const formattedOriginal = document ? formatSvg(originalContent) : "";
  const diffLines = document
    ? createSvgDiff(formattedOriginal, formattedCurrent)
    : [];
  const hasChanges = formattedOriginal !== formattedCurrent;
  const filteredSymbols = useMemo(() => {
    return symbols.filter((symbol) =>
      matchesSpriteSymbolSearch(symbol, spriteSearchQuery),
    );
  }, [symbols, spriteSearchQuery]);
  const sortedSymbols = useMemo(() => {
    return sortSpriteSymbols(
      filteredSymbols,
      spriteSortMode,
      recentlySelectedSymbolKeys,
    );
  }, [filteredSymbols, recentlySelectedSymbolKeys, spriteSortMode]);
  const selectedSymbol = useMemo(() => {
    return (
      symbols.find((symbol) => symbol.key === selectedSymbolKey) ?? null
    );
  }, [selectedSymbolKey, symbols]);
  const selectedSymbolExport = useMemo(() => {
    return selectedSymbol
      ? getStandaloneSpriteSymbol(selectedSymbol, spriteResources)
      : null;
  }, [selectedSymbol, spriteResources]);
  const selectedSymbolSharedUsage = selectedSymbol
    ? getSharedResourceUsageSummary(selectedSymbol)
    : [];
  const fixedPreviewZoom =
    previewSizeMode === "fixed" && previewSizeValue
      ? Math.max(
          MIN_ZOOM,
          Math.min(
            MAX_ZOOM,
            Math.round(
              (previewSizeValue / Math.max(intrinsicSize.width, intrinsicSize.height)) * 100,
            ),
          ),
        )
      : null;
  const effectiveZoomPercent =
    previewSizeMode === "fit"
      ? fitZoomPercent
      : fixedPreviewZoom ?? zoomPercent;

  if (!document) {
    return null;
  }

  const activeTabPanelId = `preview-tab-panel-${activeTab}`;
  let tabContent: ReactNode;

  async function handleCopy() {
    try {
      await copySvgWithFeedback({
        svgMarkup: formattedCurrent,
        successMessage: "Copied",
      });
      setCopyState("success");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 2200);
    }
  }

  async function handleCopyWithToast(
    svgMarkup: string,
    successMessage: string,
    warnings: string[] = [],
  ) {
    await copySvgWithFeedback({ svgMarkup, successMessage, warnings });
  }

  function handleDownloadWithToast(
    svgMarkup: string,
    downloadName: string,
    successMessage: string,
    warnings: string[] = [],
  ) {
    downloadSvgWithFeedback({
      svgMarkup,
      filename: downloadName,
      successMessage,
      warnings,
    });
  }

  if (activeTab === "preview") {
    tabContent = hasSymbols ? (
      <div className="p-4">
        <div className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-zinc-100">Sprite Explorer</p>
              <p className="mt-1 text-xs text-zinc-400">
                {symbols.length} {symbols.length === 1 ? "symbol" : "symbols"}
              </p>
            </div>
            <p className="text-xs text-zinc-500">
              Symbols are rendered independently from the root SVG.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-[#0b0b0d] p-3 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative block flex-1">
              <span className="sr-only">Search symbols</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="search"
                value={spriteSearchQuery}
                onChange={(event) => setSpriteSearchQuery(event.target.value)}
                placeholder="Search ID, title, or description"
                aria-label="Search sprite symbols"
                className="h-10 w-full rounded-lg border border-white/[0.08] bg-white/[0.02] pl-9 pr-3 text-sm text-zinc-200 outline-none transition focus:border-white/[0.14]"
              />
            </label>

            <label className="flex items-center gap-2 text-xs text-zinc-400">
              <span>Sort</span>
              <select
                value={spriteSortMode}
                aria-label="Sort sprite symbols"
                onChange={(event) =>
                  setSpriteSortMode(
                    event.target.value as (typeof SPRITE_SORT_OPTIONS)[number]["value"],
                  )
                }
                className="h-10 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 text-sm text-zinc-200 outline-none transition focus:border-white/[0.14]"
              >
                {SPRITE_SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {sortedSymbols.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {sortedSymbols.map((symbol) => {
                const isSelected = symbol.key === selectedSymbolKey;

                return (
                  <button
                    key={symbol.key}
                    type="button"
                    onClick={() => setSelectedSymbolKey(symbol.key)}
                    className={cn(
                      "rounded-xl border bg-[#0b0b0d] p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-white/20",
                      isSelected
                        ? "border-white/[0.18] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
                        : "border-white/[0.06] hover:border-white/[0.12]",
                    )}
                  >
                    <div
                      className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-white/[0.05] p-3 transition-colors duration-150"
                      style={{
                        ...getPreviewCanvasStyle(previewBackground),
                        color: getPreviewForegroundColor(previewBackground),
                      }}
                    >
                      {symbol.previewMarkup ? (
                        <div
                          aria-hidden="true"
                          className="flex h-full w-full items-center justify-center [&>svg]:h-full [&>svg]:w-full [&>svg]:max-h-full [&>svg]:max-w-full"
                          dangerouslySetInnerHTML={{ __html: symbol.previewMarkup }}
                        />
                      ) : (
                        <p className="max-w-[14rem] text-center text-xs leading-5 text-zinc-400">
                          {symbol.previewUnavailableReason}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-medium text-zinc-200">
                          {getSymbolDisplayName(symbol)}
                        </p>
                        {isSelected ? (
                          <span className="shrink-0 rounded-full border border-white/[0.1] bg-white/[0.06] px-2 py-0.5 text-[10px] uppercase tracking-wider text-zinc-200">
                            Selected
                          </span>
                        ) : null}
                      </div>
                      <p className="font-metric text-xs text-zinc-500">
                        {symbol.viewBox ?? "No viewBox"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/[0.08] bg-[#0b0b0d] px-4 py-8 text-center">
              <p className="text-sm text-zinc-300">No symbols match the current search.</p>
              <p className="mt-1 text-xs text-zinc-500">Try a different ID, title, or description.</p>
            </div>
          )}

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
            <section className="rounded-xl border border-white/[0.06] bg-[#0b0b0d] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-zinc-100">Symbol Details</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Factual parser information for the selected symbol.
                  </p>
                </div>
              </div>

              {selectedSymbol ? (
                <div className="mt-4 space-y-4">
                  <div
                    className="flex aspect-[16/10] items-center justify-center overflow-hidden rounded-xl border border-white/[0.05] p-4"
                    style={{
                      ...getPreviewCanvasStyle(previewBackground),
                      color: getPreviewForegroundColor(previewBackground),
                    }}
                  >
                    {selectedSymbol.previewMarkup ? (
                      <div
                        aria-hidden="true"
                        className="flex h-full w-full items-center justify-center [&>svg]:h-full [&>svg]:w-full [&>svg]:max-h-full [&>svg]:max-w-full"
                        dangerouslySetInnerHTML={{ __html: selectedSymbol.previewMarkup }}
                      />
                    ) : (
                      <p className="max-w-xs text-center text-sm leading-6 text-zinc-400">
                        {selectedSymbol.previewUnavailableReason}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
                    {[
                      ["ID", getSymbolDisplayName(selectedSymbol)],
                      ["ViewBox", selectedSymbol.viewBox ?? "None"],
                      ["Estimated size", selectedSymbol.estimatedDimensions ?? "Unavailable"],
                      ["Paths", String(selectedSymbol.elementCounts.paths)],
                      ["Groups", String(selectedSymbol.elementCounts.groups)],
                      ["Circles", String(selectedSymbol.elementCounts.circles)],
                      ["Rectangles", String(selectedSymbol.elementCounts.rects)],
                      ["Polygons", String(selectedSymbol.elementCounts.polygons)],
                      ["Lines", String(selectedSymbol.elementCounts.lines)],
                      ["Text", String(selectedSymbol.elementCounts.text)],
                      ["Defs", String(selectedSymbol.elementCounts.defs)],
                      ["Style usage", formatBooleanFact(selectedSymbol.hasStyleUsage || selectedSymbol.hasSharedStyleUsage)],
                      ["Title", selectedSymbol.title ?? "None"],
                      ["Description", selectedSymbol.desc ?? "None"],
                      ["Shared defs", formatBooleanFact(selectedSymbol.hasSharedDefinitionReferences)],
                      ["Gradients", formatBooleanFact(selectedSymbol.usesGradients)],
                      ["Clip paths", formatBooleanFact(selectedSymbol.usesClipPaths)],
                      ["Masks", formatBooleanFact(selectedSymbol.usesMasks)],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-lg border border-white/[0.06] bg-black/10 px-3 py-2.5">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</p>
                        <p className="mt-1 text-sm text-zinc-200 break-words">{value}</p>
                      </div>
                    ))}
                  </div>

                  {selectedSymbolSharedUsage.length > 0 ? (
                    <div className="rounded-lg border border-white/[0.06] bg-black/10 px-3 py-2.5">
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500">Shared resources</p>
                      <p className="mt-1 text-sm text-zinc-300">
                        {selectedSymbolSharedUsage.join(", ")}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-white/[0.08] bg-black/10 px-4 py-8 text-center">
                  <p className="text-sm text-zinc-300">Select a symbol to inspect it.</p>
                  <p className="mt-1 text-xs text-zinc-500">Selection survives tab switches and optimization when the symbol still exists.</p>
                </div>
              )}
            </section>

            <section className="rounded-xl border border-white/[0.06] bg-[#0b0b0d] p-4">
              <div>
                <p className="text-sm font-medium text-zinc-100">Export</p>
                <p className="mt-1 text-xs text-zinc-500">
                  Copy or download the original sprite, the current sprite, or the selected symbol.
                </p>
              </div>

              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">Sprite</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="justify-start border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05]"
                      onClick={() => void handleCopyWithToast(originalContent, "Copied original sprite")}
                    >
                      <Files className="size-3.5" />
                      Copy original sprite
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="justify-start border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05]"
                      onClick={() => handleDownloadWithToast(originalContent, filename, "Downloaded original sprite")}
                    >
                      <FileDown className="size-3.5" />
                      Download original sprite
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!hasChanges}
                      className="justify-start border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05] disabled:text-zinc-600"
                      onClick={() => void handleCopyWithToast(content, "Copied optimized sprite")}
                    >
                      <Files className="size-3.5" />
                      Copy optimized sprite
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!hasChanges}
                      className="justify-start border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05] disabled:text-zinc-600"
                      onClick={() => handleDownloadWithToast(content, filename, "Downloaded optimized sprite")}
                    >
                      <FileDown className="size-3.5" />
                      Download optimized sprite
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">Selected symbol</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!selectedSymbolExport?.markup}
                      className="justify-start border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05] disabled:text-zinc-600"
                      onClick={() => {
                        if (!selectedSymbolExport?.markup) {
                          return;
                        }

                        void handleCopyWithToast(
                          selectedSymbolExport.markup,
                          "Copied symbol",
                          selectedSymbolExport.warnings,
                        );
                      }}
                    >
                      <Copy className="size-3.5" />
                      Copy selected symbol
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!selectedSymbolExport?.markup}
                      className="justify-start border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05] disabled:text-zinc-600"
                      onClick={() => {
                        if (!selectedSymbolExport?.markup) {
                          return;
                        }

                        handleDownloadWithToast(
                          selectedSymbolExport.markup,
                          selectedSymbolExport.filename,
                          "Downloaded symbol",
                          selectedSymbolExport.warnings,
                        );
                      }}
                    >
                      <Download className="size-3.5" />
                      Download selected symbol
                    </Button>
                  </div>

                  {selectedSymbol ? (
                    <div className="rounded-lg border border-white/[0.06] bg-black/10 px-3 py-2.5">
                      <p className="text-xs text-zinc-300">
                        {selectedSymbolExport?.markup
                          ? `Exports ${getSymbolDisplayName(selectedSymbol)} as a standalone SVG.`
                          : "This symbol does not have enough information to export as a standalone SVG yet."}
                      </p>
                      {selectedSymbolExport?.warnings.length ? (
                        <p className="mt-1 text-xs leading-5 text-amber-300">
                          {selectedSymbolExport.warnings[0]}
                        </p>
                      ) : (
                        <p className="mt-1 text-xs leading-5 text-zinc-500">
                          Shared defs and root styles are included only when the selected symbol references them.
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500">
                      Select a symbol to enable standalone export.
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    ) : (
      <div className="p-4">
        <div
          className="mx-auto flex aspect-[16/10] w-full max-w-[560px] items-center justify-center rounded-xl border border-white/[0.06] bg-[#0b0b0d] p-3"
        >
          <div
            ref={previewViewportRef}
            className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border border-white/[0.05] transition-colors duration-150"
            style={getPreviewCanvasStyle(previewBackground)}
          >
            <div
              className="flex items-center justify-center transition-[width,height] duration-200 ease-out"
              style={{
                width: `${(intrinsicSize.width * effectiveZoomPercent) / 100}px`,
                height: `${(intrinsicSize.height * effectiveZoomPercent) / 100}px`,
              }}
            >
              <div
                className="flex h-full w-full cursor-default items-center justify-center [&>svg]:h-full [&>svg]:w-full"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  } else if (activeTab === "svg") {
    tabContent = (
      <div className="p-4">
        <div className="mx-auto w-full max-w-[560px] aspect-[16/10] overflow-hidden bg-[#111114]">
          <pre className="h-full overflow-auto p-4 text-xs leading-5 text-zinc-300">
            <code className="font-metric whitespace-pre-wrap break-all">{formattedCurrent}</code>
          </pre>
        </div>
      </div>
    );
  } else {
    tabContent = (
      <div className="p-4">
        <div className="mx-auto w-full max-w-[560px] aspect-[16/10] overflow-hidden bg-[#111114]">
          {hasChanges ? (
            <pre className="h-full overflow-auto p-4 text-xs leading-5">
              <code className="font-metric block">
                {diffLines.map((line, index) => (
                  <span
                    key={`${line.kind}-${index}-${line.text}`}
                    className={cn(
                      "grid grid-cols-[14px_minmax(0,1fr)] gap-2 px-2",
                      getDiffRowClass(line.kind),
                    )}
                  >
                    <span>{getDiffMarker(line.kind)}</span>
                    <span className="whitespace-pre-wrap break-all">{line.text}</span>
                  </span>
                ))}
              </code>
            </pre>
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center">
              <p className="max-w-xs text-sm text-zinc-400">
                No changes yet. Optimize SVG to compare output.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0d0d10] transition-colors duration-150 hover:border-white/[0.14] lg:min-h-[520px]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div
          role="tablist"
          aria-label="Preview panel views"
          className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02] p-1"
        >
          {previewTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`preview-tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`preview-tab-panel-${tab.id}`}
              title={tab.tooltip}
              aria-label={tab.tooltip}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-white/[0.08] text-zinc-100"
                  : "text-zinc-300 hover:text-zinc-100",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === "preview" ? (
          <div className="flex flex-wrap items-center justify-end gap-2">
            {!hasSymbols ? (
              <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02] p-1">
                <ControlTooltip label="Zoom out">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    title="Zoom out"
                    aria-label="Zoom out"
                    disabled={effectiveZoomPercent <= MIN_ZOOM}
                    className="text-zinc-300 transition-colors duration-150 hover:bg-white/5 hover:text-zinc-100 disabled:text-zinc-600"
                    onClick={() => {
                      setZoomPercent(() => {
                        const nextZoom = getNextZoom(effectiveZoomPercent, "out");
                        const longestSide = Math.max(intrinsicSize.width, intrinsicSize.height);
                        setPreviewSizeCustom((longestSide * nextZoom) / 100);
                        return nextZoom;
                      });
                    }}
                  >
                    <Minus className="size-3.5" />
                  </Button>
                </ControlTooltip>
                <span className="font-metric min-w-[4.5rem] rounded-md px-2 text-center text-xs text-zinc-200">
                  {effectiveZoomPercent}%
                </span>
                <ControlTooltip label="Zoom in">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    title="Zoom in"
                    aria-label="Zoom in"
                    disabled={effectiveZoomPercent >= MAX_ZOOM}
                    className="text-zinc-300 transition-colors duration-150 hover:bg-white/5 hover:text-zinc-100 disabled:text-zinc-600"
                    onClick={() => {
                      setZoomPercent(() => {
                        const nextZoom = getNextZoom(effectiveZoomPercent, "in");
                        const longestSide = Math.max(intrinsicSize.width, intrinsicSize.height);
                        setPreviewSizeCustom((longestSide * nextZoom) / 100);
                        return nextZoom;
                      });
                    }}
                  >
                    <Plus className="size-3.5" />
                  </Button>
                </ControlTooltip>
                <ControlTooltip label="Fit to canvas">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    title="Fit to canvas"
                    aria-label="Fit to canvas"
                    disabled={previewSizeMode === "fit"}
                    className="text-zinc-300 transition-colors duration-150 hover:bg-white/5 hover:text-zinc-100 disabled:text-zinc-600"
                    onClick={() => {
                      setPreviewSize(null);
                    }}
                  >
                    <Maximize2 className="size-3.5" />
                  </Button>
                </ControlTooltip>
                <ControlTooltip label="Reset to 100%">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    title="Reset to 100%"
                    aria-label="Reset zoom to 100 percent"
                    disabled={previewSizeMode === "custom" && zoomPercent === 100}
                    className="text-zinc-300 transition-colors duration-150 hover:bg-white/5 hover:text-zinc-100 disabled:text-zinc-600"
                    onClick={() => {
                      setZoomPercent(100);
                      const longestSide = Math.max(intrinsicSize.width, intrinsicSize.height);
                      setPreviewSizeCustom(longestSide);
                    }}
                  >
                    <RotateCcw className="size-3.5" />
                  </Button>
                </ControlTooltip>
              </div>
            ) : null}

            <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02] p-1">
              {backgroundOptions.map((option) => {
                const Icon = option.icon;
                const isActive = previewBackground === option.id;

                return (
                  <ControlTooltip key={option.id} label={option.tooltip}>
                    <button
                      type="button"
                      title={option.tooltip}
                      aria-label={option.tooltip}
                      onClick={() => {
                        setPreviewBackground(option.id);
                      }}
                      className={cn(
                        "flex size-7 items-center justify-center rounded-md text-[11px] font-medium transition-colors duration-150",
                        isActive
                          ? "bg-white/[0.08] text-zinc-100"
                          : "text-zinc-300 hover:bg-white/5 hover:text-zinc-100",
                      )}
                    >
                      <Icon className="size-3.5" />
                    </button>
                  </ControlTooltip>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            title="Copy the current formatted SVG"
            aria-label="Copy the current formatted SVG"
            className="border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05]"
            onClick={() => void handleCopy()}
          >
            {copyState === "success" ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            Copy
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            title="Download the current formatted SVG"
            aria-label="Download the current formatted SVG"
            className="border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05]"
            onClick={() => {
              downloadSvgWithFeedback({
                svgMarkup: formattedCurrent,
                filename,
                successMessage: "Downloaded",
              });
            }}
          >
            <Download className="size-3.5" />
            Download
          </Button>
        </div>
        <p className="min-w-0 truncate text-xs text-zinc-300">
          {filename}
        </p>
        {copyState === "error" ? (
          <p className="text-xs text-amber-400">Copy failed</p>
        ) : null}
      </div>

      <div
        id={activeTabPanelId}
        role="tabpanel"
        aria-labelledby={`preview-tab-${activeTab}`}
      >
        {tabContent}
      </div>
    </div>
  );
}
