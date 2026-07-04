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
Apply treatments
↓
Continue Working
```

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
4. Continue Working

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

# Implemented Features

## Upload

- Drag & Drop
- File picker
- Paste SVG
- Example SVG

---

## Preview

- SVG rendering
- Preview / SVG source tabs
- Zoom controls
- Fullscreen
- Metadata extraction
- Copy SVG
- Download SVG

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

### Performance

- Metadata Found
- Comments Found
- High Decimal Precision
- Hidden Elements

### Colors

- Hardcoded Fill Colors
- Hardcoded Stroke Colors

### Accessibility

- Missing Title
- Empty Title
- Missing Description
- Empty Description

### Maintainability

- Inline Styles

---

## SVG Health

- Provisional health score
- Letter grade
- Progress bar
- Issue count
- Health check count
- Auto / Manual / Choice issue classification

Scoring is currently provisional and should be recalibrated after more rules are added.

---

## Safe Fixes

Safe automatic fixes are implemented for:

- Remove metadata
- Remove comments
- Round high-precision numeric values
- Remove empty groups
- Remove empty paths
- Remove hidden elements

The global Apply Safe Fixes action applies all safe automatic fixes and then re-runs analysis.

Individual Fix buttons are implemented for automatic issues.

Manual and Choice issues remain placeholders for future workflows.

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
- hardcoded-stroke.svg
- high-precision.svg
- duplicate-ids.svg
- metadata.svg
- comments.svg
- empty-groups.svg
- empty-paths.svg
- hidden-elements.svg
- inline-styles.svg
- illustrator-export.svg

good.svg is the canonical regression fixture and should always return:

✓ No issues detected.

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

Core detection, scoring, safe fixes and export workflow are implemented.

Continue expanding health coverage deliberately.

---

## Phase 2 — Treatments

Actions become available based on findings.

Implemented:

- Apply Safe Fixes
- Individual Fix buttons for automatic issues

Future:

- Replace Colors
- Fix Dimensions
- Convert to currentColor
- Manual review flows
- Configurable Choice flows

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
4. Add React readiness checks.
5. Add React Ready health checks.
6. Improve SVG source formatting.
7. Add before/after comparison.
8. Add undo support.
9. Build configurable Choice actions, starting with Replace Colors.

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
- Safe Fixes
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
- Manual and Choice actions remain placeholders

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
Apply Safe Fixes or individual automatic fixes
↓
Re-analyze
↓
Inspect SVG source
↓
Copy or Download SVG
```

This is the first complete usable SVG Workspace workflow.
