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
| `react-good.svg` | Clean SVG with no React Ready issues. | None |
| `react-class-attribute.svg` | Tests class attribute detection for JSX compatibility. | `class Attribute` |
| `react-kebab-attributes.svg` | Tests kebab-case attribute detection for JSX compatibility. | `Kebab-case Attributes` |
| `react-inline-style.svg` | Tests inline style string detection for JSX compatibility. | `Inline Style String`, `Inline Styles` |
| `react-xlink.svg` | Tests xlink attribute detection for React compatibility. | `xlink Attribute` |
| `react-event-handlers.svg` | Tests inline event handler attribute detection for React compatibility. | `Inline Event Handlers` |
| `missing-viewbox.svg` | Tests missing `viewBox` plus fixed dimensions. | `Missing viewBox`, `Fixed Width & Height` |
| `scalable-viewbox-only.svg` | Tests a scalable SVG with only a valid `viewBox`. | None |
| `scalable-width-height-only.svg` | Tests missing `viewBox` with safe width/height values that allow `Generate ViewBox`. | `Missing viewBox`, `Fixed Width & Height` |
| `scalable-both.svg` | Tests a valid `viewBox` plus fixed dimensions, which should report as mostly scalable. | `Fixed Width & Height` |
| `invalid-viewbox.svg` | Tests invalid `viewBox` detection. | `Invalid viewBox`, `Fixed Width & Height` |
| `scalable-missing-dimensions.svg` | Tests missing `viewBox` without fixed dimensions, so no safe transform is available. | `Missing viewBox` |
| `fixed-dimensions.svg` | Tests fixed `width` and `height` with a valid `viewBox`, so auto removal is safe. | `Fixed Width & Height` |
| `fixed-dimensions-no-viewbox.svg` | Tests fixed `width` and `height` without a `viewBox`, so no auto fix should be offered. | `Fixed Width & Height` |
| `metadata.svg` | Tests `<metadata>` detection. | `Metadata Found` |
| `comments.svg` | Tests comment detection inside the SVG tree. | `Comments Found` |
| `unused-defs.svg` | Tests `PERFORMANCE_005` unused definitions while preserving used ones. | `Unused Definitions` |
| `empty-defs.svg` | Tests empty `<defs>` cleanup after structural optimization. | `Empty Definitions` |
| `empty-symbols.svg` | Tests removal of symbol elements with no meaningful content. | `Empty Symbols` |
| `unused-namespaces.svg` | Tests `PERFORMANCE_006` unused namespace removal while preserving the default SVG namespace. | `Unused Namespaces` |
| `namespace-in-use.svg` | Tests that namespace declarations remain when prefixed elements or attributes still use them. | None |
| `inline-styles-safe.svg` | Tests safe inline style conversion to presentation attributes. | `Inline Styles` |
| `inline-styles-unsafe.svg` | Tests inline styles that remain manual because they contain unsafe declarations. | `Inline Styles` |
| `css-classes-safe.svg` | Tests safe embedded CSS class inlining to presentation attributes. | `Embedded CSS Classes` |
| `css-classes-partial.svg` | Tests partial embedded CSS inlining where safe class rules are inlined and unsafe rules remain in the same style block. | `Embedded CSS Classes` |
| `css-classes-unsafe-selector.svg` | Tests embedded CSS that remains manual because the selector is not a simple single class. | `Embedded CSS Classes` |
| `css-classes-unsafe-declaration.svg` | Tests embedded CSS that remains manual because it contains an unsafe declaration. | `Embedded CSS Classes` |
| `css-classes-mixed.svg` | Tests that mixed safe and unsafe embedded CSS partially inlines safe rules while preserving unsafe rules. | `Embedded CSS Classes` |
| `hardcoded-fill.svg` | Tests hardcoded fill color detection only. | `Hardcoded Fill Colors` |
| `hardcoded-stroke.svg` | Tests hardcoded stroke color detection only. | `Hardcoded Stroke Colors` |
| `hardcoded-colors.svg` | Tests both hardcoded fill and stroke colors together. | `Hardcoded Fill Colors`, `Hardcoded Stroke Colors` |
| `high-precision.svg` | Tests excessive decimal precision detection. | `High Decimal Precision` |
| `duplicate-ids.svg` | Tests duplicate `id` detection. | `Duplicate IDs` |
| `messy.svg` | Realistic bad SVG fixture with multiple structural, performance, color, and maintainability issues. | `Missing viewBox`, `Fixed Width & Height`, `Empty Groups`, `Empty Paths`, `Metadata Found`, `Comments Found`, `High Decimal Precision`, `Hidden Elements`, `Hardcoded Fill Colors`, `Hardcoded Stroke Colors`, `Inline Styles` |
| `illustrator-export.svg` | Realistic design-tool export fixture before optimization. | `Fixed Width & Height`, `Metadata Found`, `Comments Found`, `High Decimal Precision`, `Hardcoded Fill Colors`, `Hardcoded Stroke Colors` |

## Notes

- `good.svg` intentionally has no header comment so it continues to return no findings.
- Accessibility and React-specific fixtures include `<title>` and `<desc>` where needed so they keep targeting their intended category coverage.
- `fixed-dimensions.svg` is safe for automatic width/height removal because the `viewBox` is already valid.
- `fixed-dimensions-no-viewbox.svg` intentionally remains manual-only because removing dimensions without a `viewBox` could change rendering behavior.
- `scalable-width-height-only.svg` should expose `Generate ViewBox` as a Transform because the existing fixed dimensions are safe to reuse.
- `scalable-both.svg` should report as scalable but still highlight fixed dimensions as a separate structural cleanup issue.
- `invalid-viewbox.svg` should stay manual because SVG Workspace does not guess how to repair an invalid `viewBox`.
- `empty-defs.svg` should optimize away the empty `<defs>` block only after other safe cleanup has left it truly empty.
- `empty-symbols.svg` is automatic because the symbol subtree contains no meaningful drawable or definition content.
- `inline-styles-safe.svg` is automatic because every declaration maps cleanly to safe SVG presentation attributes.
- `inline-styles-unsafe.svg` remains manual because at least one declaration is not safe to convert automatically.
- `unused-namespaces.svg` removes only prefixed namespace declarations that are not referenced by any element or attribute name.
- `namespace-in-use.svg` keeps prefixed namespace declarations when the namespace is still used in the document.
- `css-classes-safe.svg` is automatic because every embedded CSS rule uses a simple single-class selector with only safe presentation properties.
- `css-classes-partial.svg` and `css-classes-mixed.svg` are automatic because at least one embedded CSS rule is safe to inline, while unsupported rules remain in the `<style>` block.
- `css-classes-unsafe-selector.svg` and `css-classes-unsafe-declaration.svg` remain manual because no rule in the block is safe to inline automatically.
- Other fixtures may include header comments for human readability; comment detection is based on comments inside the `<svg>` tree.
