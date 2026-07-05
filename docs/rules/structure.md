# Structure

Status

Implemented in Preview

---

## Category Purpose

Structure rules evaluate whether the SVG document is well-formed, scalable, and free from broken or redundant structural markup.

This category includes both:

- correctness-oriented issues such as missing `viewBox` or duplicate IDs
- safe structural cleanup opportunities such as empty groups or empty definition containers

---

## Implemented Rules

| ID | Title | Severity | Score Impact | Fix Type / Treatment |
| --- | --- | --- | --- | --- |
| `STRUCTURE_001` | Missing viewBox | Warning | 5 | Transform when width/height make generation safe, otherwise Manual |
| `STRUCTURE_002` | Fixed Width & Height | Info | 2 | Auto when a valid `viewBox` exists, otherwise Manual |
| `STRUCTURE_003` | Duplicate IDs | Warning | 4 | Manual |
| `STRUCTURE_004` | Empty Groups | Info | 1 | Auto |
| `STRUCTURE_005` | Empty Paths | Warning | 3 | Auto |
| `STRUCTURE_006` | Empty Definitions | Info | 1 | Auto |
| `STRUCTURE_007` | Empty Symbols | Info | 1 | Auto |
| `STRUCTURE_008` | Invalid viewBox | Warning | 5 | Manual |

---

## Treatment Notes

- `Missing viewBox` becomes a Transform when SVG Workspace can safely generate `viewBox="0 0 width height"` from valid fixed dimensions.
- `Missing viewBox` remains Manual when no safe dimensions exist to derive from.
- `Duplicate IDs` and `Invalid viewBox` remain Manual because they require user judgment.
- `Fixed Width & Height` is dynamic:
  - Auto when the existing `viewBox` already makes width/height removal safe
  - Manual when no safe `viewBox` is available
- Empty container cleanup rules are safe structural treatments and are available through `Optimize SVG`.

---

## Scoring Notes

- `Missing viewBox`, `Invalid viewBox`, and `Duplicate IDs` carry the largest structure penalties because they can affect scaling behavior or document integrity.
- Cleanup-oriented structure rules use lower impacts because they are usually safe export-noise cleanup.
- `Empty Paths` currently scores higher than several other cleanup findings; the rules inventory flags this for future review but no scoring change is applied here.

---

## Fixture References

- `missing-viewbox.svg`
- `scalable-width-height-only.svg`
- `scalable-viewbox-only.svg`
- `scalable-both.svg`
- `scalable-missing-dimensions.svg`
- `invalid-viewbox.svg`
- `fixed-dimensions.svg`
- `fixed-dimensions-no-viewbox.svg`
- `duplicate-ids.svg`
- `empty-groups.svg`
- `empty-paths.svg`
- `empty-defs.svg`
- `empty-symbols.svg`
- `messy.svg`
- `illustrator-export.svg`

See [docs/test-fixtures.md](/Users/fernandasampaio/Work/svg-workspace/docs/test-fixtures.md) for fixture descriptions.

---

## Future Considerations

- Revisit structure scoring after the broader rules/scoring audit follow-ups are prioritized.
- Add future structure rules only when they remain deterministic, independently testable, and safe to explain clearly.
