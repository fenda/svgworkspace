# Performance

Status

Implemented in Preview

---

## Category Purpose

Performance rules detect SVG export noise and markup overhead that can usually be removed without changing rendering.

These rules mostly focus on safe cleanup opportunities:

- extra metadata
- comments
- unnecessary precision
- hidden markup
- unused definitions
- unused namespace declarations

---

## Implemented Rules

| ID | Title | Severity | Score Impact | Fix Type / Treatment |
| --- | --- | --- | --- | --- |
| `PERFORMANCE_001` | Metadata Found | Info | 2 | Auto |
| `PERFORMANCE_002` | Comments Found | Info | 1 | Auto |
| `PERFORMANCE_003` | High Decimal Precision | Info | 3 | Auto |
| `PERFORMANCE_004` | Hidden Elements | Info | 2 | Auto |
| `PERFORMANCE_005` | Unused Definitions | Info | 2 | Auto |
| `PERFORMANCE_006` | Unused Namespaces | Info | 1 | Auto |

---

## Treatment Notes

- All current Performance rules are treated as safe cleanup opportunities.
- Some rules explicitly declare `fixType: auto`; others are currently treated as Auto through fallback logic in the safe-fix layer.
- These fixes are applied through `Optimize SVG` and individual automatic fix actions.
- Safety remains the priority: cleanup should never change rendering.

---

## Scoring Notes

- All current Performance findings are `Info`.
- Score impacts range from `1` to `3` depending on how much export overhead or cleanup value the rule represents.
- The rules inventory recommends revisiting whether fully automatic cleanup findings should reduce score as much as they currently do.
- The current performance scoring model should continue to be treated as provisional.

---

## Fixture References

- `metadata.svg`
- `comments.svg`
- `high-precision.svg`
- `hidden-elements.svg`
- `unused-defs.svg`
- `unused-namespaces.svg`
- `namespace-in-use.svg`
- `messy.svg`
- `illustrator-export.svg`

See [docs/test-fixtures.md](/Users/fernandasampaio/Work/svg-workspace/docs/test-fixtures.md) for fixture descriptions.

---

## Future Considerations

- Standardize explicit rule metadata so all Auto-capable rules declare `fixType` directly.
- Revisit score impact for cleanup-only rules once the broader SVG Health model is recalibrated.
- Add future performance rules only when they preserve rendering and can be explained clearly.
