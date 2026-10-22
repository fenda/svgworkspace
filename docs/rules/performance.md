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
- excess structural whitespace

---

## Implemented Rules

| ID | Title | Severity | Score Impact | Fix Type / Treatment |
| --- | --- | --- | --- | --- |
| `PERFORMANCE_001` | Metadata Found | Info | 0 | Auto |
| `PERFORMANCE_002` | Comments Found | Info | 0 | Auto |
| `PERFORMANCE_003` | High Decimal Precision | Info | 1 | Auto |
| `PERFORMANCE_004` | Hidden Elements | Info | 1 | Auto |
| `PERFORMANCE_005` | Unused Definitions | Info | 1 | Auto |
| `PERFORMANCE_006` | Unused Namespaces | Info | 0 | Auto |
| `PERFORMANCE_007` | Excess Whitespace | Info | 0 | Auto |
| `PERFORMANCE_008` | Embedded Raster Images | Info | 1 | Manual |

---

## Treatment Notes

- All current Performance rules explicitly declare Auto metadata and are treated as safe cleanup opportunities.
- These fixes are applied through `Optimize SVG` and individual automatic fix actions.
- Safety remains the priority: cleanup should never change rendering.

---

## Scoring Notes

- All current Performance findings are `Info`.
- Optional markup cleanup such as metadata, comments, namespace declarations, and structural whitespace has no Health penalty.
- Measurable payload cleanup such as precision, hidden content, and unused definitions carries a small one-point impact.

---

## Fixture References

- `metadata.svg`
- `comments.svg`
- `high-precision.svg`
- `hidden-elements.svg`
- `unused-defs.svg`
- `unused-namespaces.svg`
- `namespace-in-use.svg`
- `excess-whitespace.svg`
- `embedded-raster-image.svg`
- `messy.svg`
- `illustrator-export.svg`

See [docs/test-fixtures.md](/Users/fernandasampaio/Work/svg-workspace/docs/test-fixtures.md) for fixture descriptions.

---

## Future Considerations

- Add performance rules only when their rendering safety can be established from the SVG itself.
- Add future performance rules only when they preserve rendering and can be explained clearly.
