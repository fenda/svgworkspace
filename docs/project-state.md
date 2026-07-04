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
- Zoom controls
- Fullscreen
- Metadata extraction

---

## Analysis Engine

Implemented as modular rules.

Current rules:

### Structure

- Missing viewBox
- Fixed Width & Height
- Duplicate IDs

### Performance

- Metadata Found
- Comments Found
- High Decimal Precision

### Colors

- Hardcoded Fill Colors
- Hardcoded Stroke Colors

---

## Test Fixtures

Current fixtures include:

- good.svg
- messy.svg
- hardcoded-fill.svg
- hardcoded-stroke.svg
- high-precision.svg
- duplicate-ids.svg
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

Focus on detection.

Continue adding analysis rules.

Potential categories:

- Structure
- Performance
- Colors
- Accessibility
- React Readiness

---

## Phase 2 — Treatments

Actions become available based on findings.

Examples:

- Optimize SVG
- Replace Colors
- Fix Dimensions
- Convert to currentColor

---

## Phase 3 — Continue Working

Implement production tools:

- React
- Vue
- HTML
- Sprite
- Download

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

1. Expand analysis coverage.
2. Implement SVG Health scoring.
3. Build Optimize SVG action.
4. Connect actions directly to findings.
5. Add before/after comparison.
6. Add undo support.

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