import type { WorkspaceViewId } from "@/lib/workspace-preferences";

export type WorkspaceAction = {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  icon?: string;
  enabled: boolean;
  disabledReason?: string;
  workspaceId?: WorkspaceViewId;
  execute: () => void;
};

function normalizeSearchValue(value: string): string {
  return value.trim().toLowerCase();
}

function matchesSubsequence(query: string, target: string): boolean {
  let queryIndex = 0;

  for (let index = 0; index < target.length && queryIndex < query.length; index += 1) {
    if (target[index] === query[queryIndex]) {
      queryIndex += 1;
    }
  }

  return queryIndex === query.length;
}

function getActionSearchText(action: WorkspaceAction): string {
  return [action.title, action.description, ...action.keywords]
    .join(" ")
    .toLowerCase();
}

function getActionScore(action: WorkspaceAction, query: string): number {
  const haystack = getActionSearchText(action);

  if (!query) {
    return action.enabled ? 10 : 0;
  }

  if (haystack.includes(query)) {
    return 200 - haystack.indexOf(query);
  }

  if (action.title.toLowerCase().startsWith(query)) {
    return 180;
  }

  if (matchesSubsequence(query, haystack)) {
    return 80;
  }

  return -1;
}

export function filterWorkspaceActions(
  actions: WorkspaceAction[],
  query: string,
): WorkspaceAction[] {
  const normalizedQuery = normalizeSearchValue(query);

  return [...actions]
    .map((action) => ({
      action,
      score: getActionScore(action, normalizedQuery),
    }))
    .filter((entry) => entry.score >= 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      if (left.action.enabled !== right.action.enabled) {
        return left.action.enabled ? -1 : 1;
      }

      return left.action.title.localeCompare(right.action.title);
    })
    .map((entry) => entry.action);
}
