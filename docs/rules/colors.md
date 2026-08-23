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
| `COLORS_001` | Hardcoded Fill Colors | Info | 0 | Transform when direct fill attributes are eligible, otherwise Manual |
| `COLORS_002` | Hardcoded Stroke Colors | Info | 0 | Transform when direct stroke attributes are eligible, otherwise Manual |

---

## Treatment Notes

- Both color findings use the internal `choice` metadata but are presented as `Transform` in the product.
- `Convert to currentColor` is now implemented as an explicit Transform for direct `fill` and `stroke` attributes with safe color values.
- This Transform is intentionally excluded from `Optimize SVG`.
- Style attributes, style blocks, CSS variables, paint servers, inherited keywords, and other non-direct or unsafe cases remain review-oriented.
- Converting to `currentColor` intentionally changes how the SVG derives color, so it should remain a user-triggered action rather than an automatic optimization.
- This is best suited to UI icons and design-system assets, and may be inappropriate for logos or brand artwork where color is part of the asset identity.

---

## Scoring Notes

- Both rules are `Info` findings with a score impact of `0`.
- Fixed colors describe an adaptation opportunity, not an objective SVG defect: brand colors and illustration palettes can be intentional.
- `currentColor` remains an explicit Transform and is never included in Optimize SVG.

---

## Fixture References

- `hardcoded-fill.svg`
- `hardcoded-stroke.svg`
- `hardcoded-colors.svg`
- `currentcolor-fill.svg`
- `currentcolor-stroke.svg`
- `currentcolor-mixed.svg`
- `currentcolor-unsafe.svg`
- `messy.svg`
- `illustrator-export.svg`

See [docs/test-fixtures.md](/Users/fernandasampaio/Work/svg-workspace/docs/test-fixtures.md) for fixture descriptions.

---

## Future Considerations

- Extend Transform options beyond `currentColor` to support CSS variables or token-based mapping.
- Consider additional explicit color transforms only when they can preserve user intent and remain clearly reversible.
- Consider future rules for gradients, paint servers, and theme-hostile embedded styles once the treatment model is standardized.
