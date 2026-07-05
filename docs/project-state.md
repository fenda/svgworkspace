# SVG Workspace — Project State

_Last updated: July 2026_

---

# Vision

SVG Workspace is a browser-first developer tool that helps developers understand, improve and transform SVGs.

The product is built around a simple workflow:

```
Upload
↓

Understand

↓

Improve

↓

Continue Working
```

Rather than being "another SVG optimizer", SVG Workspace aims to become an SVG Health Checker.

The optimizer, converter and other tools are treatments that follow the health assessment.

---

# Product Principles

SVG Workspace is:

- Browser-first
- Privacy-first
- Health-first
- Rule-driven
- Modular

Every new feature should strengthen one or more of these principles.

Core workflow:

```
Upload SVG
↓
Analyze SVG Health
↓
Understand the findings
↓
Optimize SVG
↓
Compare output
↓
Export
```

---

## Preview Principle

SVG Workspace Preview intentionally exposes only workflows that users can complete today.

Future workflows remain part of the roadmap but are intentionally hidden until implementation begins.

---

## Current Focus

SVG Workspace currently prioritizes:

```
Upload
↓
Analyze
↓
Optimize
↓
Compare
↓
Export
```

The Optimization Engine is now the primary focus of the product.

The core optimization workflow is now complete.

---

## Product Priorities

Current priority:

- Optimization Engine

Future priorities:

- Icon Workspace
- Sprite Builder
- Continue Working
- React
- Vue
- HTML
- Batch Processing

Destination-specific workflows are intentionally postponed until the optimization workflow is mature.

---

## UX Principles

- Prioritize the user's own SVG over demo content.
- Reduce unnecessary UI.
- Prefer one clear primary action.
- Remove placeholder functionality whenever possible.
- Prefer simplifying the current experience over exposing unfinished workflows.
- Explain what happened.
- Explain how to fix it.
- Never silently fail.

---

# Milestone Documents

Detailed milestone docs live in:

- docs/milestones/preview.md
- docs/milestones/optimization-engine.md
- docs/milestones/icon-workspace.md
- docs/milestones/sprite-builder.md
- docs/milestones/continue-working.md

These docs define the execution order after Preview.

## Rules Audit

A rules, treatment, and scoring audit is now in progress.

Current inventory and follow-up notes live in:

- docs/rules-inventory.md

---

# Product Philosophy

## Browser First

Everything should happen locally whenever possible.

SVGs should never leave the user's browser unless a future feature explicitly requires it.

Privacy is a core feature.

---

## Understand Before Fixing

Never optimize blindly.

Always explain:

- what was detected
- why it matters
- how to fix it

Actions exist because analysis found a problem.

---

## Progressive Workflow

The application should naturally guide users through:

1. Upload SVG
2. Health Assessment
3. Fix Issues
4. Compare Output
5. Export

---

## Treatment language

SVG Workspace now uses this product language:

- `Optimize`: safe automatic improvements
- `Review`: actions that require user judgment
- `Transform`: valid intent-dependent actions

The first Transform action is `Generate ViewBox`.

---

## Keep It Simple

The UI should feel closer to:

- Linear
- Raycast
- Vercel
- GitHub

Avoid dashboards full of charts or decorative widgets.

---

# Current Architecture

```
Upload

↓

SVG Parser

↓

Analysis Engine

↓

Analysis Rules

↓

Findings

↓

SVG Health

↓

Actions
```

The analysis engine is completely independent from the UI.

Rules return Findings only.

Consumers decide how to display those findings.

---

## Upload Validation

SVG Workspace should explain upload problems clearly and inline.

Supported validation states:

- Unsupported file
- Invalid SVG
- Invalid pasted content
- Empty SVG
- Unexpected error

Upload validation philosophy:

- Explain what happened.
- Explain how to fix it.
- Never silently fail.

---

# Current Workspace

Current layout:

- Hero
- Upload
- Workspace

Workspace contains:

Left

- SVG Preview

Right

- SVG Health
- Issues

Below

- Continue Working

---

## Layout

Status

Frozen

Only usability improvements are allowed.

Structural redesigns should happen only when a new workflow requires them.

---

## Platform Strategy

SVG Workspace is desktop-first.

The optimization workflow is designed for desktop browsers.

Tablet support is progressive.

On mobile devices (`<768px`), the desktop workspace is replaced with a lightweight landing page explaining the project and encouraging users to continue on desktop.

This is an intentional product decision.

---

# Implemented Features

## Upload

- Drag & Drop
- File picker
- Paste SVG

Example SVGs remain available internally for development, but are intentionally not part of the primary user workflow.

---

## Preview

- SVG rendering
- Preview / SVG / Diff tabs
- Improved zoom controls
- Background switcher
- Metadata extraction
- Copy formatted SVG
- Download formatted SVG
- Original SVG vs current SVG comparison

The current SVG document is the source of truth.

The original uploaded SVG is preserved for comparison.

## Preview Experience

The Preview panel is optimized for desktop inspection.

Implemented:

- Instant background switching for transparent, checkerboard, white, and dark preview canvases
- Improved zoom controls for zoom in, zoom out, fit, and reset
- Tooltips across preview controls for faster inspection
- Background changes affect only the preview canvas and never the uploaded SVG itself

The preview workflow is intended to support rapid inspection before and after `Optimize SVG`.

---

## Analysis Engine

Implemented as modular rules.

Current rules:

### Structure

- Missing viewBox
- Fixed Width & Height
- Duplicate IDs
- Empty Groups
- Empty Paths
- Empty Definitions
- Empty Symbols

### Performance

- PERFORMANCE_001 — Metadata Found
- PERFORMANCE_002 — Comments Found
- PERFORMANCE_003 — High Decimal Precision
- PERFORMANCE_004 — Hidden Elements
- PERFORMANCE_005 — Unused Definitions
- PERFORMANCE_006 — Unused Namespaces

### Colors

- Hardcoded Fill Colors
- Hardcoded Stroke Colors

### Accessibility

- Missing Title
- Empty Title
- Missing Description
- Empty Description
- Decorative SVG

### Maintainability

- Inline Styles
- Embedded CSS Classes

---

## SVG Health

- Provisional health score
- Letter grade
- Progress bar
- Issue count
- Health check count
- Optimize / Review / Transform issue classification

Scoring is currently provisional and should be recalibrated after more rules are added.

---

## Safe Fix Engine

Safe automatic fixes are implemented for:

- Remove fixed width and height when a valid viewBox already exists
- Remove metadata
- Remove comments
- Round high-precision numeric values
- Remove empty groups
- Remove empty paths
- Remove empty <defs>
- Remove empty <symbol>
- Remove hidden elements
- PERFORMANCE_005 — Remove unused definitions
- PERFORMANCE_006 — Remove unused namespace declarations
- Convert simple inline styles to presentation attributes when every declaration is safely convertible
- Inline safe embedded CSS class rules while preserving unsupported rules in the same <style> block

The user-facing `Optimize SVG` action applies all safe automatic fixes and then re-runs analysis.

Internally, this workflow is powered by the Safe Fix Engine.

Transform actions are related but distinct:

- `Optimize SVG` applies only safe automatic improvements
- Transform actions remain explicit user-triggered changes
- `Generate ViewBox` is the first Transform action

After each `Optimize SVG` run, SVG Workspace keeps `SVG Health` focused on:

- current grade
- current score
- health areas
- issues

Optimization reporting lives in `SVG Details`.

`SVG Details` keeps the same two-column structure before and after optimization:

- left column: stable metric cards
- right column: applied optimizations

After optimization, `SVG Details` shows the full post-optimization report:

- file size before → after
- bytes saved
- percentage saved
- structural metadata such as paths, viewBox, colors, and scalable status
- applied optimization labels

Before optimization, the same layout remains visible with a calm empty applied-optimizations state.

Uploading or pasting a new SVG clears the report.

Individual actions are implemented for automatic issues, and specific Transform issues can expose dedicated actions such as `Generate ViewBox`.

Individual Fix buttons currently leave the Optimization Report unchanged.

Transform issues are reserved for safe but intentional changes that should never run automatically, such as `Generate ViewBox`.

Manual issues remain review-oriented and continue to require user judgment.

The current scalability model is:

- `Scalable`: valid `viewBox`, no fixed dimensions
- `Mostly scalable`: valid `viewBox` with fixed dimensions still present
- `Not scalable`: missing `viewBox`
- `Invalid`: malformed `viewBox`

`Scalable` replaces the older `Responsive` metric throughout the Workspace because the analysis is about SVG scaling behavior, not CSS responsiveness.

---

## Output Formatting

SVG Workspace formats the current SVG output for inspection and export.

Formatting currently:

- removes excessive blank lines
- trims whitespace-only text nodes where safe
- normalizes indentation
- preserves valid SVG structure
- preserves rendering
- preserves `title`
- preserves `desc`
- preserves accessibility-related attributes

Formatting is intentionally readable rather than aggressively minified.

---

## Compare Output

Users can compare:

Original SVG

↓

Current optimized SVG

The Diff view is line-based and is intended to explain what changed before export.

---

## Test Fixtures

Current fixtures include:

- good.svg
- messy.svg
- hardcoded-fill.svg
- accessibility-good.svg
- missing-title.svg
- empty-title.svg
- missing-desc.svg
- empty-desc.svg
- decorative-aria-hidden.svg
- decorative-role-presentation.svg
- decorative-role-none.svg
- decorative-empty-title.svg
- fixed-dimensions.svg
- fixed-dimensions-no-viewbox.svg
- scalable-viewbox-only.svg
- scalable-width-height-only.svg
- scalable-both.svg
- scalable-missing-dimensions.svg
- invalid-viewbox.svg
- hardcoded-stroke.svg
- high-precision.svg
- duplicate-ids.svg
- metadata.svg
- comments.svg
- unused-defs.svg
- empty-defs.svg
- empty-symbols.svg
- unused-namespaces.svg
- namespace-in-use.svg
- inline-styles-safe.svg
- inline-styles-unsafe.svg
- css-classes-safe.svg
- css-classes-partial.svg
- css-classes-unsafe-selector.svg
- css-classes-unsafe-declaration.svg
- css-classes-mixed.svg
- empty-groups.svg
- empty-paths.svg
- hidden-elements.svg
- inline-styles.svg
- illustrator-export.svg
- react-good.svg
- react-class-attribute.svg
- react-kebab-attributes.svg
- react-inline-style.svg
- react-xlink.svg
- react-event-handlers.svg

good.svg is the canonical regression fixture and should always return:

✓ No issues detected.

`Fixed Width & Height` is only treated as an automatic fix when a valid `viewBox` already exists.

`Inline Styles` is only treated as an automatic fix when every inline declaration is a safe SVG presentation property.

`Unused Namespaces` is only treated as an automatic fix when a prefixed namespace declaration is not referenced by any element or attribute name in the document.
`Embedded CSS Classes` is treated as an automatic fix when at least one simple single-class rule uses only safe SVG presentation properties.

Unsafe embedded CSS rules are preserved, and a `<style>` block is only removed when no CSS rules remain after safe inlining.

---

# Design Principles

- Dark-first interface
- No global light mode for MVP
- Compact developer-focused layout
- Clear information hierarchy
- Minimal visual noise

---

# Roadmap

## Phase 1 — SVG Health

Core detection, scoring, Safe Fix Engine improvements, compare output, and export workflow are implemented.

Continue expanding health coverage deliberately.

---

## Phase 2 — Treatments

Actions become available based on findings.

Implemented:

- Optimize SVG
- Individual Fix buttons for automatic issues

Future:

- Replace Colors
- Fix Dimensions
- Convert to currentColor
- Manual review flows
- Configurable Transform flows

---

## Phase 3 — Continue Working

Implemented:

- SVG source view
- Copy SVG
- Download SVG

Future:

- React
- Vue
- HTML
- Sprite

React Ready checks belong in this workflow area.

They are destination-specific guidance for future React conversion and do not affect the platform-independent SVG Health score.

---

## Phase 4 — Professional Features

Potential additions:

- Batch processing
- CLI
- VS Code extension
- GitHub Action
- Design token export

---

# Current Priorities

1. Validate the current v0.1 workflow with real SVGs.
2. Recalibrate SVG Health scoring after more rules are added.
3. Expand accessibility health coverage.
4. Surface React Ready checks inside Continue Working.
5. Add React conversion guidance from React Ready findings.
6. Improve SVG source formatting.
7. Add before/after comparison.
8. Add undo support.
9. Build configurable Transform actions, starting with Replace Colors.

---

# Working Principles

Every new analysis rule should include:

- Rule implementation
- Regression fixture
- Documentation
- Manual verification

The workflow should always be:

```
Rule

↓

Fixture

↓

Manual Test

↓

Implementation

↓

Verification
```

---

# Product Positioning

SVG Workspace is not primarily an SVG converter.

It is an SVG Health Checker.

It helps developers understand the quality of their SVGs, improve them, and continue working with confidence.

Everything else is built on top of that idea.

---

## Milestones

### ✅ MVP Milestone 1

Browser-first SVG Health

Completed

- Upload
- Analysis Engine
- Health Score
- Optimize SVG
- Re-analysis

### ✅ MVP Milestone 2

Ready to Export

Completed

- Preview / SVG tabs
- SVG source viewer
- Copy SVG
- Download SVG
- Export current optimized SVG state

### ✅ MVP Milestone 3

Individual Fixes

Completed

- Auto issue Fix buttons
- Single-finding safe fix flow
- Re-analysis after individual fixes
- First Transform action for `Generate ViewBox`
- Remaining Manual and future Transform actions remain placeholders

---

# Current v0.1 Workflow

The current working product loop is:

```
Upload SVG
↓
Analyze SVG Health
↓
Review Issues
↓
Optimize SVG or use individual automatic fixes
↓
Re-analyze
↓
Inspect SVG source
↓
Copy or Download SVG
```

This is the first complete usable SVG Workspace workflow.

---

# Product Direction

## Current Focus

SVG Workspace is currently focused on delivering the best possible single-SVG optimization workflow.

Priority:

Upload
→ Analyze
→ Optimize
→ Compare
→ Export

This workflow takes precedence over destination-specific workflows such as React or Vue.

## Future Workflows

These workflows remain part of the long-term vision but are intentionally postponed until the optimization engine is mature.

- React
- Vue
- HTML
- Sprite Builder
- Batch Processing

## UX Principles

- Prioritize the user's own SVG over demo content.
- Reduce unnecessary UI and helper text.
- Prefer one clear primary action over multiple competing actions.
- Remove placeholder functionality from the primary workflow whenever possible.

### Workspace behavior

After a successful:

- Upload
- Paste
- Example selection

the application automatically scrolls the user to the SVG Workspace.

This is an intentional UX decision to immediately expose analysis results and reduce unnecessary scrolling.
