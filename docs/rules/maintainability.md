# Maintainability

Status

Implemented in Preview

---

## Category Purpose

Maintainability rules detect SVG authoring patterns that make markup harder to inspect, edit, or integrate cleanly.

These rules focus on style syntax that can often be simplified without changing rendering.

Unlike destination-specific React Ready checks, Maintainability rules are platform-independent SVG Health guidance.

---

## Implemented Rules

| ID | Title | Severity | Score Impact | Fix Type / Treatment |
| --- | --- | --- | --- | --- |
| `MAINTAINABILITY_001` | Inline Styles | Warning | 3 | Auto when every declaration is safely convertible, otherwise Manual |
| `MAINTAINABILITY_002` | Embedded CSS Classes | Warning | 3 | Auto when at least one class rule is safely inlineable, otherwise Manual |

---

## Treatment Notes

- `Inline Styles` becomes Auto only when every inline declaration maps cleanly to the safe SVG presentation-property allowlist.
- `Embedded CSS Classes` supports partial safe inlining:
  - safe simple class rules can be inlined
  - unsupported rules remain in the `<style>` block
  - the `<style>` block is removed only when no rules remain
- These treatments are implemented in the optimization engine and are already available through `Optimize SVG` and individual auto-fix actions.

---

## Scoring Notes

- Both maintainability rules are currently `Warning` findings with a score impact of `3`.
- This keeps style-related cleanup visible without weighting it as heavily as structural breakage.
- The current scoring is provisional and should remain aligned with how much authoring friction these patterns actually create in practice.

---

## Fixture References

- `inline-styles.svg`
- `inline-styles-safe.svg`
- `inline-styles-unsafe.svg`
- `css-classes-safe.svg`
- `css-classes-partial.svg`
- `css-classes-mixed.svg`
- `css-classes-unsafe-selector.svg`
- `css-classes-unsafe-declaration.svg`
- `react-inline-style.svg`
- `messy.svg`

See [docs/test-fixtures.md](/Users/fernandasampaio/Work/svg-workspace/docs/test-fixtures.md) for fixture descriptions.

---

## Future Considerations

- Standardize how rule metadata declares dynamic Auto/Manual treatment behavior.
- Consider future maintainability rules only after the metadata and treatment model is consistent across existing rules.
- Keep React-specific style-conversion concerns separate from platform-independent SVG Health checks.
