# Accessibility

Status

Implemented in v0.2.1

---

## Philosophy

Accessibility rules help determine whether an SVG can be understood by assistive technologies.

Unlike Performance or Structure, Accessibility findings are often contextual.

SVG Workspace should provide guidance rather than absolute pass/fail judgments whenever user intent cannot be inferred.

---

## Implemented Rules

| ID | Title | Severity | Fix Type |
|----|-------|----------|----------|
| ACCESSIBILITY_001 | Missing Title | Warning | Manual |
| ACCESSIBILITY_002 | Empty Title | Warning | Manual |
| ACCESSIBILITY_003 | Missing Description | Info | Manual |
| ACCESSIBILITY_004 | Empty Description | Info | Manual |

---

## Planned Rules

- ACCESSIBILITY_005 Decorative SVG Detection
- ACCESSIBILITY_006 Missing Role
- ACCESSIBILITY_007 Missing aria-labelledby
- ACCESSIBILITY_008 Missing aria-describedby
- ACCESSIBILITY_009 Focusable SVG
- ACCESSIBILITY_010 Keyboard Accessibility

---

## References

- W3C SVG Accessibility
- MDN SVG Accessibility
- WCAG 2.2

---

## Notes

Accessibility is inherently contextual.

For example:

- A decorative icon may intentionally omit `<title>`.
- A chart almost certainly requires both `<title>` and `<desc>`.

SVG Workspace should avoid making absolute recommendations when user intent cannot be determined.
