"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Redo2, RotateCcw, Undo2 } from "lucide-react";
import {
  getIconWorkspaceTransformationApplicability,
  getIconWorkspaceTransformationStates,
  isIconWorkspaceEligible,
} from "@/actions/icon-workspace";
import { Button } from "@/components/ui/button";
import { useSvgWorkspace } from "@/hooks/use-svg-workspace";
import {
  areViewBoxesEqual,
  calculateLockedOutputSize,
  detectUniformPadding,
  formatGeometryNumber,
  formatViewBox,
  getViewBoxDelta,
  normalizeToSquareCanvas,
  validateCustomViewBox,
  type ParsedViewBox,
  type PreviewBackground,
  type SvgGeometryInfo,
} from "@/lib/svg";
import { cn } from "@/lib/utils";

const BACKGROUND_OPTIONS: Array<{ id: PreviewBackground; label: string }> = [
  { id: "transparent", label: "Transparent" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "checkerboard", label: "Checkerboard" },
];

const PADDING_OPTIONS = [0, 2, 4, 8, 12, 16, 24, 32] as const;
const SIZE_OPTIONS = [16, 20, 24, 32, 48, 64] as const;

type OutputDraft = {
  width: string;
  height: string;
};

type ViewBoxDraft = {
  minX: string;
  minY: string;
  width: string;
  height: string;
};

function WorkspaceGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-3">
      <p className="text-[10px] uppercase tracking-wider text-zinc-400">
        {title}
      </p>
      <div className="mt-3 space-y-3">
        {children}
      </div>
    </section>
  );
}

function TransformationButton({
  id,
  label,
  description,
  applicable,
  reason,
  disabled,
  onClick,
}: {
  id: string;
  label: string;
  description: string;
  applicable: boolean;
  reason?: string;
  disabled: boolean;
  onClick: () => void;
}) {
  const helpId = `${id}-help`;

  return (
    <div className="rounded-md border border-white/[0.06] bg-black/10 px-3 py-2.5">
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-describedby={helpId}
        disabled={disabled}
        className="w-full justify-start border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05] disabled:text-zinc-600"
        onClick={onClick}
      >
        {label}
      </Button>
      <p id={helpId} className="mt-2 text-xs leading-5 text-zinc-500">
        {description}
      </p>
      {!applicable && reason ? (
        <p className="mt-1 text-xs leading-5 text-zinc-400">
          Unavailable: {reason}
        </p>
      ) : null}
    </div>
  );
}

function formatViewBoxDisplay(box: ParsedViewBox | null): string {
  return box ? formatViewBox(box) : "Unavailable";
}

function formatDeltaDisplay(box: ParsedViewBox | null): string {
  if (!box) {
    return "Unavailable";
  }

  return [
    `minX ${box.minX >= 0 ? "+" : ""}${formatGeometryNumber(box.minX)}`,
    `minY ${box.minY >= 0 ? "+" : ""}${formatGeometryNumber(box.minY)}`,
    `w ${box.width >= 0 ? "+" : ""}${formatGeometryNumber(box.width)}`,
    `h ${box.height >= 0 ? "+" : ""}${formatGeometryNumber(box.height)}`,
  ].join(" · ");
}

function parsePositiveNumber(value: string): number | null {
  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : null;
}

function formatOutputDimensions(width: number | null, height: number | null): string | null {
  if (width === null || height === null) {
    return null;
  }

  return `${formatGeometryNumber(width)} × ${formatGeometryNumber(height)}`;
}

function getGeometrySummaryItems(
  geometry: SvgGeometryInfo,
  originalGeometry: SvgGeometryInfo,
  previewSizeMode: "fit" | "fixed" | "custom",
  previewSizeValue: number | null,
): string[] {
  const items: string[] = [];
  const currentBox = geometry.effectiveViewBox;
  const originalBox = originalGeometry.effectiveViewBox;

  if (currentBox && originalBox && !areViewBoxesEqual(currentBox, originalBox)) {
    const squaredOriginal = normalizeToSquareCanvas(originalBox);
    const matchesSquare = areViewBoxesEqual(currentBox, squaredOriginal);
    const paddedOriginal = detectUniformPadding(originalBox, currentBox);
    const paddedSquare = detectUniformPadding(squaredOriginal, currentBox);

    if (matchesSquare || (paddedSquare !== null && paddedSquare > 0)) {
      items.push("Square canvas");
    }

    const effectivePadding =
      paddedOriginal && paddedOriginal > 0
        ? paddedOriginal
        : paddedSquare && paddedSquare > 0
          ? paddedSquare
          : null;

    if (effectivePadding !== null) {
      items.push(`Padding: ${formatGeometryNumber(effectivePadding)}`);
    } else if (!matchesSquare) {
      items.push("Custom viewBox");
    }
  }

  const outputDimensions = formatOutputDimensions(
    geometry.numericWidth,
    geometry.numericHeight,
  );
  const originalOutputDimensions = formatOutputDimensions(
    originalGeometry.numericWidth,
    originalGeometry.numericHeight,
  );

  if (outputDimensions && outputDimensions !== originalOutputDimensions) {
    items.push(`Output: ${outputDimensions}`);
  }

  if (previewSizeMode === "fixed" && previewSizeValue) {
    items.push(`Preview: ${previewSizeValue}px`);
  }

  return items;
}

export function IconWorkspaceCard() {
  const {
    document,
    isProcessing,
    applyIconWorkspaceTransformation,
    undo,
    redo,
    resetToOriginal,
    history,
    historyIndex,
    previewBackground,
    previewSizeMode,
    previewSizeValue,
    setPreviewBackground,
    setPreviewSize,
  } = useSvgWorkspace();
  const [customViewBoxDraft, setCustomViewBoxDraft] = useState<ViewBoxDraft>({
    minX: "0",
    minY: "0",
    width: "24",
    height: "24",
  });
  const [outputDraft, setOutputDraft] = useState<OutputDraft>({
    width: "24",
    height: "24",
  });
  const [isAspectLocked, setIsAspectLocked] = useState(true);

  const transformationStates = useMemo(() => {
    if (!document || !isIconWorkspaceEligible(document)) {
      return [];
    }

    return getIconWorkspaceTransformationStates(
      document.content,
      document.originalContent,
    );
  }, [document]);

  if (!document || !isIconWorkspaceEligible(document)) {
    return null;
  }

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex >= 0 && historyIndex < history.length - 1;
  const hasChanges = document.content !== document.originalContent;
  const geometry = document.geometry;
  const originalGeometry = document.originalGeometry;
  const referenceBox = geometry.effectiveViewBox;
  const originalBox = originalGeometry.effectiveViewBox;
  const viewBoxValidation = validateCustomViewBox(customViewBoxDraft);
  const customViewBoxApplicability =
    viewBoxValidation.valid
      ? getIconWorkspaceTransformationApplicability(
          document.content,
          document.originalContent,
          "geometry-set-viewbox",
          { viewBox: viewBoxValidation.value },
        )
      : { applicable: false, reason: viewBoxValidation.error };

  const outputWidth = parsePositiveNumber(outputDraft.width);
  const outputHeight = parsePositiveNumber(outputDraft.height);
  const outputApplicability =
    outputWidth !== null && outputHeight !== null
      ? getIconWorkspaceTransformationApplicability(
          document.content,
          document.originalContent,
          "geometry-set-output-size",
          { width: outputWidth, height: outputHeight },
        )
      : {
          applicable: false,
          reason: "Output width and height must be numbers greater than zero.",
        };

  const squareApplicability = getIconWorkspaceTransformationApplicability(
    document.content,
    document.originalContent,
    "geometry-square-canvas",
  );
  const removePaddingApplicability = getIconWorkspaceTransformationApplicability(
    document.content,
    document.originalContent,
    "geometry-remove-padding",
  );
  const resetCanvasApplicability = getIconWorkspaceTransformationApplicability(
    document.content,
    document.originalContent,
    "geometry-reset-canvas",
  );

  const geometrySummaryItems = getGeometrySummaryItems(
    geometry,
    originalGeometry,
    previewSizeMode,
    previewSizeValue,
  );
  const pendingInspectorBox = viewBoxValidation.valid
    ? viewBoxValidation.value
    : geometry.effectiveViewBox;
  const inspectorDelta = viewBoxValidation.valid
    ? getViewBoxDelta(geometry.effectiveViewBox, viewBoxValidation.value)
    : getViewBoxDelta(originalBox, geometry.effectiveViewBox);

  const applyPresetOutputSize = (size: number) => {
    if (!referenceBox) {
      return;
    }

    const nextDimensions = isAspectLocked
      ? calculateLockedOutputSize(size, referenceBox)
      : { width: size, height: size };

    applyIconWorkspaceTransformation("geometry-set-output-size", nextDimensions);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#0d0d10] transition-colors duration-150 hover:border-white/[0.14]">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-sm font-medium text-zinc-200">Icon Workspace</p>
        <p className="mt-1 text-xs text-zinc-500">
          Deterministic transformations for standalone SVGs. Sprites remain isolated in Sprite Workspace.
        </p>
      </div>

      <div className="grid gap-4 px-4 py-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="space-y-4">
          <WorkspaceGroup title="Appearance">
            {transformationStates
              .filter((state) => state.category === "appearance")
              .map((state) => (
                <TransformationButton
                  key={state.id}
                  id={state.id}
                  label={state.label}
                  description={state.description}
                  applicable={state.applicability.applicable}
                  reason={state.applicability.reason}
                  disabled={!state.applicability.applicable || isProcessing}
                  onClick={() => applyIconWorkspaceTransformation(state.id)}
                />
              ))}
          </WorkspaceGroup>

          <WorkspaceGroup title="History">
            <div className="grid gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label="Undo the last icon workspace change"
                disabled={!canUndo || isProcessing}
                className="justify-start border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05] disabled:text-zinc-600"
                onClick={undo}
              >
                <Undo2 aria-hidden="true" className="size-3.5" />
                Undo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label="Redo the previously undone icon workspace change"
                disabled={!canRedo || isProcessing}
                className="justify-start border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05] disabled:text-zinc-600"
                onClick={redo}
              >
                <Redo2 aria-hidden="true" className="size-3.5" />
                Redo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label="Reset the current SVG back to the original uploaded SVG"
                disabled={!hasChanges || isProcessing}
                className="justify-start border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05] disabled:text-zinc-600"
                onClick={resetToOriginal}
              >
                <RotateCcw aria-hidden="true" className="size-3.5" />
                Reset to original
              </Button>
            </div>
            <p className="text-xs leading-5 text-zinc-500">
              Shortcuts: <span className="font-metric">Ctrl/Cmd + Z</span> for Undo and <span className="font-metric">Ctrl/Cmd + Shift + Z</span> for Redo.
            </p>
          </WorkspaceGroup>

          <WorkspaceGroup title="Preview Background">
            <fieldset>
              <legend className="sr-only">Choose a preview background</legend>
              <div className="flex flex-wrap gap-2">
                {BACKGROUND_OPTIONS.map((option) => (
                  <Button
                    key={option.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-pressed={previewBackground === option.id}
                    aria-label={`Use ${option.label} preview background`}
                    className={cn(
                      "border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05]",
                      previewBackground === option.id && "bg-white/[0.08] text-zinc-100",
                    )}
                    onClick={() => setPreviewBackground(option.id)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </fieldset>
            <p className="text-xs leading-5 text-zinc-500">
              Background modes affect only Preview. They never modify the SVG markup.
            </p>
          </WorkspaceGroup>
        </div>

        <div className="space-y-4">
          <WorkspaceGroup title="Geometry">
            <div className="grid gap-3 lg:grid-cols-3">
              <div className="rounded-md border border-white/[0.06] bg-black/10 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500">Current</p>
                <p className="mt-1 font-metric text-sm text-zinc-200">
                  {formatViewBoxDisplay(geometry.effectiveViewBox)}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {geometry.viewBoxSource === "derived"
                    ? "Derived from width and height"
                    : geometry.viewBoxSource === "explicit"
                      ? "Explicit viewBox"
                      : "No editable canvas"}
                </p>
              </div>
              <div className="rounded-md border border-white/[0.06] bg-black/10 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500">Result</p>
                <p className="mt-1 font-metric text-sm text-zinc-200">
                  {formatViewBoxDisplay(pendingInspectorBox)}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {viewBoxValidation.valid ? "Pending custom viewBox" : "Current result"}
                </p>
              </div>
              <div className="rounded-md border border-white/[0.06] bg-black/10 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500">Delta</p>
                <p className="mt-1 text-xs leading-5 text-zinc-300">
                  {formatDeltaDisplay(inspectorDelta)}
                </p>
              </div>
            </div>

            {geometrySummaryItems.length > 0 ? (
              <div className="rounded-md border border-white/[0.06] bg-black/10 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500">Geometry summary</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {geometrySummaryItems.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {geometry.warnings.length > 0 ? (
              <div className="rounded-md border border-amber-400/20 bg-amber-400/5 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-wider text-amber-300">Warnings</p>
                <div className="mt-2 space-y-1">
                  {geometry.warnings.map((warning) => (
                    <p key={warning} className="text-xs leading-5 text-amber-100/90">
                      {warning}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="grid gap-2 sm:grid-cols-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!squareApplicability.applicable || isProcessing}
                aria-describedby="square-canvas-help"
                className="justify-start border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05] disabled:text-zinc-600"
                onClick={() => applyIconWorkspaceTransformation("geometry-square-canvas")}
              >
                Square canvas
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!removePaddingApplicability.applicable || isProcessing}
                aria-describedby="remove-padding-help"
                className="justify-start border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05] disabled:text-zinc-600"
                onClick={() => applyIconWorkspaceTransformation("geometry-remove-padding")}
              >
                Remove padding
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!resetCanvasApplicability.applicable || isProcessing}
                aria-describedby="reset-canvas-help"
                className="justify-start border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05] disabled:text-zinc-600"
                onClick={() => applyIconWorkspaceTransformation("geometry-reset-canvas")}
              >
                Reset canvas
              </Button>
            </div>
            <div className="space-y-1 text-xs text-zinc-500">
              <p id="square-canvas-help">
                {squareApplicability.applicable
                  ? "Expand the current canvas to a square without scaling the artwork."
                  : `Unavailable: ${squareApplicability.reason}`}
              </p>
              <p id="remove-padding-help">
                {removePaddingApplicability.applicable
                  ? "Restore the original effective canvas instead of trying to reverse the current padding stack."
                  : `Unavailable: ${removePaddingApplicability.reason}`}
              </p>
              <p id="reset-canvas-help">
                {resetCanvasApplicability.applicable
                  ? "Restore original viewBox, width, height, and preserveAspectRatio only."
                  : `Unavailable: ${resetCanvasApplicability.reason}`}
              </p>
            </div>

            <div className="rounded-md border border-white/[0.06] bg-black/10 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Uniform padding</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {PADDING_OPTIONS.map((padding) => {
                  const applicability = getIconWorkspaceTransformationApplicability(
                    document.content,
                    document.originalContent,
                    "geometry-add-padding",
                    { padding },
                  );

                  return (
                    <Button
                      key={padding}
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!applicability.applicable || isProcessing}
                      aria-label={`Add ${padding}px of uniform padding`}
                      title={
                        applicability.applicable
                          ? `Add ${padding}px of padding`
                          : applicability.reason
                      }
                      className="border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05] disabled:text-zinc-600"
                      onClick={() => applyIconWorkspaceTransformation("geometry-add-padding", { padding })}
                    >
                      {padding}
                    </Button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs leading-5 text-zinc-500">
                Padding expands the current effective viewBox. It never moves or scales the paths themselves.
              </p>
            </div>

            <div className="rounded-md border border-white/[0.06] bg-black/10 px-3 py-2.5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500">Custom viewBox</p>
                <p className="text-[11px] text-zinc-500">minX minY width height</p>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {(
                  [
                    ["minX", "minX"],
                    ["minY", "minY"],
                    ["width", "width"],
                    ["height", "height"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="grid gap-1">
                    <span className="text-[11px] text-zinc-400">{label}</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      aria-label={`Custom viewBox ${label}`}
                      value={customViewBoxDraft[key]}
                      onChange={(event) =>
                        setCustomViewBoxDraft((current) => ({
                          ...current,
                          [key]: event.target.value,
                        }))
                      }
                      className="h-9 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 text-sm text-zinc-200 outline-none transition focus:border-white/[0.14]"
                    />
                  </label>
                ))}
              </div>
              {!viewBoxValidation.valid ? (
                <p className="mt-2 text-xs leading-5 text-amber-300">
                  {viewBoxValidation.error}
                </p>
              ) : null}
              <div className="mt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!customViewBoxApplicability.applicable || isProcessing}
                  className="border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05] disabled:text-zinc-600"
                  onClick={() =>
                    viewBoxValidation.valid
                      ? applyIconWorkspaceTransformation("geometry-set-viewbox", {
                          viewBox: viewBoxValidation.value,
                        })
                      : undefined
                  }
                >
                  Apply custom viewBox
                </Button>
                {!customViewBoxApplicability.applicable && customViewBoxApplicability.reason ? (
                  <p className="mt-2 text-xs leading-5 text-zinc-500">
                    Unavailable: {customViewBoxApplicability.reason}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="rounded-md border border-white/[0.06] bg-black/10 px-3 py-2.5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500">Output size</p>
                <button
                  type="button"
                  className={cn(
                    "rounded-md border border-white/[0.08] px-2 py-1 text-[11px] transition",
                    isAspectLocked
                      ? "bg-white/[0.08] text-zinc-100"
                      : "bg-white/[0.02] text-zinc-400 hover:bg-white/[0.05]",
                  )}
                  onClick={() => setIsAspectLocked((current) => !current)}
                >
                  Aspect ratio {isAspectLocked ? "locked" : "unlocked"}
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {SIZE_OPTIONS.map((size) => {
                  const presetDimensions =
                    referenceBox && isAspectLocked
                      ? calculateLockedOutputSize(size, referenceBox)
                      : { width: size, height: size };
                  const applicability = getIconWorkspaceTransformationApplicability(
                    document.content,
                    document.originalContent,
                    "geometry-set-output-size",
                    presetDimensions,
                  );

                  return (
                    <Button
                      key={size}
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!applicability.applicable || isProcessing}
                      title={
                        applicability.applicable
                          ? `Set output size to ${formatGeometryNumber(presetDimensions.width)} × ${formatGeometryNumber(presetDimensions.height)}`
                          : applicability.reason
                      }
                      className="border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05] disabled:text-zinc-600"
                      onClick={() => applyPresetOutputSize(size)}
                    >
                      {size}
                    </Button>
                  );
                })}
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <label className="grid gap-1">
                  <span className="text-[11px] text-zinc-400">Width</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    aria-label="Custom output width"
                    value={outputDraft.width}
                    onChange={(event) => {
                      const nextWidth = event.target.value;

                      setOutputDraft((current) => {
                        if (!isAspectLocked || !referenceBox) {
                          return { ...current, width: nextWidth };
                        }

                        const numericWidth = parsePositiveNumber(nextWidth);

                        if (numericWidth === null) {
                          return { ...current, width: nextWidth };
                        }

                        return {
                          width: nextWidth,
                          height: formatGeometryNumber(
                            numericWidth * (referenceBox.height / referenceBox.width),
                          ),
                        };
                      });
                    }}
                    className="h-9 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 text-sm text-zinc-200 outline-none transition focus:border-white/[0.14]"
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-[11px] text-zinc-400">Height</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    aria-label="Custom output height"
                    value={outputDraft.height}
                    onChange={(event) => {
                      const nextHeight = event.target.value;

                      setOutputDraft((current) => {
                        if (!isAspectLocked || !referenceBox) {
                          return { ...current, height: nextHeight };
                        }

                        const numericHeight = parsePositiveNumber(nextHeight);

                        if (numericHeight === null) {
                          return { ...current, height: nextHeight };
                        }

                        return {
                          width: formatGeometryNumber(
                            numericHeight * (referenceBox.width / referenceBox.height),
                          ),
                          height: nextHeight,
                        };
                      });
                    }}
                    className="h-9 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 text-sm text-zinc-200 outline-none transition focus:border-white/[0.14]"
                  />
                </label>
              </div>
              {(!outputApplicability.applicable && outputApplicability.reason) ? (
                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  Unavailable: {outputApplicability.reason}
                </p>
              ) : null}
              <div className="mt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!outputApplicability.applicable || isProcessing}
                  className="border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05] disabled:text-zinc-600"
                  onClick={() => {
                    if (outputWidth === null || outputHeight === null) {
                      return;
                    }

                    applyIconWorkspaceTransformation("geometry-set-output-size", {
                      width: outputWidth,
                      height: outputHeight,
                    });
                  }}
                >
                  Apply output size
                </Button>
              </div>
              <p className="mt-2 text-xs leading-5 text-zinc-500">
                Output dimensions affect export width and height only. They never modify the viewBox.
              </p>
            </div>

            <div className="rounded-md border border-white/[0.06] bg-black/10 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Preview size</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  aria-pressed={previewSizeMode === "fit"}
                  className={cn(
                    "border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05]",
                    previewSizeMode === "fit" && "bg-white/[0.08] text-zinc-100",
                  )}
                  onClick={() => setPreviewSize(null)}
                >
                  Fit
                </Button>
                {SIZE_OPTIONS.map((size) => (
                  <Button
                    key={size}
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-pressed={previewSizeMode === "fixed" && previewSizeValue === size}
                    className={cn(
                      "border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05]",
                      previewSizeMode === "fixed" && previewSizeValue === size && "bg-white/[0.08] text-zinc-100",
                    )}
                    onClick={() => setPreviewSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
              <p className="mt-2 text-xs leading-5 text-zinc-500">
                Preview size changes only the inspection canvas. It never affects exported SVG markup.
              </p>
            </div>
          </WorkspaceGroup>
        </div>
      </div>
    </div>
  );
}
