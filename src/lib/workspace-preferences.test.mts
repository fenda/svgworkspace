import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_WORKSPACE_PREFERENCES,
  normalizeWorkspacePreferences,
  setWorkspaceCardCollapsed,
  toggleWorkspaceCard,
} from "./workspace-preferences.ts";

test("normalizeWorkspacePreferences falls back to defaults for invalid input", () => {
  assert.deepEqual(
    normalizeWorkspacePreferences(null),
    DEFAULT_WORKSPACE_PREFERENCES,
  );
});

test("normalizeWorkspacePreferences preserves known persisted values", () => {
  const result = normalizeWorkspacePreferences({
    focusMode: true,
    collapsedCards: {
      preview: true,
      inspector: true,
      unknown: true,
    },
    lastActiveWorkspace: "export-studio",
  });

  assert.equal(result.focusMode, true);
  assert.equal(result.collapsedCards.preview, true);
  assert.equal(result.collapsedCards.inspector, true);
  assert.equal(result.collapsedCards.health, false);
  assert.equal(result.lastActiveWorkspace, "export-studio");
});

test("toggleWorkspaceCard flips one card at a time", () => {
  const result = toggleWorkspaceCard(DEFAULT_WORKSPACE_PREFERENCES, "preview");

  assert.equal(result.collapsedCards.preview, true);
  assert.equal(result.collapsedCards.health, false);
});

test("setWorkspaceCardCollapsed stores a direct collapse choice", () => {
  const result = setWorkspaceCardCollapsed(
    DEFAULT_WORKSPACE_PREFERENCES,
    "export-studio",
    true,
  );

  assert.equal(result.collapsedCards["export-studio"], true);
});
