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
| `STRUCTURE_001` | Missing viewBox | Warning | 6 | Transform when width/height make generation safe, otherwise Manual |
| `STRUCTURE_002` | Fixed Width & Height | Info | 1 | Auto when a valid `viewBox` exists, otherwise Manual |
| `STRUCTURE_003` | Duplicate IDs | Warning | 5 | Manual |
| `STRUCTURE_004` | Empty Groups | Info | 1 | Auto |
| `STRUCTURE_005` | Empty Paths | Info | 1 | Auto |
| `STRUCTURE_006` | Empty Definitions | Info | 1 | Auto |
| `STRUCTURE_007` | Empty Symbols | Info | 1 | Auto |
| `STRUCTURE_008` | Invalid viewBox | Warning | 6 | Manual |
| `STRUCTURE_009` | Broken Internal References | Warning | 5 | Manual |

---

## Treatment Notes

- `Missing viewBox` becomes a Transform when SVG Workspace can safely generate `viewBox="0 0 width height"` from valid fixed dimensions.
- `Missing viewBox` remains Manual when no safe dimensions exist to derive from.
- `Duplicate IDs`, `Invalid viewBox`, and `Broken Internal References` remain Manual because they require user judgment.
- `Fixed Width & Height` is dynamic:
  - Auto when the existing `viewBox` already makes width/height removal safe
  - Manual when no safe `viewBox` is available
- Empty container cleanup rules are safe structural treatments and are available through `Optimize SVG`.

---

## Scoring Notes

- `Missing viewBox` and `Invalid viewBox` carry six points because they directly affect scaling. Duplicate IDs and broken references carry five because they can break document-local behavior.
- Cleanup-oriented structure rules use one-point impacts. Empty paths are treated as safe export residue rather than a warning.

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
- `broken-internal-references.svg`
- `internal-references-valid.svg`
- `messy.svg`
- `illustrator-export.svg`

See [docs/test-fixtures.md](/Users/fernandasampaio/Work/svg-workspace/docs/test-fixtures.md) for fixture descriptions.

---

## Future Considerations

- Add future structure rules only when they remain deterministic, independently testable, and safe to explain clearly.
