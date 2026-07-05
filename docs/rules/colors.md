# Colors

Status

Implemented in Preview

---

## Category Purpose

Color rules identify SVGs that are harder to theme, reuse, or adapt across design systems.

These rules focus on fixed paint values that reduce flexibility.

They currently support explicit Transform actions for direct hardcoded paint attributes while remaining outside `Optimize SVG`.

---

## Implemented Rules

| ID | Title | Severity | Score Impact | Fix Type / Treatment |
| --- | --- | --- | --- | --- |
| `COLORS_001` | Hardcoded Fill Colors | Warning | 3 | Transform when direct fill attributes are eligible, otherwise Manual |
| `COLORS_002` | Hardcoded Stroke Colors | Warning | 3 | Transform when direct stroke attributes are eligible, otherwise Manual |

---

## Treatment Notes

- Both color findings use the internal `choice` metadata but are presented as `Transform` in the product.
- `Use currentColor` is now implemented as an explicit Transform for direct `fill` and `stroke` attributes with safe color values.
- This Transform is intentionally excluded from `Optimize SVG`.
- Style attributes, style blocks, CSS variables, paint servers, inherited keywords, and other non-direct or unsafe cases remain review-oriented.
- Converting to `currentColor` intentionally changes how the SVG derives color, so it should remain a user-triggered action rather than an automatic optimization.

---

## Scoring Notes

- Both implemented color rules are currently `Warning` findings with a score impact of `3`.
- This is consistent between fill and stroke.
- The current scoring is provisional and should be revisited once real color replacement workflows exist.
- The rules inventory notes that Transform-oriented color findings may currently be penalizing the score more than the product can meaningfully act on.

---

## Fixture References

- `hardcoded-fill.svg`
- `hardcoded-stroke.svg`
- `hardcoded-colors.svg`
- `hardcoded-currentcolor-fill.svg`
- `hardcoded-currentcolor-stroke.svg`
- `hardcoded-currentcolor-mixed.svg`
- `hardcoded-currentcolor-unsafe.svg`
- `messy.svg`
- `illustrator-export.svg`

See [docs/test-fixtures.md](/Users/fernandasampaio/Work/svg-workspace/docs/test-fixtures.md) for fixture descriptions.

---

## Future Considerations

- Extend Transform options beyond `currentColor` to support CSS variables or token-based mapping.
- Decide whether Transform findings should keep their current score impact before richer configurable actions ship.
- Consider future rules for gradients, paint servers, and theme-hostile embedded styles once the treatment model is standardized.
