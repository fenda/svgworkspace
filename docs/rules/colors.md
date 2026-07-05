# Colors

Status

Implemented in Preview

---

## Category Purpose

Color rules identify SVGs that are harder to theme, reuse, or adapt across design systems.

These rules focus on fixed paint values that reduce flexibility.

They currently surface guidance only.

The future intent is to support configurable color treatments rather than one-click automatic rewrites.

---

## Implemented Rules

| ID | Title | Severity | Score Impact | Fix Type / Treatment |
| --- | --- | --- | --- | --- |
| `COLORS_001` | Hardcoded Fill Colors | Warning | 3 | Choice in the UI |
| `COLORS_002` | Hardcoded Stroke Colors | Warning | 3 | Choice in the UI |

---

## Treatment Notes

- Both color findings are currently presented as `Choice` in the UI.
- The rule implementations themselves do not declare `fixType`; the current `Choice` classification is injected by UI fallback logic.
- No configurable color treatment flow is implemented yet.
- These findings should continue to explain the issue clearly without implying that SVG Workspace can already apply a safe automatic change.

---

## Scoring Notes

- Both implemented color rules are currently `Warning` findings with a score impact of `3`.
- This is consistent between fill and stroke.
- The current scoring is provisional and should be revisited once real color replacement workflows exist.
- The rules inventory notes that `Choice` findings may currently be penalizing the score more than the product can meaningfully act on.

---

## Fixture References

- `hardcoded-fill.svg`
- `hardcoded-stroke.svg`
- `hardcoded-colors.svg`
- `messy.svg`
- `illustrator-export.svg`

See [docs/test-fixtures.md](/Users/fernandasampaio/Work/svg-workspace/docs/test-fixtures.md) for fixture descriptions.

---

## Future Considerations

- Add configurable replacements for `currentColor`, CSS variables, or token-based mapping.
- Decide whether `Choice` findings should keep their current score impact before configurable actions ship.
- Consider future rules for gradients, paint servers, and theme-hostile embedded styles once the treatment model is standardized.
