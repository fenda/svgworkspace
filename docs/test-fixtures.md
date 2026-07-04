# Test Fixtures

SVG Workspace keeps a set of canonical SVG fixtures under `public/test-svgs/`.

These fixtures are used for manual testing, demos, regression checks, and future automated tests.

## Fixtures

| Fixture | Purpose | Expected findings |
| --- | --- | --- |
| `good.svg` | Clean production-ready SVG with no known MVP issues. | None |
| `accessibility-good.svg` | Clean SVG with both accessibility elements present. | None |
| `missing-title.svg` | Tests missing `<title>` detection only. | `Missing Title` |
| `empty-title.svg` | Tests empty `<title>` detection only. | `Empty Title` |
| `missing-desc.svg` | Tests missing `<desc>` detection only. | `Missing Description` |
| `empty-desc.svg` | Tests empty `<desc>` detection only. | `Empty Description` |
| `decorative-aria-hidden.svg` | Tests decorative SVG detection via `aria-hidden="true"`. | `Decorative SVG` |
| `decorative-role-presentation.svg` | Tests decorative SVG detection via `role="presentation"`. | `Decorative SVG` |
| `decorative-role-none.svg` | Tests decorative SVG detection via `role="none"`. | `Decorative SVG` |
| `decorative-empty-title.svg` | Tests decorative SVG context while still flagging an empty title. | `Decorative SVG`, `Empty Title` |
| `missing-viewbox.svg` | Tests missing `viewBox` plus fixed dimensions. | `Missing viewBox`, `Fixed Width & Height` |
| `fixed-dimensions.svg` | Tests fixed `width` and `height` with an otherwise clean SVG. | `Fixed Width & Height` |
| `metadata.svg` | Tests `<metadata>` detection. | `Metadata Found` |
| `comments.svg` | Tests comment detection inside the SVG tree. | `Comments Found` |
| `hardcoded-fill.svg` | Tests hardcoded fill color detection only. | `Hardcoded Fill Colors` |
| `hardcoded-stroke.svg` | Tests hardcoded stroke color detection only. | `Hardcoded Stroke Colors` |
| `hardcoded-colors.svg` | Tests both hardcoded fill and stroke colors together. | `Hardcoded Fill Colors`, `Hardcoded Stroke Colors` |
| `high-precision.svg` | Tests excessive decimal precision detection. | `High Decimal Precision` |
| `duplicate-ids.svg` | Tests duplicate `id` detection. | `Duplicate IDs` |
| `messy.svg` | Realistic bad SVG fixture with multiple structural, performance, color, and maintainability issues. | `Missing viewBox`, `Fixed Width & Height`, `Empty Groups`, `Empty Paths`, `Metadata Found`, `Comments Found`, `High Decimal Precision`, `Hidden Elements`, `Hardcoded Fill Colors`, `Hardcoded Stroke Colors`, `Inline Styles` |
| `illustrator-export.svg` | Realistic design-tool export fixture before optimization. | `Fixed Width & Height`, `Metadata Found`, `Comments Found`, `High Decimal Precision`, `Hardcoded Fill Colors`, `Hardcoded Stroke Colors` |

## Notes

- `good.svg` intentionally has no header comment so it continues to return no findings.
- Legacy non-accessibility fixtures now include `<title>` and `<desc>` where needed so they keep targeting their original rule coverage.
- Other fixtures may include header comments for human readability; comment detection is based on comments inside the `<svg>` tree.
