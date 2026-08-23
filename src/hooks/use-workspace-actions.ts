"use client";

import { useMemo } from "react";
import {
  getIconWorkspaceTransformationApplicability,
  getIconWorkspaceTransformationStates,
  isIconWorkspaceEligible,
} from "@/actions/icon-workspace";
import { resolveExportSources } from "@/export-studio";
import { useSvgWorkspace } from "@/hooks/use-svg-workspace";
import type { WorkspaceAction } from "@/lib/workspace-actions";
import { getStandaloneSpriteSymbol } from "@/lib/svg";
import {
  copySvgWithFeedback,
  downloadSvgWithFeedback,
} from "@/output/perform-svg-export";
import { useWorkspaceUiStore } from "@/stores/workspace-ui-store";

function scrollToWorkspaceCard(cardId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  globalThis.document
    .querySelector<HTMLElement>(`[data-workspace-card="${cardId}"]`)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function focusSpriteSearch(): void {
  if (typeof window === "undefined") {
    return;
  }

  const field = globalThis.document.querySelector<HTMLInputElement>(
    "[data-sprite-search]",
  );

  field?.focus();
  field?.select();
}

export function useWorkspaceActions(): WorkspaceAction[] {
  const {
    document,
    optimizationReport,
    selectedSymbolKey,
    history,
    historyIndex,
    isProcessing,
    applyCurrentSafeFixes,
    applyIconWorkspaceTransformation,
    undo,
    redo,
    resetToOriginal,
    clear,
  } = useSvgWorkspace();
  const focusMode = useWorkspaceUiStore((state) => state.focusMode);
  const toggleFocusMode = useWorkspaceUiStore((state) => state.toggleFocusMode);
  const closeCommandPalette = useWorkspaceUiStore(
    (state) => state.closeCommandPalette,
  );
  const setLastActiveWorkspace = useWorkspaceUiStore(
    (state) => state.setLastActiveWorkspace,
  );
  const setCardCollapsed = useWorkspaceUiStore((state) => state.setCardCollapsed);

  return useMemo(() => {
    const actions: WorkspaceAction[] = [];
    const hasDocument = Boolean(document);
    const isSprite = Boolean(document?.symbols.length);
    const iconEligible = isIconWorkspaceEligible(document ?? null);
    const canUndo = historyIndex > 0;
    const canRedo = historyIndex >= 0 && historyIndex < history.length - 1;
    const exportSources = document
      ? resolveExportSources({
          document,
          optimizationReport,
          selectedSymbolKey,
          resolveSelectedSymbolExport: getStandaloneSpriteSymbol,
        })
      : [];
    const currentExport = exportSources.find(
      (source) => source.id === (isSprite ? "current_sprite" : "current_svg"),
    );
    const optimizedExport = exportSources.find(
      (source) => source.id === (isSprite ? "optimized_sprite" : "optimized_svg"),
    );
    const selectedSymbolExport = exportSources.find(
      (source) => source.id === "selected_symbol",
    );

    const navigate = (
      workspaceId: "preview" | "health" | "icon-workspace" | "inspector" | "export-studio",
      title: string,
      description: string,
      keywords: string[],
    ) => {
      actions.push({
        id: `navigate-${workspaceId}`,
        title,
        description,
        keywords,
        icon: "navigation",
        enabled: hasDocument,
        disabledReason: hasDocument ? undefined : "Load an SVG first.",
        workspaceId,
        execute: () => {
          setCardCollapsed(workspaceId, false);
          setLastActiveWorkspace(workspaceId);
          closeCommandPalette();
          scrollToWorkspaceCard(workspaceId);
        },
      });
    };

    actions.push({
      id: "workspace-focus-mode",
      title: focusMode ? "Exit Focus Mode" : "Enter Focus Mode",
      description: focusMode
        ? "Restore the full workspace layout."
        : "Show only Preview, the active workspace, and the toolbar.",
      keywords: ["focus", "layout", "workspace", "distraction free"],
      icon: "focus",
      enabled: hasDocument,
      disabledReason: hasDocument ? undefined : "Load an SVG first.",
      execute: () => {
        toggleFocusMode();
        closeCommandPalette();
      },
    });

    actions.push({
      id: "workspace-optimize",
      title: "Optimize SVG",
      description: "Run automatic safe optimizations against the current SVG.",
      keywords: ["optimize", "safe fixes", "automatic", "health"],
      icon: "wand",
      enabled: hasDocument && !isProcessing,
      disabledReason: hasDocument
        ? isProcessing
          ? "SVG Workspace is busy."
          : undefined
        : "Load an SVG first.",
      workspaceId: "health",
      execute: () => {
        closeCommandPalette();
        applyCurrentSafeFixes();
      },
    });

    actions.push({
      id: "workspace-undo",
      title: "Undo",
      description: "Restore the previous SVG state in the current session.",
      keywords: ["undo", "history", "back"],
      icon: "undo",
      enabled: canUndo && !isProcessing,
      disabledReason: canUndo
        ? isProcessing
          ? "SVG Workspace is busy."
          : undefined
        : "No earlier session state is available.",
      execute: () => {
        closeCommandPalette();
        undo();
      },
    });

    actions.push({
      id: "workspace-redo",
      title: "Redo",
      description: "Restore the next SVG state in the current session.",
      keywords: ["redo", "history", "forward"],
      icon: "redo",
      enabled: canRedo && !isProcessing,
      disabledReason: canRedo
        ? isProcessing
          ? "SVG Workspace is busy."
          : undefined
        : "No redo state is available.",
      execute: () => {
        closeCommandPalette();
        redo();
      },
    });

    actions.push({
      id: "workspace-reset",
      title: "Reset to original",
      description: "Restore the uploaded SVG exactly as it was loaded.",
      keywords: ["reset", "original", "restore"],
      icon: "reset",
      enabled: Boolean(document && document.content !== document.originalContent && !isProcessing),
      disabledReason: document
        ? document.content === document.originalContent
          ? "Current output already matches the original SVG."
          : isProcessing
            ? "SVG Workspace is busy."
            : undefined
        : "Load an SVG first.",
      execute: () => {
        closeCommandPalette();
        resetToOriginal();
      },
    });

    actions.push({
      id: "workspace-clear",
      title: "Reset workspace",
      description: "Clear the current SVG and return to the upload state.",
      keywords: ["clear", "workspace", "remove", "close file"],
      icon: "clear",
      enabled: hasDocument && !isProcessing,
      disabledReason: hasDocument ? undefined : "No SVG is loaded.",
      execute: () => {
        closeCommandPalette();
        clear();
      },
    });

    if (currentExport) {
      actions.push({
        id: "export-copy-current",
        title: isSprite ? "Copy Current Sprite" : "Copy Current SVG",
        description: "Copy the current working document to the clipboard.",
        keywords: ["copy", "current", "export", "clipboard"],
        icon: "copy",
        enabled: Boolean(currentExport.available && currentExport.svgMarkup),
        disabledReason: currentExport.warning ?? undefined,
        workspaceId: "export-studio",
        execute: () => {
          if (!currentExport.svgMarkup) {
            return;
          }

          closeCommandPalette();
          void copySvgWithFeedback({
            svgMarkup: currentExport.svgMarkup,
            successMessage: currentExport.copySuccessMessage,
            warnings: currentExport.warnings,
          });
        },
      });
      actions.push({
        id: "export-download-current",
        title: isSprite ? "Download Current Sprite" : "Download Current SVG",
        description: "Download the current working document.",
        keywords: ["download", "current", "export", "file"],
        icon: "download",
        enabled: Boolean(currentExport.available && currentExport.svgMarkup),
        disabledReason: currentExport.warning ?? undefined,
        workspaceId: "export-studio",
        execute: () => {
          if (!currentExport.svgMarkup) {
            return;
          }

          closeCommandPalette();
          downloadSvgWithFeedback({
            svgMarkup: currentExport.svgMarkup,
            filename: currentExport.filename,
            successMessage: currentExport.downloadSuccessMessage,
            warnings: currentExport.warnings,
          });
        },
      });
    }

    if (optimizedExport) {
      actions.push({
        id: "export-copy-optimized",
        title: isSprite ? "Copy Optimized Sprite" : "Copy Optimized SVG",
        description: "Copy the most recent Optimize SVG result.",
        keywords: ["copy", "optimized", "export", "clipboard"],
        icon: "copy",
        enabled: Boolean(optimizedExport.available && optimizedExport.svgMarkup),
        disabledReason: optimizedExport.warning ?? undefined,
        workspaceId: "export-studio",
        execute: () => {
          if (!optimizedExport.svgMarkup) {
            return;
          }

          closeCommandPalette();
          void copySvgWithFeedback({
            svgMarkup: optimizedExport.svgMarkup,
            successMessage: optimizedExport.copySuccessMessage,
            warnings: optimizedExport.warnings,
          });
        },
      });
      actions.push({
        id: "export-download-optimized",
        title: isSprite ? "Download Optimized Sprite" : "Download Optimized SVG",
        description: "Download the most recent Optimize SVG result.",
        keywords: ["download", "optimized", "export", "file"],
        icon: "download",
        enabled: Boolean(optimizedExport.available && optimizedExport.svgMarkup),
        disabledReason: optimizedExport.warning ?? undefined,
        workspaceId: "export-studio",
        execute: () => {
          if (!optimizedExport.svgMarkup) {
            return;
          }

          closeCommandPalette();
          downloadSvgWithFeedback({
            svgMarkup: optimizedExport.svgMarkup,
            filename: optimizedExport.filename,
            successMessage: optimizedExport.downloadSuccessMessage,
            warnings: optimizedExport.warnings,
          });
        },
      });
    }

    if (selectedSymbolExport) {
      actions.push({
        id: "export-copy-symbol",
        title: "Copy Selected Symbol",
        description: "Copy the selected sprite symbol as a standalone SVG.",
        keywords: ["copy", "symbol", "sprite", "clipboard"],
        icon: "copy",
        enabled: Boolean(selectedSymbolExport.available && selectedSymbolExport.svgMarkup),
        disabledReason: selectedSymbolExport.warning ?? undefined,
        workspaceId: "preview",
        execute: () => {
          if (!selectedSymbolExport.svgMarkup) {
            return;
          }

          closeCommandPalette();
          void copySvgWithFeedback({
            svgMarkup: selectedSymbolExport.svgMarkup,
            successMessage: selectedSymbolExport.copySuccessMessage,
            warnings: selectedSymbolExport.warnings,
          });
        },
      });
      actions.push({
        id: "export-download-symbol",
        title: "Download Selected Symbol",
        description: "Download the selected sprite symbol as a standalone SVG.",
        keywords: ["download", "symbol", "sprite", "file"],
        icon: "download",
        enabled: Boolean(selectedSymbolExport.available && selectedSymbolExport.svgMarkup),
        disabledReason: selectedSymbolExport.warning ?? undefined,
        workspaceId: "preview",
        execute: () => {
          if (!selectedSymbolExport.svgMarkup) {
            return;
          }

          closeCommandPalette();
          downloadSvgWithFeedback({
            svgMarkup: selectedSymbolExport.svgMarkup,
            filename: selectedSymbolExport.filename,
            successMessage: selectedSymbolExport.downloadSuccessMessage,
            warnings: selectedSymbolExport.warnings,
          });
        },
      });
    }

    if (iconEligible && document) {
      const transformations = getIconWorkspaceTransformationStates(
        document.content,
        document.originalContent,
      );

      for (const transformation of transformations) {
        actions.push({
          id: `transform-${transformation.id}`,
          title: transformation.label,
          description: transformation.description,
          keywords: [
            transformation.category,
            "icon workspace",
            transformation.label.toLowerCase(),
          ],
          icon: transformation.category,
          enabled: transformation.applicability.applicable && !isProcessing,
          disabledReason:
            transformation.applicability.reason ||
            (isProcessing ? "SVG Workspace is busy." : undefined),
          workspaceId: "icon-workspace",
          execute: () => {
            closeCommandPalette();
            applyIconWorkspaceTransformation(transformation.id);
          },
        });
      }

      actions.push({
        id: "transform-padding-8",
        title: "Add Padding",
        description: "Expand the current viewBox with a default padding preset of 8.",
        keywords: ["padding", "canvas", "geometry", "viewbox"],
        icon: "canvas",
        enabled:
          getIconWorkspaceTransformationApplicability(
            document.content,
            document.originalContent,
            "geometry-add-padding",
            { padding: 8 },
          ).applicable && !isProcessing,
        disabledReason:
          getIconWorkspaceTransformationApplicability(
            document.content,
            document.originalContent,
            "geometry-add-padding",
            { padding: 8 },
          ).reason ||
          (isProcessing ? "SVG Workspace is busy." : undefined),
        workspaceId: "icon-workspace",
        execute: () => {
          closeCommandPalette();
          applyIconWorkspaceTransformation("geometry-add-padding", {
            padding: 8,
          });
        },
      });
    }

    if (isSprite) {
      actions.push({
        id: "sprite-search-focus",
        title: "Search Symbol",
        description: "Focus the Sprite Explorer search field.",
        keywords: ["sprite", "search", "symbol", "find"],
        icon: "search",
        enabled: true,
        workspaceId: "preview",
        execute: () => {
          closeCommandPalette();
          focusSpriteSearch();
        },
      });
    }

    navigate(
      "preview",
      isSprite ? "Open Sprite Workspace" : "Open Preview",
      isSprite
        ? "Jump to Sprite Explorer and symbol details."
        : "Jump to the main preview area.",
      ["preview", "sprite", "workspace", "canvas"],
    );
    navigate(
      "health",
      "Open SVG Health",
      "Jump to health score, health areas, and findings.",
      ["health", "analysis", "findings", "issues"],
    );

    if (iconEligible) {
      navigate(
        "icon-workspace",
        "Open Geometry",
        "Jump to the current Icon Workspace tools and geometry controls.",
        ["geometry", "icon workspace", "canvas", "transform"],
      );
    }

    navigate(
      "inspector",
      "Open Inspector",
      "Jump to SVG information, insights, and optimization summary.",
      ["inspector", "details", "insights", "summary"],
    );
    navigate(
      "export-studio",
      "Open Export Studio",
      "Jump to the unified export destination for the current session.",
      ["export", "download", "copy", "studio"],
    );

    return actions;
  }, [
    applyCurrentSafeFixes,
    applyIconWorkspaceTransformation,
    clear,
    closeCommandPalette,
    document,
    focusMode,
    history,
    historyIndex,
    isProcessing,
    optimizationReport,
    redo,
    resetToOriginal,
    selectedSymbolKey,
    setCardCollapsed,
    setLastActiveWorkspace,
    toggleFocusMode,
    undo,
  ]);
}
