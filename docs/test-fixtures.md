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
| `sprite-all-symbols-viewbox.svg` | Tests a sprite container whose root SVG has no `viewBox`, but every symbol defines a valid `viewBox`. | None |
| `sprite-missing-symbol-viewbox.svg` | Tests a sprite container that aggregates missing and invalid symbol `viewBox` values into one scalability finding. | `Some symbols are missing a viewBox` |
| `sprite-explorer.svg` | Tests read-only Sprite Explorer preview with multiple symbols, a hidden root SVG, an unnamed symbol, and a symbol without a usable `viewBox`. | `Some symbols are missing a viewBox` |
| `sprite-shared-defs.svg` | Tests Sprite Workspace selection and standalone export when symbols depend on shared root gradients, clip paths, and styles. | None |
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
| `currentcolor-fill.svg` | Tests explicit currentColor conversion for direct fill attributes. | `Hardcoded Fill Colors` |
| `currentcolor-stroke.svg` | Tests explicit currentColor conversion for direct stroke attributes. | `Hardcoded Stroke Colors` |
| `currentcolor-mixed.svg` | Tests explicit currentColor conversion for both direct fill and direct stroke attributes while preserving `none`, `url(#...)`, and existing `currentColor` values. | `Hardcoded Fill Colors`, `Hardcoded Stroke Colors` |
| `currentcolor-unsafe.svg` | Tests hardcoded color findings that remain review-only because the colors live in style attributes or use ignored keywords. | `Hardcoded Fill Colors`, `Hardcoded Stroke Colors` |
| `icon-filled.svg` | Tests Icon Workspace appearance tools on a simple filled standalone icon with multiple solid colors. | `Hardcoded Fill Colors` |
| `icon-stroked.svg` | Tests Icon Workspace appearance tools on a simple stroked standalone icon. | `Hardcoded Stroke Colors` |
| `icon-mixed-fill-stroke.svg` | Tests Icon Workspace appearance tools on mixed fill and stroke artwork. | `Hardcoded Fill Colors`, `Hardcoded Stroke Colors` |
| `icon-currentcolor.svg` | Tests that currentColor conversion is already inapplicable when the icon already inherits color. | None |
| `icon-gradient.svg` | Tests that Icon Workspace appearance tools do not rewrite gradients. | None |
| `icon-css-variable.svg` | Tests that currentColor conversion skips CSS variable paint values. | None |
| `icon-inline-styles.svg` | Tests Icon Workspace appearance transforms on eligible inline fill and stroke style declarations. | `Inline Styles` |
| `icon-fill-stroke-attributes.svg` | Tests direct `fill` and `stroke` attribute removal separately from broader paint removal. | `Hardcoded Fill Colors`, `Hardcoded Stroke Colors` |
| `geometry-portrait-icon.svg` | Tests square-canvas math on a portrait icon. | `Hardcoded Fill Colors` |
| `geometry-landscape-icon.svg` | Tests square-canvas math on a landscape icon. | `Hardcoded Fill Colors` |
| `geometry-non-zero-origin.svg` | Tests square-canvas and padding math when the viewBox origin is not zero. | `Hardcoded Fill Colors` |
| `geometry-missing-viewbox.svg` | Tests Geometry Workspace derivation from numeric width and height when the SVG is missing a viewBox. | `Missing viewBox`, `Fixed Width & Height` |
| `geometry-large-padding.svg` | Tests stacked padding and remove-padding behavior. | `Hardcoded Fill Colors` |
| `geometry-already-square.svg` | Tests that square-canvas actions disable when the canvas is already square. | `Hardcoded Fill Colors` |
| `geometry-custom-viewbox.svg` | Tests custom viewBox editing plus explicit output width and height controls. | `Hardcoded Fill Colors` |
| `optimization-timeline.svg` | Demonstrates multiple safe optimization steps for the read-only Optimization Timeline, including comments, metadata, hidden content, unused defs, empty structure, inline style conversion, CSS class inlining, fixed dimensions, and decimal rounding. | `Fixed Width & Height`, `Metadata Found`, `Comments Found`, `High Decimal Precision`, `Hidden Elements`, `Unused Definitions`, `Inline Styles`, `Embedded CSS Classes`, `Empty Groups`, `Empty Paths` |
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
- `sprite-all-symbols-viewbox.svg` should not report a scalability issue even though the root SVG has no `viewBox`, because each symbol defines its own valid `viewBox`.
- `sprite-missing-symbol-viewbox.svg` should report one aggregated scalability finding instead of one finding per symbol.
- `sprite-explorer.svg` should switch the Preview tab into Sprite Explorer mode, render valid symbols independently from the hidden root SVG, label unnamed symbols clearly, keep invalid symbol previews isolated instead of breaking the full gallery, and report the aggregated sprite-specific `viewBox` finding.
- `sprite-shared-defs.svg` should allow selecting a symbol, searching by title or description, and exporting a standalone symbol that preserves only the required shared gradient, clip path, and root styles.
- `inline-styles-safe.svg` is automatic because every declaration maps cleanly to safe SVG presentation attributes.
- `inline-styles-unsafe.svg` remains manual because at least one declaration is not safe to convert automatically.
- `unused-namespaces.svg` removes only prefixed namespace declarations that are not referenced by any element or attribute name.
- `namespace-in-use.svg` keeps prefixed namespace declarations when the namespace is still used in the document.
- `css-classes-safe.svg` is automatic because every embedded CSS rule uses a simple single-class selector with only safe presentation properties.
- `css-classes-partial.svg` and `css-classes-mixed.svg` are automatic because at least one embedded CSS rule is safe to inline, while unsupported rules remain in the `<style>` block.
- `css-classes-unsafe-selector.svg` and `css-classes-unsafe-declaration.svg` remain manual because no rule in the block is safe to inline automatically.
- `currentcolor-fill.svg`, `currentcolor-stroke.svg`, and `currentcolor-mixed.svg` should expose `Convert to currentColor` as a Transform because they use direct `fill` or `stroke` attributes with safe explicit color values.
- `currentcolor-mixed.svg` should convert only eligible direct hardcoded paint attributes while preserving `none`, `url(#...)`, and existing `currentColor` values.
- `currentcolor-unsafe.svg` should keep the hardcoded color findings visible, but it should remain review-only because the colors are embedded in `style` attributes or use ignored keywords instead of safe direct `fill` or `stroke` values.
- `icon-filled.svg`, `icon-stroked.svg`, and `icon-mixed-fill-stroke.svg` should expose Icon Workspace appearance actions only when they would produce a meaningful change.
- `icon-currentcolor.svg` should keep `Convert colors to currentColor` disabled because the icon already uses inherited color.
- `icon-css-variable.svg` should keep `Convert to currentColor` disabled because CSS variable paints are intentionally excluded from this first milestone.
- `icon-inline-styles.svg` should allow currentColor conversion plus broad fill/stroke removal while keeping the narrower inline-attribute removal buttons disabled.
- `icon-fill-stroke-attributes.svg` should distinguish direct attribute removal from broader fill/stroke removal.
- `icon-gradient.svg` should demonstrate that gradient definitions remain untouched by currentColor and other paint-focused appearance actions.
- `geometry-portrait-icon.svg` should normalize from `0 0 16 24` to `-4 0 24 24`.
- `geometry-landscape-icon.svg` should normalize from `0 0 24 16` to `0 -4 24 24`.
- `geometry-non-zero-origin.svg` should normalize from `10 20 16 24` to `6 20 24 24`.
- `geometry-missing-viewbox.svg` should enable Geometry Workspace by deriving the editable canvas from numeric width and height, while still reporting the missing viewBox finding until the SVG is changed explicitly.
- `geometry-large-padding.svg` should allow stacked padding presets and `Remove padding` should restore the original effective canvas.
- `geometry-already-square.svg` should keep `Square canvas` disabled because the current canvas already matches both dimensions.
- `geometry-custom-viewbox.svg` should allow valid inline viewBox editing and output-size changes without touching the child paths.
- sprite fixtures such as `sprite-explorer.svg` and `sprite-shared-defs.svg` should keep Icon Workspace hidden because symbol presence switches the workspace into Sprite Explorer / Sprite Workspace mode.
- `optimization-timeline.svg` should produce several changed Optimization Timeline steps in the same order as the safe-fix pipeline. Exact byte savings may vary if optimizer dependencies or browser serialization details change.
- Other fixtures may include header comments for human readability; comment detection is based on comments inside the `<svg>` tree.
