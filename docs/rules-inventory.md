# SVG Workspace Rules Inventory

Last reviewed: August 2026

This inventory is the implementation reference for rules registered in `src/analysis/rules/*`. SVG Health contains only the Structure, Performance, Colors, Accessibility, and Maintainability categories. React Ready findings remain destination-specific and do not affect Health.

## Scoring Philosophy

SVG Health measures objective production quality, not every possible improvement.

- `5-6`: a verified structural or rendering risk, such as a missing or invalid `viewBox`, duplicate IDs, or a reference to a missing local ID.
- `1`: a measurable cleanup or portability concern that can be established from the SVG itself.
- `0`: optional cleanup, user-intent-dependent transforms, or accessibility guidance that requires embedding context.

This lets a clean SVG reach `100` without optional markup. It also keeps a comment, hardcoded brand color, or missing internal description from being treated like a broken reference. Grade bands remain `A+` at 95 and above, `A` at 90 and above, and so on.

## Summary

- SVG Health rules: 25
- React Ready rules: 5
- Auto-capable Health rules: 14
- Health rules with explicit metadata in code: 24
- Safe-fix treatment fallback rules remaining: 0

## Structure

| ID | Title | Severity | Score | Treatment | Fixture coverage | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `STRUCTURE_001` | Missing viewBox | Warning | 6 | Transform when numeric width/height make generation safe; otherwise Review | `missing-viewbox.svg`, scalability fixtures, sprite viewBox fixtures | Sprites suppress the irrelevant root check and aggregate symbol viewBox gaps. |
| `STRUCTURE_002` | Fixed Width & Height | Info | 1 | Optimize with a valid viewBox; otherwise Review | fixed-dimensions fixtures, `messy.svg` | Fixed output dimensions are a small reusability concern, not a rendering failure. |
| `STRUCTURE_003` | Duplicate IDs | Warning | 5 | Review | `duplicate-ids.svg` | Duplicate IDs can break local references. ID normalization remains manual because host-page references are not observable from the SVG. |
| `STRUCTURE_004` | Empty Groups | Info | 1 | Optimize | `empty-groups.svg`, `messy.svg` | Safe export-noise cleanup. |
| `STRUCTURE_005` | Empty Paths | Info | 1 | Optimize | `empty-paths.svg`, `messy.svg` | Empty paths are normally removable export residue. |
| `STRUCTURE_006` | Empty Definitions | Info | 1 | Optimize | `empty-defs.svg` | Runs after dependent cleanup steps. |
| `STRUCTURE_007` | Empty Symbols | Info | 1 | Optimize | `empty-symbols.svg` | Removes only symbols with no meaningful content. |
| `STRUCTURE_008` | Invalid viewBox | Warning | 6 | Review | `invalid-viewbox.svg` | Sprite containers defer scalability inspection to symbols. |
| `STRUCTURE_009` | Broken Internal References | Warning | 5 | Review | `broken-internal-references.svg`, `internal-references-valid.svg` | Detects only verified missing local `url(#id)` and `href="#id"` targets. |

## Performance

| ID | Title | Severity | Score | Treatment | Fixture coverage | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `PERFORMANCE_001` | Metadata Found | Info | 0 | Optimize | `metadata.svg`, `messy.svg`, `illustrator-export.svg` | Optional export cleanup. |
| `PERFORMANCE_002` | Comments Found | Info | 0 | Optimize | `comments.svg`, `messy.svg`, `illustrator-export.svg` | Comments do not lower Health on their own. |
| `PERFORMANCE_003` | High Decimal Precision | Info | 1 | Optimize | `high-precision.svg`, `messy.svg`, `illustrator-export.svg` | Measurable payload cleanup. |
| `PERFORMANCE_004` | Hidden Elements | Info | 1 | Optimize | `hidden-elements.svg`, `messy.svg` | Detects static direct and inline hidden states. |
| `PERFORMANCE_005` | Unused Definitions | Info | 1 | Optimize | `unused-defs.svg` | Preserves referenced definition chains. |
| `PERFORMANCE_006` | Unused Namespaces | Info | 0 | Optimize | `unused-namespaces.svg`, `namespace-in-use.svg` | Optional declaration cleanup. |
| `PERFORMANCE_007` | Excess Whitespace | Info | 0 | Optimize | `excess-whitespace.svg` | Removes structural whitespace while preserving text-sensitive content. |

## Colors

| ID | Title | Severity | Score | Treatment | Fixture coverage | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `COLORS_001` | Hardcoded Fill Colors | Info | 0 | Transform when direct attributes are eligible; otherwise Review | hardcoded and currentColor fixtures | Fixed colors can be intentional, especially for brand assets. |
| `COLORS_002` | Hardcoded Stroke Colors | Info | 0 | Transform when direct attributes are eligible; otherwise Review | hardcoded and currentColor fixtures | `currentColor` is explicit and never part of Optimize SVG. |

## Accessibility

| ID | Title | Severity | Score | Treatment | Fixture coverage | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `ACCESSIBILITY_001` | Missing Title | Info | 0 | Review | `missing-title.svg` | Guidance only; skipped for decorative, sprite, and explicitly self-labeled SVGs. |
| `ACCESSIBILITY_002` | Empty Title | Info | 0 | Review | `empty-title.svg`, `decorative-empty-title.svg` | Guidance only; skipped where another accessible name exists. |
| `ACCESSIBILITY_003` | Missing Description | Info | 0 | Review | `missing-desc.svg` | Long descriptions are context-dependent. |
| `ACCESSIBILITY_004` | Empty Description | Info | 0 | Review | `empty-desc.svg` | Advises only when a direct empty `<desc>` is present. |
| `ACCESSIBILITY_005` | Decorative SVG | Info | 0 | Review guidance | decorative fixtures | Confirms an intentional decorative signal without penalizing it. |

## Maintainability

| ID | Title | Severity | Score | Treatment | Fixture coverage | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `MAINTAINABILITY_001` | Inline Styles | Warning | 3 | Optimize when every declaration is safe; otherwise Review | inline-style fixtures | Existing Auto/Review behavior remains unchanged. |
| `MAINTAINABILITY_002` | Embedded CSS Classes | Warning | 3 | Optimize when at least one rule is safe; otherwise Review | CSS class fixtures | Safe rules can be partially inlined while unsafe rules remain. |

## React Ready

`REACT_001` through `REACT_005` retain their existing metadata and fixtures. They are separate conversion guidance and do not contribute to SVG Health.

## Audit Results

- All registered rules declare explicit metadata and no safe-fix treatment fallback remains.
- Sprite-aware scalability behavior is preserved: root container viewBox findings are suppressed for sprites, while symbol-level gaps remain aggregated into one finding.
- Accessibility findings now describe context-required guidance instead of asserting that the standalone markup is inaccessible. Decorative SVGs, sprite containers, and SVGs with `aria-label` or `aria-labelledby` do not receive missing-title guidance. Direct child `<title>` and `<desc>` elements are used so nested symbol metadata cannot satisfy the root document check.
- Cleanup-only scoring is lighter. Optional metadata, comments, namespace declarations, hardcoded colors, and accessibility guidance do not reduce Health.
- `STRUCTURE_009` adds the one high-value missing check identified in this pass: verified broken internal references that can cause paint, clipping, masks, filters, markers, or `<use>` content to fail.

## Candidate Rules Rejected

- Visual contrast: SVG Workspace cannot know the final background, placement, inherited color, or surrounding UI context.
- Missing role and ARIA linkage requirements: accessible naming may come from the embedding document, so generic Health cannot make a reliable pass/fail judgment.
- Generic animation or scripting warnings: their safety and intent depend on the runtime environment and would create too many false positives.
- Broad malformed-CSS linting: complex CSS is already preserved for Review; generic style warnings would not be specific enough to improve Health.

## Known Limitations

- Internal-reference detection intentionally covers explicit local URL and `href` fragments only. It does not attempt to reason about arbitrary script-built references, external documents, or SMIL timing references.
- Accessibility guidance cannot determine whether an embedding application supplies an accessible name or long description outside the SVG.
- Health does not evaluate visual contrast, branding intent, or design-system requirements without explicit context.
