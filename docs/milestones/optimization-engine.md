# Optimization Engine

Status: Next

## Output

- [ ] Improve formatted SVG output
- [ ] Better diff visualization

## Optimize SVG Improvements

These improvements continue expanding the Safe Fix Engine behind the user-facing `Optimize SVG` action.

- [ ] Remove unused defs
- [x] Remove empty defs
- [x] Remove empty symbols
- [x] Remove unused namespaces
- [ ] Normalize whitespace
- [ ] Generate missing viewBox in safe cases
- [ ] Normalize IDs as an optional treatment
- [ ] Add additional performance optimizations

## Structure Cleanup

- [x] Remove fixed width and height when a valid `viewBox` already exists
- [x] Convert safe inline style attributes to presentation attributes
- [x] Inline simple embedded CSS classes to presentation attributes

## CSS Treatments

- [x] Auto-inline simple single-class embedded CSS when every declaration is a safe presentation property
- [ ] Keep complex CSS selectors and unsupported declarations as manual review

## Analysis

- [ ] Add more performance rules
- [ ] Add more maintainability rules
- [ ] Improve explanations
- [ ] Improve issue grouping

## Future Treatments

- [ ] Inline CSS / style extraction: convert safe inline style declarations into SVG presentation attributes directly on SVG elements and paths when safe, while keeping complex CSS and manual styles as Review
