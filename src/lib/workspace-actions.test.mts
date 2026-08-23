import assert from "node:assert/strict";
import test from "node:test";
import {
  filterWorkspaceActions,
  type WorkspaceAction,
} from "./workspace-actions.ts";

const actions: WorkspaceAction[] = [
  {
    id: "optimize",
    title: "Optimize SVG",
    description: "Run automatic safe optimizations.",
    keywords: ["optimize", "safe", "health"],
    enabled: true,
    execute: () => {},
  },
  {
    id: "export-current",
    title: "Copy Current SVG",
    description: "Copy the current working SVG.",
    keywords: ["copy", "current", "export"],
    enabled: true,
    execute: () => {},
  },
  {
    id: "export-optimized",
    title: "Download Optimized SVG",
    description: "Download the optimized SVG.",
    keywords: ["download", "optimized", "export"],
    enabled: false,
    disabledReason: "Optimized version not available yet.",
    execute: () => {},
  },
];

test("filterWorkspaceActions prefers direct matches", () => {
  const result = filterWorkspaceActions(actions, "optimize");

  assert.equal(result[0]?.id, "optimize");
});

test("filterWorkspaceActions matches subsequences and keywords", () => {
  const result = filterWorkspaceActions(actions, "csvg");

  assert.equal(result[0]?.id, "export-current");
});

test("filterWorkspaceActions keeps enabled actions ahead of unavailable ones", () => {
  const result = filterWorkspaceActions(actions, "svg");

  assert.equal(result[0]?.enabled, true);
  assert.equal(result.at(-1)?.id, "export-optimized");
});
