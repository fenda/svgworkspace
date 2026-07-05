"use client";

import { useEffect, useState } from "react";
import { debugDetectSvgType } from "@/lib/svg/type-detection";
import { extractSvgMetadata } from "@/lib/svg/metadata";
import { parseSvgMarkup } from "@/lib/svg/parse";

const FIXTURES = [
  "svg-type-icon.svg",
  "svg-type-logo.svg",
  "svg-type-horizontal-logo.svg",
  "svg-type-illustration.svg",
  "svg-type-diagram.svg",
  "svg-type-sprite-sheet.svg",
  "svg-type-unknown.svg",
] as const;

type DebugRow = {
  fixture: string;
  viewBox: string | null;
  width: number | null;
  height: number | null;
  aspectRatio: number | null;
  pathCount: number;
  shapeCount: number;
  groupCount: number;
  textCount: number;
  colorCount: number;
  gradientMaskClipPathCount: number;
  markerCount: number;
  symbolCount: number;
  scores: string;
  selectedType: string;
  confidence: string;
  reason: string;
};

function formatAspectRatio(value: number | null): string {
  return value === null ? "—" : value.toFixed(2);
}

export default function SvgTypeDebugPage() {
  const [rows, setRows] = useState<DebugRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    let isCancelled = false;

    async function load() {
      try {
        const loadedRows = await Promise.all(
          FIXTURES.map(async (fixture) => {
            const response = await fetch(`/test-svgs/${fixture}`);
            const content = await response.text();
            const svg = parseSvgMarkup(content);
            const metadata = extractSvgMetadata(svg, content, fixture);
            const debug = debugDetectSvgType(svg, metadata.colors);

            return {
              fixture,
              viewBox: debug.signals.viewBox,
              width: debug.signals.width,
              height: debug.signals.height,
              aspectRatio: debug.signals.aspectRatio,
              pathCount: debug.signals.pathCount,
              shapeCount: debug.signals.shapeCount,
              groupCount: debug.signals.groupCount,
              textCount: debug.signals.textCount,
              colorCount: debug.signals.colorCount,
              gradientMaskClipPathCount: debug.signals.complexDefCount,
              markerCount: debug.signals.markerCount,
              symbolCount: debug.signals.symbolCount,
              scores: Object.entries(debug.scores)
                .filter(([type]) => type !== "unknown")
                .map(([type, score]) => `${type}:${score}`)
                .join(" | "),
              selectedType: debug.selected.label,
              confidence: debug.selected.confidence,
              reason: debug.selected.explanation,
            };
          }),
        );

        if (!isCancelled) {
          setRows(loadedRows);
        }
      } catch (nextError) {
        if (!isCancelled) {
          setError(
            nextError instanceof Error
              ? nextError.message
              : "Unable to load SVG type debug data.",
          );
        }
      }
    }

    void load();

    return () => {
      isCancelled = true;
    };
  }, []);

  if (process.env.NODE_ENV !== "development") {
    return (
      <main className="min-h-screen bg-black px-6 py-10 text-zinc-200">
        <p>SVG type debug is available in development only.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-zinc-200">
      <h1 className="text-xl font-semibold">SVG Type Debug</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Development-only fixture classification output.
      </p>

      {error ? (
        <p className="mt-4 text-sm text-amber-300">{error}</p>
      ) : null}

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-zinc-400">
              <th className="px-2 py-2 font-medium">Fixture</th>
              <th className="px-2 py-2 font-medium">viewBox</th>
              <th className="px-2 py-2 font-medium">W</th>
              <th className="px-2 py-2 font-medium">H</th>
              <th className="px-2 py-2 font-medium">AR</th>
              <th className="px-2 py-2 font-medium">Paths</th>
              <th className="px-2 py-2 font-medium">Shapes</th>
              <th className="px-2 py-2 font-medium">Groups</th>
              <th className="px-2 py-2 font-medium">Text</th>
              <th className="px-2 py-2 font-medium">Colors</th>
              <th className="px-2 py-2 font-medium">Defs</th>
              <th className="px-2 py-2 font-medium">Markers</th>
              <th className="px-2 py-2 font-medium">Symbols</th>
              <th className="px-2 py-2 font-medium">Scores</th>
              <th className="px-2 py-2 font-medium">Selected</th>
              <th className="px-2 py-2 font-medium">Confidence</th>
              <th className="px-2 py-2 font-medium">Reason</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.fixture} className="border-b border-white/5 align-top">
                <td className="px-2 py-2">{row.fixture}</td>
                <td className="px-2 py-2">{row.viewBox ?? "—"}</td>
                <td className="px-2 py-2">{row.width ?? "—"}</td>
                <td className="px-2 py-2">{row.height ?? "—"}</td>
                <td className="px-2 py-2">{formatAspectRatio(row.aspectRatio)}</td>
                <td className="px-2 py-2">{row.pathCount}</td>
                <td className="px-2 py-2">{row.shapeCount}</td>
                <td className="px-2 py-2">{row.groupCount}</td>
                <td className="px-2 py-2">{row.textCount}</td>
                <td className="px-2 py-2">{row.colorCount}</td>
                <td className="px-2 py-2">{row.gradientMaskClipPathCount}</td>
                <td className="px-2 py-2">{row.markerCount}</td>
                <td className="px-2 py-2">{row.symbolCount}</td>
                <td className="px-2 py-2">{row.scores}</td>
                <td className="px-2 py-2">{row.selectedType}</td>
                <td className="px-2 py-2">{row.confidence}</td>
                <td className="px-2 py-2 text-zinc-400">{row.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
