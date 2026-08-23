import assert from "node:assert/strict";
import test from "node:test";
import {
  getShortcutLabel,
  matchesShortcut,
} from "./workspace-shortcuts.ts";

test("getShortcutLabel returns readable labels", () => {
  assert.equal(getShortcutLabel("command-palette"), "Ctrl/Cmd + K");
  assert.equal(getShortcutLabel("focus-search"), "/");
});

test("matchesShortcut detects command palette shortcut", () => {
  assert.equal(
    matchesShortcut("command-palette", { key: "k", metaKey: true }),
    true,
  );
});

test("matchesShortcut distinguishes undo and redo", () => {
  assert.equal(matchesShortcut("undo", { key: "z", ctrlKey: true }), true);
  assert.equal(
    matchesShortcut("redo", { key: "z", ctrlKey: true, shiftKey: true }),
    true,
  );
  assert.equal(
    matchesShortcut("undo", { key: "z", ctrlKey: true, shiftKey: true }),
    false,
  );
});
