# React Ready

Status

Implemented in v0.3.0

---

## Philosophy

React Ready rules check whether an SVG is convenient to paste into JSX and use as a React component.

This category evaluates compatibility with React naming and attribute expectations.

It is not part of general SVG Health.

It does not affect the SVG Health score or Health Areas.

It belongs under Continue Working as destination-specific guidance for the React workflow.

These rules prepare the future SVG → React action.

---

## Implemented Rules

| ID | Title | Severity | Fix Type |
|----|-------|----------|----------|
| REACT_001 | class Attribute | Warning | Manual |
| REACT_002 | Kebab-case Attributes | Warning | Manual |
| REACT_003 | Inline Style String | Warning | Manual |
| REACT_004 | xlink Attribute | Info | Manual |
| REACT_005 | Inline Event Handlers | Warning | Manual |

---

## Planned Rules

- REACT_006 External Script References
- REACT_007 Deprecated Namespaces
- REACT_008 Unsafe Embedded Content

---

## Notes

- React Ready checks JSX compatibility, not rendering quality.
- React Ready is destination-specific guidance, not platform-independent SVG Health.
- These rules do not convert SVGs yet.
- A single SVG can be visually correct while still needing React-specific cleanup.
