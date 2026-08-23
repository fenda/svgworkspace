export type WorkspaceShortcutId =
  | "command-palette"
  | "undo"
  | "redo"
  | "focus-search";

export function getShortcutLabel(id: WorkspaceShortcutId): string {
  switch (id) {
    case "command-palette":
      return "Ctrl/Cmd + K";
    case "undo":
      return "Ctrl/Cmd + Z";
    case "redo":
      return "Ctrl/Cmd + Shift + Z";
    case "focus-search":
      return "/";
  }
}

export function matchesShortcut(
  id: WorkspaceShortcutId,
  input: {
    key: string;
    metaKey?: boolean;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
  },
): boolean {
  const key = input.key.toLowerCase();
  const hasPrimaryModifier = Boolean(input.metaKey || input.ctrlKey);

  switch (id) {
    case "command-palette":
      return hasPrimaryModifier && !input.altKey && key === "k";
    case "undo":
      return hasPrimaryModifier && !input.altKey && !input.shiftKey && key === "z";
    case "redo":
      return hasPrimaryModifier && !input.altKey && Boolean(input.shiftKey) && key === "z";
    case "focus-search":
      return !hasPrimaryModifier && !input.altKey && !input.shiftKey && key === "/";
  }
}
