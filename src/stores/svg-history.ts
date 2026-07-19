export const MAX_SVG_HISTORY_ENTRIES = 50;

export function buildSvgHistoryState(
  history: string[],
  historyIndex: number,
  currentContent: string,
  nextContent: string,
): { history: string[]; historyIndex: number } {
  const baseHistory = historyIndex >= 0
    ? history.slice(0, historyIndex + 1)
    : [];
  const normalizedHistory = baseHistory.length === 0
    ? [currentContent]
    : baseHistory[baseHistory.length - 1] === currentContent
      ? baseHistory
      : [...baseHistory, currentContent];

  if (normalizedHistory[normalizedHistory.length - 1] === nextContent) {
    const trimmedHistory = normalizedHistory.slice(-MAX_SVG_HISTORY_ENTRIES);

    return {
      history: trimmedHistory,
      historyIndex: Math.max(
        0,
        Math.min(trimmedHistory.length - 1, MAX_SVG_HISTORY_ENTRIES - 1),
      ),
    };
  }

  const nextHistory = [...normalizedHistory, nextContent];
  const trimmedHistory = nextHistory.slice(-MAX_SVG_HISTORY_ENTRIES);

  return {
    history: trimmedHistory,
    historyIndex: trimmedHistory.length - 1,
  };
}
