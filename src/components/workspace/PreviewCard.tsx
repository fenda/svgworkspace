"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  Check,
  Copy,
  Download,
  Grid3X3,
  Maximize2,
  Minus,
  Moon,
  Plus,
  RotateCcw,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSvgWorkspace } from "@/hooks/use-svg-workspace";
import { copySvg } from "@/output/copy-svg";
import { downloadSvg } from "@/output/download-svg";
import { createSvgDiff } from "@/output/diff-svg";
import { formatSvg } from "@/output/format-svg";
import {
  getAutomaticPreviewBackground,
  type PreviewBackground,
} from "@/lib/svg/preview-background";
import { showSuccessToast } from "@/stores/toast-store";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type PreviewTab = "preview" | "svg" | "diff";

const PREVIEW_BACKGROUND_STORAGE_KEY = "svg-workspace.preview-background";
const MIN_ZOOM = 25;
const MAX_ZOOM = 3200;
const DEFAULT_INTRINSIC_SIZE = { width: 24, height: 24 };

const ZOOM_STEPS = [
  25, 50, 75, 100, 125, 150, 200, 300, 400, 600, 800, 1200, 1600, 2400, 3200,
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
    id: "checkerboard",
    tooltip: "Checkerboard canvas background",
    icon: Grid3X3,
  },
  {
    id: "white",
    tooltip: "White canvas background",
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
    case "checkerboard":
      return {
        backgroundImage:
          "linear-gradient(45deg, #1a1a1e 25%, transparent 25%), linear-gradient(-45deg, #1a1a1e 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a1e 75%), linear-gradient(-45deg, transparent 75%, #1a1a1e 75%)",
        backgroundSize: "16px 16px",
        backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
        backgroundColor: "#141418",
      };
    case "white":
      return {
        backgroundColor: "#f7f7f8",
      };
    case "dark":
      return {
        backgroundColor: "#09090b",
      };
  }
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

export function PreviewCard() {
  const { document, source } = useSvgWorkspace();
  const [activeTab, setActiveTab] = useState<PreviewTab>("preview");
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">("idle");
  const [background, setBackground] = useState<PreviewBackground>(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    const storedBackground = window.localStorage.getItem(
      PREVIEW_BACKGROUND_STORAGE_KEY,
    );

    if (
      storedBackground === "checkerboard" ||
      storedBackground === "white" ||
      storedBackground === "dark"
    ) {
      return storedBackground;
    }

    return "dark";
  });
  const [hasManualBackgroundSelection, setHasManualBackgroundSelection] =
    useState(() => {
      if (typeof window === "undefined") {
        return false;
      }

      const storedBackground = window.localStorage.getItem(
        PREVIEW_BACKGROUND_STORAGE_KEY,
      );

      return (
        storedBackground === "checkerboard" ||
        storedBackground === "white" ||
        storedBackground === "dark"
      );
    });
  const [zoomPercent, setZoomPercent] = useState(100);
  const [fitZoomPercent, setFitZoomPercent] = useState(100);
  const [isFitMode, setIsFitMode] = useState(true);
  const hasTrackedDiffViewRef = useRef(false);
  const previewViewportRef = useRef<HTMLDivElement>(null);
  const lastMeasuredContentRef = useRef<string | null>(null);
  const lastAutomaticBackgroundKeyRef = useRef<string | null>(null);
  const content = document?.content ?? "";
  const intrinsicSize = getIntrinsicSvgSize(content);

  useEffect(() => {
    if (typeof window === "undefined" || !hasManualBackgroundSelection) {
      return;
    }

    window.localStorage.setItem(PREVIEW_BACKGROUND_STORAGE_KEY, background);
  }, [background, hasManualBackgroundSelection]);

  useEffect(() => {
    if (!document || hasManualBackgroundSelection) {
      return;
    }

    const automaticBackgroundKey = `${source ?? "unknown"}:${document.filename}:${document.originalContent}`;

    if (lastAutomaticBackgroundKeyRef.current === automaticBackgroundKey) {
      return;
    }

    lastAutomaticBackgroundKeyRef.current = automaticBackgroundKey;
    setBackground(getAutomaticPreviewBackground(document.originalContent));
  }, [
    document,
    hasManualBackgroundSelection,
    source,
  ]);

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

      if (isNewContent) {
        setIsFitMode(true);
        setZoomPercent(nextFitZoom);
        return;
      }

      if (isFitMode) {
        setZoomPercent(nextFitZoom);
      }
    };

    updateFitZoom();

    const observer = new ResizeObserver(updateFitZoom);
    observer.observe(viewport);

    return () => observer.disconnect();
  }, [activeTab, content, intrinsicSize.height, intrinsicSize.width, isFitMode]);

  if (!document) {
    return null;
  }

  const { filename, originalContent } = document;
  const formattedCurrent = formatSvg(content);
  const formattedOriginal = formatSvg(originalContent);
  const diffLines = createSvgDiff(formattedOriginal, formattedCurrent);
  const hasChanges = formattedOriginal !== formattedCurrent;
  const activeTabPanelId = `preview-tab-panel-${activeTab}`;
  let tabContent: ReactNode;

  async function handleCopy() {
    try {
      await copySvg(formattedCurrent);
      setCopyState("success");
      showSuccessToast("Copied");
      trackAnalyticsEvent("copy_clicked");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 2200);
    }
  }

  if (activeTab === "preview") {
    tabContent = (
      <div className="p-4">
        <div
          className="mx-auto flex aspect-[16/10] w-full max-w-[560px] items-center justify-center rounded-xl border border-white/[0.06] bg-[#0b0b0d] p-3"
        >
          <div
            ref={previewViewportRef}
            className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border border-white/[0.05] transition-colors duration-150"
            style={getPreviewCanvasStyle(background)}
          >
            <div
              className="flex items-center justify-center transition-[width,height] duration-200 ease-out"
              style={{
                width: `${(intrinsicSize.width * zoomPercent) / 100}px`,
                height: `${(intrinsicSize.height * zoomPercent) / 100}px`,
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
            <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02] p-1">
              <ControlTooltip label="Zoom out">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  title="Zoom out"
                  aria-label="Zoom out"
                  disabled={zoomPercent <= MIN_ZOOM}
                  className="text-zinc-300 transition-colors duration-150 hover:bg-white/5 hover:text-zinc-100 disabled:text-zinc-600"
                  onClick={() => {
                    setIsFitMode(false);
                    setZoomPercent((current) => getNextZoom(current, "out"));
                  }}
                >
                  <Minus className="size-3.5" />
                </Button>
              </ControlTooltip>
              <span className="font-metric min-w-[4.5rem] rounded-md px-2 text-center text-xs text-zinc-200">
                {zoomPercent}%
              </span>
              <ControlTooltip label="Zoom in">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  title="Zoom in"
                  aria-label="Zoom in"
                  disabled={zoomPercent >= MAX_ZOOM}
                  className="text-zinc-300 transition-colors duration-150 hover:bg-white/5 hover:text-zinc-100 disabled:text-zinc-600"
                  onClick={() => {
                    setIsFitMode(false);
                    setZoomPercent((current) => getNextZoom(current, "in"));
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
                  disabled={zoomPercent === fitZoomPercent && isFitMode}
                  className="text-zinc-300 transition-colors duration-150 hover:bg-white/5 hover:text-zinc-100 disabled:text-zinc-600"
                  onClick={() => {
                    setIsFitMode(true);
                    setZoomPercent(fitZoomPercent);
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
                  disabled={zoomPercent === 100 && !isFitMode}
                  className="text-zinc-300 transition-colors duration-150 hover:bg-white/5 hover:text-zinc-100 disabled:text-zinc-600"
                  onClick={() => {
                    setIsFitMode(false);
                    setZoomPercent(100);
                  }}
                >
                  <RotateCcw className="size-3.5" />
                </Button>
              </ControlTooltip>
            </div>

            <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02] p-1">
              {backgroundOptions.map((option) => {
                const Icon = option.icon;
                const isActive = background === option.id;

                return (
                  <ControlTooltip key={option.id} label={option.tooltip}>
                    <button
                      type="button"
                      title={option.tooltip}
                      aria-label={option.tooltip}
                      onClick={() => {
                        setHasManualBackgroundSelection(true);
                        setBackground(option.id);
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
              downloadSvg(formattedCurrent, filename);
              showSuccessToast("Downloaded");
              trackAnalyticsEvent("download_clicked");
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
