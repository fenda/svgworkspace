# SVG Workspace Rules Inventory

Last reviewed: July 2026

This inventory reflects the currently implemented rule set in `src/analysis/rules/*`, the current fixture catalog in [docs/test-fixtures.md](/Users/fernandasampaio/Work/svg-workspace/docs/test-fixtures.md), and the current treatment wiring in `src/actions/safe-fixes/*`.

## Summary

- SVG Health rules: 23
- React Ready rules: 5
- Auto-capable rules: 13
- Manual-only rules: 12
- Choice rules in the UI: 3
- Rules with explicit metadata in code: 28
- Safe-fix treatment fallback rules remaining: 0

## Structure

| ID | Title | Category | Severity | Score Impact | Fix Type / Treatment | Status | Fixture Coverage | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `STRUCTURE_001` | Missing viewBox | Structure | Warning | 5 | Transform when width/height make generation safe, otherwise Manual | Implemented | `missing-viewbox.svg`, `scalable-width-height-only.svg`, `scalable-missing-dimensions.svg`, `messy.svg` | Strong structural penalty is consistent with missing scalability support. |
| `STRUCTURE_002` | Fixed Width & Height | Structure | Info | 2 | Auto when `viewBox` is valid, otherwise Manual | Implemented | `fixed-dimensions.svg`, `fixed-dimensions-no-viewbox.svg`, `missing-viewbox.svg`, `messy.svg`, `illustrator-export.svg` | Rule metadata now defaults to Manual and the finding upgrades to Auto only when the existing `viewBox` makes removal safe. |
| `STRUCTURE_003` | Duplicate IDs | Structure | Warning | 4 | Manual | Implemented | `duplicate-ids.svg` | Clear standalone rule with dedicated fixture. |
| `STRUCTURE_004` | Empty Groups | Structure | Info | 1 | Auto | Implemented | `empty-groups.svg`, `messy.svg` | Explicit Auto metadata now matches optimizer behavior. |
| `STRUCTURE_005` | Empty Paths | Structure | Warning | 3 | Auto | Implemented | `empty-paths.svg`, `messy.svg` | Warning severity is reasonable because empty paths usually indicate export noise or corruption. |
| `STRUCTURE_006` | Empty Definitions | Structure | Info | 1 | Auto | Implemented | `empty-defs.svg` | Explicit auto metadata is present. |
| `STRUCTURE_007` | Empty Symbols | Structure | Info | 1 | Auto | Implemented | `empty-symbols.svg` | Explicit auto metadata is present. |
| `STRUCTURE_008` | Invalid viewBox | Structure | Warning | 5 | Manual | Implemented | `invalid-viewbox.svg` | Keeps malformed scaling metadata visible without guessing a repair. |

## Performance

| ID | Title | Category | Severity | Score Impact | Fix Type / Treatment | Status | Fixture Coverage | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `PERFORMANCE_001` | Metadata Found | Performance | Info | 2 | Auto | Implemented | `metadata.svg`, `messy.svg`, `illustrator-export.svg` | Explicit Auto metadata now matches optimizer behavior. |
| `PERFORMANCE_002` | Comments Found | Performance | Info | 1 | Auto | Implemented | `comments.svg`, `messy.svg`, `illustrator-export.svg` | Lowest-impact cleanup rule; score is reasonable. |
| `PERFORMANCE_003` | High Decimal Precision | Performance | Info | 3 | Auto | Implemented | `high-precision.svg`, `messy.svg`, `illustrator-export.svg` | Explicit Auto metadata now matches optimizer behavior. |
| `PERFORMANCE_004` | Hidden Elements | Performance | Info | 2 | Auto | Implemented | `hidden-elements.svg`, `messy.svg` | Detects both direct attributes and inline style forms. |
| `PERFORMANCE_005` | Unused Definitions | Performance | Info | 2 | Auto | Implemented | `unused-defs.svg` | Explicit Auto metadata now matches optimizer behavior. |
| `PERFORMANCE_006` | Unused Namespaces | Performance | Info | 1 | Auto | Implemented | `unused-namespaces.svg`, `namespace-in-use.svg` | Includes both positive and negative coverage. |

## Colors

| ID | Title | Category | Severity | Score Impact | Fix Type / Treatment | Status | Fixture Coverage | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `COLORS_001` | Hardcoded Fill Colors | Colors | Warning | 3 | Choice in the UI | Implemented | `hardcoded-fill.svg`, `hardcoded-colors.svg`, `messy.svg`, `illustrator-export.svg` | Explicit Choice metadata now matches the current UI treatment. |
| `COLORS_002` | Hardcoded Stroke Colors | Colors | Warning | 3 | Choice in the UI | Implemented | `hardcoded-stroke.svg`, `hardcoded-colors.svg`, `messy.svg`, `illustrator-export.svg` | Explicit Choice metadata now matches the current UI treatment. |

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

- Dynamic treatment is implemented correctly for `STRUCTURE_001`, `STRUCTURE_002`, `MAINTAINABILITY_001`, and `MAINTAINABILITY_002`.
- `COLORS_001` and `COLORS_002` now declare `choice` directly in their rule definitions.
- The safe-fix layer no longer infers treatment from fallback rule ID lists. Each finding now carries an explicit fix type produced from rule metadata.

### Duplication / Overlap

- `MAINTAINABILITY_001 Inline Styles` and `REACT_003 Inline Style String` intentionally overlap in source syntax but target different outcomes: SVG maintainability vs JSX compatibility.
- `COLORS_001` and `COLORS_002` are parallel and not duplicative.
- No direct duplicate rule IDs or materially duplicated SVG Health rules were found.

### Fixture Coverage

- Every implemented rule has at least one positive fixture.
- Several rules also have useful negative or combined coverage (`namespace-in-use.svg`, `decorative-empty-title.svg`, `messy.svg`, `illustrator-export.svg`).
- The fixture catalog is stronger than the category docs currently suggest.

### Documentation Drift

- Category rule docs for Colors, Maintainability, Performance, and Structure have now been aligned with the implemented rule set.
- `docs/RULES.md` now matches the implemented metadata contract: explicit rule metadata in code, lowercase internal severity/fix-type values, and development-only metadata validation.
- Dynamic treatment behavior still deserves careful documentation because several rules default to `manual` in metadata and then upgrade the returned finding to `auto` or `choice` only when the SVG state makes that safe.

## Recommended Follow-ups

### Scoring Changes

- Revisit penalties for fully safe Auto cleanup rules such as `PERFORMANCE_001` through `PERFORMANCE_006`, `STRUCTURE_004`, `STRUCTURE_006`, and `STRUCTURE_007` so the score emphasizes user judgment and rendering risk more than removable export noise.
- Re-evaluate whether `STRUCTURE_005 Empty Paths` should stay at `3`, since it currently scores as more severe than several safe cleanup findings.
- Review whether `Choice` color findings should subtract the full 3 points each before configurable treatments exist.

### Treatment Changes

- Keep rule metadata as the treatment source of truth and avoid reintroducing rule-ID fallback inference in `src/actions/safe-fixes/index.ts`.
- Consider whether `ACCESSIBILITY_005 Decorative SVG` should remain labeled as a treatment-bearing finding or be documented as contextual review guidance only.

### Documentation Fixes

- Keep category docs aligned when dynamic treatment behavior changes, especially for `STRUCTURE_002`, `MAINTAINABILITY_001`, and `MAINTAINABILITY_002`.
- Add a short note in category docs clarifying which rules are SVG Health rules versus React Ready conversion guidance.

### Fixture Gaps

- Consider adding a dedicated fixture for `PERFORMANCE_001` + `PERFORMANCE_002` together if combined export-noise cleanup is an important regression path outside `messy.svg`.
- Consider adding a narrow fixture for `STRUCTURE_005 Empty Paths` with no other issues if deeper automated regression work is planned.

### Future Rules

- Add more maintainability rules only after the metadata/treatment pattern is standardized, so new rules do not inherit today’s fix-type inconsistency.
- Prioritize future structure/performance rules that preserve rendering and are safe to explain clearly before adding more destination-specific guidance.

## Treatment and Scoring Review

### Proposed treatment model

- `Optimize`: safe, objective improvements that preserve rendering and can run automatically with no user judgment required. This is the product-language equivalent of the current internal `Auto` treatment.
- `Review`: findings that need user context, editorial judgment, or destination-specific intent before any change should be made. This maps to the current internal `Manual` treatment.
- `Transform`: findings where multiple valid outcomes exist and the right action depends on user intent, design-system goals, or framework targets. This is the clearest product-language replacement for the current internal `Choice` treatment.
- The current code terms `auto`, `manual`, and `choice` should stay in place for now. The product should converge on `Optimize`, `Review`, and `Transform` first in documentation and later in UI copy when the treatment model is fully explicit in rule metadata.

### Scoring recommendations

- Health should emphasize objective SVG quality issues over future workflow opportunities.
- Structural and rendering-adjacent findings such as `STRUCTURE_001 Missing viewBox`, `STRUCTURE_003 Duplicate IDs`, and missing accessible titles should remain meaningful score contributors because they represent real quality or usability defects.
- Safe cleanup findings that `Optimize SVG` can resolve immediately should generally carry lighter penalties than they do today. This especially applies to metadata, comments, empty wrappers, empty definitions, empty symbols, and unused namespaces.
- `STRUCTURE_005 Empty Paths` should be reviewed for a smaller penalty. It is often export residue, and its current impact is heavier than several comparable safe cleanup findings.
- `COLORS_001` and `COLORS_002` should not heavily penalize SVG Health while they remain intent-dependent transforms. They describe styling strategy, not necessarily a broken SVG.
- `ACCESSIBILITY_003 Missing Description` and `ACCESSIBILITY_004 Empty Description` should likely stay low-impact unless the product later gains enough context to distinguish simple icons from richer illustrative SVGs.
- `ACCESSIBILITY_005 Decorative SVG` should continue to contribute `0` to Health because it is contextual guidance, not a defect.

### Metadata recommendations

- All implemented rules now declare `severity`, `scoreImpact`, `fixType`, `introducedIn`, and `status` directly in code.
- Next priority is documenting the dynamic-treatment pattern more explicitly so future rules do not guess whether a rule-level `fixType` can be overridden per finding.
- Dynamic-treatment rules should keep their runtime checks, but their metadata contract still needs to be documented more explicitly. `STRUCTURE_002`, `MAINTAINABILITY_001`, and `MAINTAINABILITY_002` are the best templates for that follow-up.
- React Ready rules are already conceptually separate from SVG Health; future metadata cleanup should preserve that distinction instead of flattening everything into one scoring model.

### Implementation follow-ups

#### Low-risk cleanup

- Consider extracting a small helper for dynamic rule metadata if future rules need to declare default treatment plus safe override behavior more often.
- Keep the development-only metadata validator current as new required fields are added.
- No fallback treatment inference remains in `src/actions/safe-fixes/index.ts`; preserving that simplification should be a maintenance goal.

#### Product decisions needed

- Decide whether `Choice` should be fully replaced in user-facing language by `Transform`.
- Decide whether hardcoded color findings belong in Health scoring at all, or whether they should be presented as styling opportunities outside the core grade.
- Decide how much auto-fixable cleanup should reduce score now that `Optimize SVG` is a first-class preview action.
- Decide whether description-related accessibility findings need more context-sensitive scoring guidance for icons versus illustrative graphics.

#### Future UI work

- Align user-facing treatment labels with the proposed `Optimize`, `Review`, and `Transform` model once the metadata is explicit enough to support it consistently.
- Separate objective Health issues from optional transformation opportunities more clearly in the interface if scoring remains coupled to both.
- Keep remaining unsafe CSS, color strategy findings, and future destination-specific workflows visible as follow-up opportunities rather than framing them as broken output.
