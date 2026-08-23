export type WorkspaceCardId =
  | "preview"
  | "health"
  | "icon-workspace"
  | "inspector"
  | "export-studio";

export type WorkspaceViewId =
  | "preview"
  | "health"
  | "icon-workspace"
  | "inspector"
  | "export-studio";

export type WorkspacePreferences = {
  focusMode: boolean;
  collapsedCards: Record<WorkspaceCardId, boolean>;
  lastActiveWorkspace: WorkspaceViewId | null;
};

export const DEFAULT_WORKSPACE_PREFERENCES: WorkspacePreferences = {
  focusMode: false,
  collapsedCards: {
    preview: false,
    health: false,
    "icon-workspace": false,
    inspector: false,
    "export-studio": false,
  },
  lastActiveWorkspace: "preview",
};

function isWorkspaceCardId(value: string): value is WorkspaceCardId {
  return value in DEFAULT_WORKSPACE_PREFERENCES.collapsedCards;
}

function isWorkspaceViewId(value: string): value is WorkspaceViewId {
  return (
    value === "preview" ||
    value === "health" ||
    value === "icon-workspace" ||
    value === "inspector" ||
    value === "export-studio"
  );
}

export function normalizeWorkspacePreferences(
  value: unknown,
): WorkspacePreferences {
  const base = DEFAULT_WORKSPACE_PREFERENCES;

  if (!value || typeof value !== "object") {
    return base;
  }

  const input = value as Partial<WorkspacePreferences> & {
    collapsedCards?: Record<string, unknown>;
    lastActiveWorkspace?: unknown;
  };

  const collapsedCards = { ...base.collapsedCards };

  for (const [key, flag] of Object.entries(input.collapsedCards ?? {})) {
    if (isWorkspaceCardId(key) && typeof flag === "boolean") {
      collapsedCards[key] = flag;
    }
  }

  return {
    focusMode:
      typeof input.focusMode === "boolean" ? input.focusMode : base.focusMode,
    collapsedCards,
    lastActiveWorkspace:
      typeof input.lastActiveWorkspace === "string" &&
      isWorkspaceViewId(input.lastActiveWorkspace)
        ? input.lastActiveWorkspace
        : base.lastActiveWorkspace,
  };
}

export function toggleWorkspaceCard(
  preferences: WorkspacePreferences,
  cardId: WorkspaceCardId,
): WorkspacePreferences {
  return {
    ...preferences,
    collapsedCards: {
      ...preferences.collapsedCards,
      [cardId]: !preferences.collapsedCards[cardId],
    },
  };
}

export function setWorkspaceCardCollapsed(
  preferences: WorkspacePreferences,
  cardId: WorkspaceCardId,
  collapsed: boolean,
): WorkspacePreferences {
  return {
    ...preferences,
    collapsedCards: {
      ...preferences.collapsedCards,
      [cardId]: collapsed,
    },
  };
}
