"use client";

import { create } from "zustand";
import {
  DEFAULT_WORKSPACE_PREFERENCES,
  normalizeWorkspacePreferences,
  setWorkspaceCardCollapsed,
  toggleWorkspaceCard,
  type WorkspaceCardId,
  type WorkspacePreferences,
  type WorkspaceViewId,
} from "@/lib/workspace-preferences";

const WORKSPACE_PREFERENCES_STORAGE_KEY = "svg-workspace.workspace-preferences";

function getInitialPreferences(): WorkspacePreferences {
  if (typeof window === "undefined") {
    return DEFAULT_WORKSPACE_PREFERENCES;
  }

  const rawValue = window.localStorage.getItem(
    WORKSPACE_PREFERENCES_STORAGE_KEY,
  );

  if (!rawValue) {
    return DEFAULT_WORKSPACE_PREFERENCES;
  }

  try {
    return normalizeWorkspacePreferences(JSON.parse(rawValue));
  } catch {
    return DEFAULT_WORKSPACE_PREFERENCES;
  }
}

function persistPreferences(preferences: WorkspacePreferences): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    WORKSPACE_PREFERENCES_STORAGE_KEY,
    JSON.stringify(preferences),
  );
}

type WorkspaceUiStore = WorkspacePreferences & {
  commandPaletteOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
  toggleCardCollapsed: (cardId: WorkspaceCardId) => void;
  setCardCollapsed: (cardId: WorkspaceCardId, collapsed: boolean) => void;
  setFocusMode: (focusMode: boolean) => void;
  toggleFocusMode: () => void;
  setLastActiveWorkspace: (workspaceId: WorkspaceViewId) => void;
};

const initialPreferences = getInitialPreferences();

export const useWorkspaceUiStore = create<WorkspaceUiStore>((set) => ({
  ...initialPreferences,
  commandPaletteOpen: false,
  openCommandPalette: () => {
    set({ commandPaletteOpen: true });
  },
  closeCommandPalette: () => {
    set({ commandPaletteOpen: false });
  },
  toggleCommandPalette: () => {
    set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen }));
  },
  toggleCardCollapsed: (cardId) => {
    set((state) => {
      const nextState = toggleWorkspaceCard(state, cardId);
      persistPreferences(nextState);
      return nextState;
    });
  },
  setCardCollapsed: (cardId, collapsed) => {
    set((state) => {
      const nextState = setWorkspaceCardCollapsed(state, cardId, collapsed);
      persistPreferences(nextState);
      return nextState;
    });
  },
  setFocusMode: (focusMode) => {
    set((state) => {
      const nextState = { ...state, focusMode };
      persistPreferences(nextState);
      return nextState;
    });
  },
  toggleFocusMode: () => {
    set((state) => {
      const nextState = { ...state, focusMode: !state.focusMode };
      persistPreferences(nextState);
      return nextState;
    });
  },
  setLastActiveWorkspace: (workspaceId) => {
    set((state) => {
      const nextState = { ...state, lastActiveWorkspace: workspaceId };
      persistPreferences(nextState);
      return nextState;
    });
  },
}));
