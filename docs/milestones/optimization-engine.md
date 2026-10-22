# Optimization Engine

Status: Next

## Output

- [x] Improve formatted SVG output while preserving text-sensitive content
- [x] Preserve text-sensitive SVG markup during formatted output
- [x] Better diff visualization with original and current line numbers
- [x] Add Optimization Report after `Optimize SVG`
- [x] Add a read-only Optimization Timeline based on real intermediate safe-fix outputs
- [x] Keep optimization reporting in `SVG Details` while leaving `SVG Health` focused on score, areas, and issues
- [x] Position `Generate ViewBox` as the first Transform action alongside scalable SVG analysis

## Optimize SVG Improvements

These improvements continue expanding the Safe Fix Engine behind the user-facing `Optimize SVG` action.

Transform actions are intentionally separate from automatic optimizations:

- `Optimize SVG` remains the safe automatic path
- `Generate ViewBox` is the first intent-dependent Transform action
- `Convert to currentColor` is an explicit Transform for direct hardcoded paint attributes only

- [x] Remove unused defs
- [x] Remove empty defs
- [x] Remove empty symbols
- [x] Remove unused namespaces
- [x] Normalize structural whitespace while preserving text-sensitive content
- [x] Generate missing viewBox in safe cases as a Transform
- [x] Normalize IDs as an explicit Markup Transform with external-reference warning
- [x] Add measured performance optimization and review coverage

## Structure Cleanup

- [x] Remove fixed width and height when a valid `viewBox` already exists
- [x] Add scalable SVG analysis states and safe `Generate ViewBox` transform handling
- [x] Convert safe inline style attributes to presentation attributes
- [x] Inline simple embedded CSS classes to presentation attributes

## CSS Treatments

- [x] Auto-inline simple single-class embedded CSS when safe rules can be isolated
- [x] Preserve unsupported embedded CSS rules while removing only the safe rules that were successfully inlined
- [x] Keep complex CSS selectors and unsupported declarations as manual review with explicit blocker guidance

## Analysis

- [x] Add optional SVG type context and contextual Insights in the Inspector
- [x] Complete an SVG Analysis and Health Quality Pass with objective scoring, context-aware accessibility guidance, and verified internal-reference detection
- [x] Add embedded-raster performance guidance
- [x] Add measured legacy xlink maintainability guidance with an explicit migration Transform
- [x] Explain each finding's Health impact directly in the issues list
- [x] Group findings by Health category for easier scanning

## Future Treatments

- [x] Inline CSS / style extraction for safe presentation properties while keeping complex CSS as Review
- [x] Convert eligible direct `fill` and `stroke` attributes to `currentColor` as an explicit Transform
