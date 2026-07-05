# SVG Workspace Rules Inventory

Last reviewed: July 2026

This inventory reflects the currently implemented rule set in `src/analysis/rules/*`, the current fixture catalog in [docs/test-fixtures.md](/Users/fernandasampaio/Work/svg-workspace/docs/test-fixtures.md), and the current treatment wiring in `src/actions/safe-fixes/*`.

## Summary

- SVG Health rules: 22
- React Ready rules: 5
- Auto-capable rules: 11
- Manual-only rules: 12
- Choice rules in the UI: 2

## Structure

| ID | Title | Category | Severity | Score Impact | Fix Type / Treatment | Status | Fixture Coverage | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `STRUCTURE_001` | Missing viewBox | Structure | Warning | 5 | Manual | Implemented | `missing-viewbox.svg`, `messy.svg` | Strong structural penalty is consistent with responsiveness impact. |
| `STRUCTURE_002` | Fixed Width & Height | Structure | Info | 2 | Auto when `viewBox` is valid, otherwise Manual | Implemented | `fixed-dimensions.svg`, `fixed-dimensions-no-viewbox.svg`, `missing-viewbox.svg`, `messy.svg`, `illustrator-export.svg` | Dynamic treatment is implemented correctly, but the rule does not declare `fixType` in code. |
| `STRUCTURE_003` | Duplicate IDs | Structure | Warning | 4 | Manual | Implemented | `duplicate-ids.svg` | Clear standalone rule with dedicated fixture. |
| `STRUCTURE_004` | Empty Groups | Structure | Info | 1 | Auto | Implemented | `empty-groups.svg`, `messy.svg` | Treated as Auto in the UI via fallback list, not explicit rule metadata. |
| `STRUCTURE_005` | Empty Paths | Structure | Warning | 3 | Auto | Implemented | `empty-paths.svg`, `messy.svg` | Warning severity is reasonable because empty paths usually indicate export noise or corruption. |
| `STRUCTURE_006` | Empty Definitions | Structure | Info | 1 | Auto | Implemented | `empty-defs.svg` | Explicit auto metadata is present. |
| `STRUCTURE_007` | Empty Symbols | Structure | Info | 1 | Auto | Implemented | `empty-symbols.svg` | Explicit auto metadata is present. |

## Performance

| ID | Title | Category | Severity | Score Impact | Fix Type / Treatment | Status | Fixture Coverage | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `PERFORMANCE_001` | Metadata Found | Performance | Info | 2 | Auto | Implemented | `metadata.svg`, `messy.svg`, `illustrator-export.svg` | Auto in the UI via fallback list, not explicit rule metadata. |
| `PERFORMANCE_002` | Comments Found | Performance | Info | 1 | Auto | Implemented | `comments.svg`, `messy.svg`, `illustrator-export.svg` | Lowest-impact cleanup rule; score is reasonable. |
| `PERFORMANCE_003` | High Decimal Precision | Performance | Info | 3 | Auto | Implemented | `high-precision.svg`, `messy.svg`, `illustrator-export.svg` | Auto in the UI via fallback list, not explicit rule metadata. |
| `PERFORMANCE_004` | Hidden Elements | Performance | Info | 2 | Auto | Implemented | `hidden-elements.svg`, `messy.svg` | Detects both direct attributes and inline style forms. |
| `PERFORMANCE_005` | Unused Definitions | Performance | Info | 2 | Auto | Implemented | `unused-defs.svg` | Dedicated fixture exists, but no explicit `fixType` metadata on the rule. |
| `PERFORMANCE_006` | Unused Namespaces | Performance | Info | 1 | Auto | Implemented | `unused-namespaces.svg`, `namespace-in-use.svg` | Includes both positive and negative coverage. |

## Colors

| ID | Title | Category | Severity | Score Impact | Fix Type / Treatment | Status | Fixture Coverage | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `COLORS_001` | Hardcoded Fill Colors | Colors | Warning | 3 | Choice in the UI | Implemented | `hardcoded-fill.svg`, `hardcoded-colors.svg`, `messy.svg`, `illustrator-export.svg` | Rule itself does not declare `fixType`; `Choice` is injected by UI fallback logic. |
| `COLORS_002` | Hardcoded Stroke Colors | Colors | Warning | 3 | Choice in the UI | Implemented | `hardcoded-stroke.svg`, `hardcoded-colors.svg`, `messy.svg`, `illustrator-export.svg` | Same fallback-based `Choice` classification as `COLORS_001`. |

## Accessibility

| ID | Title | Category | Severity | Score Impact | Fix Type / Treatment | Status | Fixture Coverage | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `ACCESSIBILITY_001` | Missing Title | Accessibility | Warning | 4 | Manual | Implemented | `missing-title.svg` | Decorative SVGs are intentionally exempted. |
| `ACCESSIBILITY_002` | Empty Title | Accessibility | Warning | 4 | Manual | Implemented | `empty-title.svg`, `decorative-empty-title.svg` | Consistent with `Missing Title`. |
| `ACCESSIBILITY_003` | Missing Description | Accessibility | Info | 2 | Manual | Implemented | `missing-desc.svg` | Lower severity fits the contextual nature documented in accessibility guidance. |
| `ACCESSIBILITY_004` | Empty Description | Accessibility | Info | 2 | Manual | Implemented | `empty-desc.svg` | Parallel with `Missing Description`. |
| `ACCESSIBILITY_005` | Decorative SVG | Accessibility | Info | 0 | Manual / review-only guidance | Implemented | `decorative-aria-hidden.svg`, `decorative-role-presentation.svg`, `decorative-role-none.svg`, `decorative-empty-title.svg` | Informational only, which is appropriate because it should not penalize intentional decorative markup. |

## Maintainability

| ID | Title | Category | Severity | Score Impact | Fix Type / Treatment | Status | Fixture Coverage | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `MAINTAINABILITY_001` | Inline Styles | Maintainability | Warning | 3 | Auto when all declarations are safe, otherwise Manual | Implemented | `inline-styles-safe.svg`, `inline-styles-unsafe.svg`, `inline-styles.svg`, `react-inline-style.svg`, `messy.svg` | Dynamic treatment is implemented in the rule itself. |
| `MAINTAINABILITY_002` | Embedded CSS Classes | Maintainability | Warning | 3 | Auto when at least one rule is safely inlineable, otherwise Manual | Implemented | `css-classes-safe.svg`, `css-classes-partial.svg`, `css-classes-mixed.svg`, `css-classes-unsafe-selector.svg`, `css-classes-unsafe-declaration.svg` | Partial safe inlining is implemented; docs outside the fixture file still need to reflect that nuance consistently. |

## React Ready

| ID | Title | Category | Severity | Score Impact | Fix Type / Treatment | Status | Fixture Coverage | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `REACT_001` | class Attribute | React Ready | Warning | 3 | Manual | Implemented | `react-class-attribute.svg` | Destination-specific; does not affect SVG Health. |
| `REACT_002` | Kebab-case Attributes | React Ready | Warning | 4 | Manual | Implemented | `react-kebab-attributes.svg` | Reasonable warning because it directly breaks JSX ergonomics. |
| `REACT_003` | Inline Style String | React Ready | Warning | 4 | Manual | Implemented | `react-inline-style.svg` | Overlaps in subject matter with `MAINTAINABILITY_001`, but the categories and recommendations are distinct. |
| `REACT_004` | xlink Attribute | React Ready | Info | 2 | Manual | Implemented | `react-xlink.svg` | Lower severity is appropriate. |
| `REACT_005` | Inline Event Handlers | React Ready | Warning | 4 | Manual | Implemented | `react-event-handlers.svg` | High enough to surface conversion risk. |

## Consistency Review

### Severity

- Accessibility severities are internally consistent: missing or empty `<title>` is `Warning`, while `<desc>` guidance and decorative detection are `Info`.
- Structure severities are mostly reasonable, but `STRUCTURE_005 Empty Paths` is more punitive than several Auto-cleanup performance rules even though it is often export residue.
- Colors rules are both `Warning`, which is consistent with the future design-system treatment direction.

### Scoring

- Score impacts are broadly proportional, but several treatment-only cleanup rules still subtract score despite being safe and fully automatable.
- Choice-category color rules currently subtract 3 points each even though the product does not yet offer a user-facing configurable color treatment flow.
- React Ready rules have scores, but they live outside SVG Health; the separation is good and should remain explicit in docs.

### Treatment Classification

- Dynamic Auto/Manual treatment is implemented correctly for `STRUCTURE_002`, `MAINTAINABILITY_001`, and `MAINTAINABILITY_002`.
- `COLORS_001` and `COLORS_002` are effectively `Choice` in the UI, but that classification is not declared in the rule definitions.
- Several Auto rules (`PERFORMANCE_001` through `PERFORMANCE_005`, `STRUCTURE_004`, `STRUCTURE_005`) rely on fallback lists in `src/actions/safe-fixes/index.ts` instead of explicit rule metadata, which conflicts with the current rule-spec documentation.

### Duplication / Overlap

- `MAINTAINABILITY_001 Inline Styles` and `REACT_003 Inline Style String` intentionally overlap in source syntax but target different outcomes: SVG maintainability vs JSX compatibility.
- `COLORS_001` and `COLORS_002` are parallel and not duplicative.
- No direct duplicate rule IDs or materially duplicated SVG Health rules were found.

### Fixture Coverage

- Every implemented rule has at least one positive fixture.
- Several rules also have useful negative or combined coverage (`namespace-in-use.svg`, `decorative-empty-title.svg`, `messy.svg`, `illustrator-export.svg`).
- The fixture catalog is stronger than the category docs currently suggest.

### Documentation Drift

- `docs/rules/colors.md`, `docs/rules/maintainability.md`, `docs/rules/performance.md`, and `docs/rules/structure.md` are currently placeholder Accessibility content and do not describe the implemented rules at all.
- The rule spec says every rule should define `severity`, `scoreImpact`, `fixType`, `introducedIn`, and `status`, but many implemented rules only return those values in findings and do not declare them in the rule object.
- The code currently uses lowercase severity values (`warning`, `info`) while the rule-spec prose uses title-cased labels (`Warning`, `Info`). This is harmless, but worth documenting consistently.

## Recommended Follow-ups

### Scoring Changes

- Revisit penalties for fully safe Auto cleanup rules such as `PERFORMANCE_001` through `PERFORMANCE_006`, `STRUCTURE_004`, `STRUCTURE_006`, and `STRUCTURE_007` so the score emphasizes user judgment and rendering risk more than removable export noise.
- Re-evaluate whether `STRUCTURE_005 Empty Paths` should stay at `3`, since it currently scores as more severe than several safe cleanup findings.
- Review whether `Choice` color findings should subtract the full 3 points each before configurable treatments exist.

### Treatment Changes

- Declare `fixType` directly on all implemented rules instead of relying on fallback lists in `src/actions/safe-fixes/index.ts`.
- Decide whether `Choice` should be declared at the rule level for color findings rather than inferred in UI logic.
- Consider whether `ACCESSIBILITY_005 Decorative SVG` should remain labeled as a treatment-bearing finding or be documented as contextual review guidance only.

### Documentation Fixes

- Rewrite `docs/rules/colors.md`, `docs/rules/maintainability.md`, `docs/rules/performance.md`, and `docs/rules/structure.md` to match the implemented rule set.
- Bring rule-spec expectations in `docs/RULES.md` in line with the current implementation, or update the code so every rule actually declares the required metadata.
- Add a short note in category docs clarifying which rules are SVG Health rules versus React Ready conversion guidance.

### Fixture Gaps

- Consider adding a dedicated fixture for `PERFORMANCE_001` + `PERFORMANCE_002` together if combined export-noise cleanup is an important regression path outside `messy.svg`.
- Consider adding a narrow fixture for `STRUCTURE_005 Empty Paths` with no other issues if deeper automated regression work is planned.

### Future Rules

- Add more maintainability rules only after the metadata/treatment pattern is standardized, so new rules do not inherit today’s fix-type inconsistency.
- Prioritize future structure/performance rules that preserve rendering and are safe to explain clearly before adding more destination-specific guidance.
