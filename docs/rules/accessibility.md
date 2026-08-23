# Accessibility

Status

Implemented in v0.2.2

---

## Philosophy

Accessibility rules help determine whether an SVG can be understood by assistive technologies.

Unlike Performance or Structure, Accessibility findings are often contextual.

SVG Workspace should provide guidance rather than absolute pass/fail judgments whenever user intent cannot be inferred.

---

## Implemented Rules

| ID | Title | Severity | Fix Type |
|----|-------|----------|----------|
| ACCESSIBILITY_001 | Missing Title | Info | Manual / context required |
| ACCESSIBILITY_002 | Empty Title | Info | Manual / context required |
| ACCESSIBILITY_003 | Missing Description | Info | Manual / context required |
| ACCESSIBILITY_004 | Empty Description | Info | Manual / context required |
| ACCESSIBILITY_005 | Decorative SVG | Info | Manual |

---

## Treatment And Scoring Notes

- These rules report SVG facts and provide Review guidance; they do not reduce SVG Health because the embedding context is unavailable.
- Decorative SVGs and sprite containers are exempt from title and description guidance.
- A non-empty `aria-label` or `aria-labelledby` also satisfies the internal accessible-name check, so a missing `<title>` is not reported in that case.
- Only direct child `<title>` and `<desc>` elements are considered. A title inside a `<symbol>` does not name the root SVG document.
- Empty title and description guidance is also skipped when decorative markup or another accessible name makes the empty child irrelevant.

## Future Considerations

- Consider context-aware accessibility review only when SVG Workspace receives explicit embedding information.
- Do not add contrast checks without an authoritative rendering background and usage context.

---

## References

- W3C SVG Accessibility
- MDN SVG Accessibility
- WCAG 2.2

---

## Fixture References

- `missing-title.svg`
- `empty-title.svg`
- `missing-desc.svg`
- `empty-desc.svg`
- `decorative-aria-hidden.svg`
- `decorative-role-presentation.svg`
- `decorative-role-none.svg`
- `decorative-empty-title.svg`

## Notes

Accessibility is inherently contextual.

For example:

- A decorative icon may intentionally omit `<title>`.
- A chart almost certainly requires both `<title>` and `<desc>`.
- Decorative SVGs can intentionally omit `<title>` and `<desc>` when they are explicitly hidden from assistive technologies.
- Meaningful SVGs should provide an accessible title, and sometimes a description depending on complexity.

SVG Workspace should avoid making absolute recommendations when user intent cannot be determined.
