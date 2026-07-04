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
- React Ready (planned)

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

Every rule should have one status.

Possible values:

- Planned
- Implemented
- Deprecated

Deprecated rule identifiers must never be reused.

---

# Required Metadata

Every rule should define:

- ID
- Category
- Title
- Description
- Severity
- Score Impact
- Fix Type
- Introduced Version

Example:

```yaml
id: PERFORMANCE_001
category: Performance
severity: Warning
scoreImpact: 8
fixType: Auto
introducedIn: 0.2.0
```

---

# Severity

Allowed values:

- Critical
- Major
- Warning
- Info

Severity expresses importance independently of scoring.

The current scoring model is provisional.

---

# Fix Types

Every rule must define one fix type.

## Auto

Safe to perform automatically.

Examples:

- Remove metadata
- Remove comments
- Round decimals

## Manual

Requires user judgment.

Examples:

- Missing viewBox
- Duplicate IDs

## Choice

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