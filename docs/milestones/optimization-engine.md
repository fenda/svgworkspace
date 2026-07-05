# Optimization Engine

Status: Next

## Output

- [ ] Improve formatted SVG output
- [ ] Better diff visualization
- [x] Add Optimization Report after `Optimize SVG`
- [x] Keep optimization reporting in `SVG Details` while leaving `SVG Health` focused on score, areas, and issues
- [x] Position `Generate ViewBox` as the first Transform action alongside scalable SVG analysis

## Optimize SVG Improvements

These improvements continue expanding the Safe Fix Engine behind the user-facing `Optimize SVG` action.

Transform actions are intentionally separate from automatic optimizations:

- `Optimize SVG` remains the safe automatic path
- `Generate ViewBox` is the first intent-dependent Transform action
- `Use currentColor` is an explicit Transform for direct hardcoded paint attributes only

- [ ] Remove unused defs
- [x] Remove empty defs
- [x] Remove empty symbols
- [x] Remove unused namespaces
- [ ] Normalize whitespace
- [x] Generate missing viewBox in safe cases as a Transform
- [ ] Normalize IDs as an optional treatment
- [ ] Add additional performance optimizations

## Structure Cleanup

- [x] Remove fixed width and height when a valid `viewBox` already exists
- [x] Add scalable SVG analysis states and safe `Generate ViewBox` transform handling
- [x] Convert safe inline style attributes to presentation attributes
- [x] Inline simple embedded CSS classes to presentation attributes

## CSS Treatments

- [x] Auto-inline simple single-class embedded CSS when safe rules can be isolated
- [x] Preserve unsupported embedded CSS rules while removing only the safe rules that were successfully inlined
- [ ] Keep complex CSS selectors and unsupported declarations as manual review

## Analysis

- [ ] Add more performance rules
- [ ] Add more maintainability rules
- [ ] Improve explanations
- [ ] Improve issue grouping

## Future Treatments

- [ ] Inline CSS / style extraction: convert safe inline style declarations into SVG presentation attributes directly on SVG elements and paths when safe, while keeping complex CSS and manual styles as Review
- [x] Convert eligible direct `fill` and `stroke` attributes to `currentColor` as an explicit Transform
