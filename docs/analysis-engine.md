# SVG Analysis Engine

## Purpose

The SVG Analysis Engine is the foundation of SVG Workspace.

Its job is to inspect an uploaded SVG, identify opportunities for improvement, calculate an objective quality score, and recommend the most relevant next actions.

Every feature in SVG Workspace builds upon the Analysis Engine.

---

# Principles

The Analysis Engine must be:

- Browser-first
- Deterministic
- Instant
- Explainable
- Non-destructive
- Platform independent

The engine never modifies the SVG automatically.

It only analyzes and recommends.

---

# User Journey

Upload SVG

↓

Parse SVG

↓

Analyze

↓

Calculate SVG Grade

↓

Generate Improvements

↓

Continue Working

---

# Goals

The Analysis Engine should answer three questions.

## 1. What is this SVG?

Examples:

- Dimensions
- File size
- Number of paths
- Number of colors
- Gradients
- Groups
- Symbols

---

## 2. How good is this SVG?

Evaluate:

- Structure
- Performance
- Maintainability
- Compatibility
- Accessibility (contextual)

---

## 3. What should I do next?

Generate:

- Improvement recommendations
- Workflow actions

---

# Analysis Categories

## Structure

Purpose

Determine whether the SVG follows good structural practices.

Checks

- Valid SVG
- Valid XML
- viewBox
- Width
- Height
- Scalable
- Empty groups
- Nested SVGs
- Duplicate IDs
- Unused definitions

---

## Performance

Purpose

Determine how efficiently the SVG is built.

Checks

- File size
- Metadata
- Comments
- Decimal precision
- Hidden elements
- Unused definitions
- Number of nodes

---

## Colors

Purpose

Analyze color usage.

Checks

- Number of colors
- Hardcoded fills
- Hardcoded strokes
- currentColor
- CSS variables
- Gradients
- Opacity

---

## Accessibility

Purpose

Evaluate accessibility where possible.

Checks

- title
- desc
- role
- aria-hidden
- focusable

Accessibility is contextual and may depend on the background selected by the user.

---

## Maintainability

Purpose

Measure how easy the SVG is to reuse and maintain.

Checks

- IDs
- Classes
- Grouping
- Inline styles
- Presentation attributes

---

## Compatibility

Purpose

Identify compatibility issues.

Checks

- React compatibility
- Vue compatibility
- Browser compatibility
- External references
- Deprecated features

---

# SVG Grade

The overall SVG Grade summarizes the quality of the uploaded SVG.

Example

A

92 / 100

Production Ready

The grade is calculated from the analysis categories.

Workflow actions (React, Vue, HTML, Sprite, etc.) NEVER affect the SVG Grade.

Only improvements can change the score.

---

# Improvements

Improvements increase the SVG Grade.

Examples

- Optimize SVG
- Replace Colors
- Remove Metadata
- Fix viewBox

Each improvement must explain:

- Why it matters
- Expected benefit
- Estimated impact

Example

Optimize SVG

Estimated file size reduction: 18%

Potential score gain: +5

---

# Continue Working

Workflow actions do not affect the SVG Grade.

Examples

- Convert to React
- Convert to Vue
- Convert to HTML
- Preview SVG
- Sprite Generator

These help the user continue working with their SVG.

---

# Findings

Each finding contains:

- Severity
- Title
- Description
- Recommendation (optional)

Severity levels

- Success
- Info
- Warning
- Error

---

# Future

Future versions may include:

- Accessibility score
- Animation analysis
- Icon consistency analysis
- Design system checks
- AI explanations

These are not part of the MVP.

---

## Scoring

- Revisit SVG Health scoring once we have more analysis rules.
- Current scores are too generous because SVGs rarely fall below B / ~81.
- Options:
  - Increase score impact for critical rules.
  - Add severity weighting.
  - Add more high-value rules before finalizing grade bands.
  - Consider category scores before overall score.
- Do not tune scoring too early. Wait until we have ~15–20 rules.

---

# Product Philosophy

SVG Workspace does not begin with conversion.

It begins with understanding.

Every SVG should first be analyzed.

Only then should the user decide how to improve it or continue working.
