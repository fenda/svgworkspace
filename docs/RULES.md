# SVG Workspace Rule Specification

## Purpose

Rules are the foundation of SVG Workspace.

Every rule should answer one question:

> "What makes this SVG healthier, more maintainable, more compatible, or more accessible?"

Rules should:

- Detect one concern only.
- Produce deterministic results.
- Be independently testable.
- Have a dedicated regression fixture.
- Never modify the SVG directly.
- Be reusable by any UI.

---

# Core Principle

> **Rules define knowledge. Treatments define behavior.**

Rules exist to detect and explain SVG quality.

Treatments consume findings to improve SVGs.

The analysis engine should never perform modifications directly.

---

# Rule Philosophy

Rules should:

- Be small.
- Be predictable.
- Be independent.
- Prefer clarity over cleverness.

Avoid combining multiple concerns into one rule.

Good:

- Missing viewBox
- Empty Groups
- Missing Title

Bad:

- SVG Structure Problems

---

# Rule Responsibilities

Rules only detect.

Rules do not:

- modify SVGs
- perform treatments
- trigger actions
- know about UI
- know about routing
- know about React components

Rules produce findings.

Everything else consumes those findings.

---

# Rule Independence

Rules must never depend on another rule.

Every rule should be executable independently.

If multiple rules require similar logic, they should share helper utilities instead of depending on each other's findings.

---

# Rule Categories

Every rule belongs to exactly one category.

Current categories:

- Structure
- Performance
- Colors
- Maintainability
- Accessibility
- React Ready

Categories are responsible for:

- grouping findings
- category scoring
- future filtering
- future documentation

A rule must never belong to multiple categories.

Additional categories may be introduced in future versions.

---

# Rule Identifier

Every rule must have a permanent identifier.

Convention:

CATEGORY_001

Examples:

STRUCTURE_001
PERFORMANCE_003
COLORS_002
ACCESSIBILITY_001
REACT_004

Identifiers:

- must never change
- must never be reused
- should remain stable forever

---

# Rule Status

Every implemented rule has one status.

Possible values:

- `planned`
- `implemented`
- `deprecated`

Deprecated rule identifiers must never be reused.

---

# Required Metadata

Every implemented rule definition in `src/analysis/rules/**` now declares:

- `id`
- `category`
- `title`
- `description`
- `severity`
- `scoreImpact`
- `fixType`
- `introducedIn`
- `status`

Findings inherit this metadata from the rule.

When treatment is context-dependent, a rule may override `fixType` at finding time while keeping the rule metadata as the default classification.

Example:

```yaml
id: PERFORMANCE_001
category: performance
title: Metadata Found
description: Metadata elements were detected.
severity: info
scoreImpact: 2
fixType: auto
introducedIn: 0.2.0
status: implemented
```

---

# Severity

Allowed values:

- `error`
- `warning`
- `info`
- `success`

Current analysis rules use `warning` and `info`.

Severity expresses importance independently of scoring.

The current scoring model is provisional.

---

# Fix Types / Treatments

Every rule must define one fix type.

Internal values:

- `auto`
- `manual`
- `choice`

Product language may describe these as Optimize, Review, and Transform, but the current implementation uses the internal values above.

## auto

Safe to perform automatically.

Examples:

- Remove metadata
- Remove comments
- Round decimals

## manual

Requires user judgment.

Examples:

- Missing viewBox
- Duplicate IDs

## choice

Requires user configuration.

Examples:

- Replace Colors
- Convert to currentColor

---

# Regression Fixtures

Every rule must have at least one regression fixture.

Fixture naming examples:

- missing-title.svg
- comments.svg
- empty-groups.svg

Regression fixtures should be intentionally small.

Prefer one fixture per rule whenever practical.

Avoid large "kitchen sink" SVGs unless they exist specifically to validate combined behavior.

Fixtures should remain stable over time.

---

# Metadata Validation

Rule registration performs lightweight development-only metadata validation.

During development, SVG Workspace warns when a registered rule is missing:

- `severity`
- `scoreImpact`
- `fixType`
- `status`
- other required rule metadata

These warnings do not block production builds.

---

# Documentation

Every rule should eventually have documentation.

Documentation should include:

- Why it matters
- Detection logic
- Examples
- Recommended treatment
- Related rules

Documentation should reference the permanent Rule ID.

---

# Scoring

Current scoring is provisional.

Rules contribute through `scoreImpact`.

Future versions may use weighted scoring.

Do not optimize rule design around the current scoring algorithm.

Scoring may evolve.

Rule identifiers must not.

---

# Coding Principles

Rules must:

- be deterministic
- have no side effects
- never mutate the SVG
- return findings only
- be browser-safe
- be independently testable

---

# Rule Lifecycle

Every rule should complete the following lifecycle.

```
Idea
↓
Regression Fixture
↓
Implementation
↓
Health Category
↓
Treatment (optional)
↓
Documentation
```

A health dimension should not be considered complete until every implemented rule has completed this lifecycle.

---

# Checklist

Before merging a new rule:

- Stable ID
- Correct category
- Clear title
- Clear description
- Appropriate severity
- Score impact defined
- Fix type assigned
- Introduced version recorded
- Status recorded
- Regression fixture added
- Manual testing completed
- Documentation planned or added

---

# Versioning

Rules are permanent.

Metadata may evolve.

Scoring may evolve.

Treatments may evolve.

Identifiers must never change.

---

# Product Principle

SVG Workspace is a health checker before it is an optimizer.

Rules define knowledge.

Treatments define behavior.

Every new rule should strengthen SVG Health before expanding SVG Workspace into additional tools.
