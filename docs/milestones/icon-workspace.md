# Icon Workspace

Status: In Progress

## Goal

Support safe, deterministic transformations for standalone icons directly inside SVG Workspace.

## Current Capabilities

- [x] Dedicated Icon Workspace panel for non-sprite SVGs
- [x] Shared transformation pipeline with applicability checks
- [x] Appearance transformations
- [x] Geometry and canvas transformations
- [x] Live Preview / SVG / Diff synchronization
- [x] Undo / Redo / Reset to original
- [x] Preview background modes
- [x] Preview size controls
- [x] Output size controls
- [x] Export current or original standalone SVG
- [x] Export Studio shared export-source architecture

## Included in this milestone

- [x] Convert to currentColor
- [x] Remove fill
- [x] Remove stroke
- [x] Remove inline fill attributes
- [x] Remove inline stroke attributes
- [x] Normalize to square canvas
- [x] Uniform padding presets
- [x] Remove padding
- [x] Reset canvas geometry
- [x] Custom viewBox editor
- [x] Output size controls
- [x] Preview size controls
- [x] Geometry summary and warnings

## Next Follow-ups

- [ ] Canvas-bound artwork-fit transformations such as centering or resize-to-bounds
- [ ] Safe geometry transformations that still avoid direct path editing
- [ ] Add more icon-specific transformations where parser facts make them deterministic
- [ ] Consider future multi-icon collection workflows separately from the standalone Icon Workspace
