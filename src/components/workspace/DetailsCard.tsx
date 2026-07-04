"use client";

import { useSvgWorkspace } from "@/hooks/use-svg-workspace";

function hasChanged(current: string | number, original: string | number): boolean {
  return current !== original;
}

function formatComparisonValue(
  current: string | number,
  original: string | number,
) {
  if (!hasChanged(current, original)) {
    return (
      <p className="font-metric mt-1 text-sm font-medium text-zinc-300">
        {current}
      </p>
    );
  }

  return (
    <p className="font-metric mt-1 text-sm font-medium text-zinc-300">
      <span className="text-zinc-500">{original}</span>
      <span className="mx-1.5 text-zinc-600">→</span>
      <span>{current}</span>
    </p>
  );
}

export function DetailsCard() {
  const { document } = useSvgWorkspace();

  if (!document) {
    return null;
  }

  const { metadata, originalMetadata } = document;

  return (
    <div className="rounded-xl border border-white/10 bg-[#0d0d10] transition-colors duration-150 hover:border-white/[0.14]">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-sm font-medium text-zinc-200">SVG Details</p>
      </div>

      <div className="flex flex-wrap gap-3 px-4 py-4">
        {[
          {
            label: "ViewBox",
            value: metadata.viewBox,
            originalValue: originalMetadata.viewBox,
          },
          {
            label: "Size",
            value: metadata.size,
            originalValue: originalMetadata.size,
          },
          {
            label: "Paths",
            value: metadata.paths,
            originalValue: originalMetadata.paths,
          },
          {
            label: "Colors",
            value: metadata.colors,
            originalValue: originalMetadata.colors,
          },
          {
            label: "Responsive",
            value: metadata.responsive,
            originalValue: originalMetadata.responsive,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="min-w-[116px] flex-1 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-3"
          >
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">
              {item.label}
            </p>
            {formatComparisonValue(
              item.value,
              item.originalValue,
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
