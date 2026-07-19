# Workspace

This document describes intentional user experience decisions for the SVG Workspace. These behaviors should be preserved unless there is a deliberate product decision to change them.

---

## Upload flow

After a successful:

- File upload
- Paste
- Example selection

the application automatically scrolls the user to the Workspace.

### Rationale

Users should immediately see the analysis results without manually searching for them on the page.

The intended workflow is:

1. Upload an SVG.
2. Automatically arrive at the Workspace.
3. Review SVG Health.
4. Apply optimizations.
5. Compare changes.
6. Export the appropriate output from Export Studio.

---

## Preview

### Automatic background

After an SVG is loaded, the preview canvas automatically selects the most suitable background:

- Dark SVG → Light background
- Light SVG → Dark background
- Mixed or transparent SVG → Checkerboard

The selected background affects only the preview canvas and never modifies the SVG itself.

Users can override the automatic selection manually.

Available preview modes now include:

- Transparent
- Light
- Dark
- Checkerboard

### Sprite Explorer

When the uploaded SVG contains one or more `<symbol>` elements, the Preview tab switches to a read-only Sprite Explorer.

The Sprite Explorer:

- replaces the normal root SVG preview for that document
- shows the total symbol count
- renders symbols in a responsive grid
- supports instant search by symbol ID, title, and description
- supports sorting by original order, alphabetical order, and recent selection
- stores selection in workspace state so it survives tab switches and optimization when the symbol still exists
- shows each symbol ID or `Unnamed symbol`
- shows each symbol `viewBox` when available

Each symbol preview is rendered independently from the root SVG so hidden root markup such as `style="display: none"` does not blank the gallery.

Symbol presence is an objective parser fact and does not depend on optional user-provided `Type` context.

Below the gallery, the Preview tab now extends into a read-only Sprite Workspace:

- `Symbol Details` shows factual parser data for the selected symbol
- `Export` provides original sprite, current sprite, and selected symbol copy/download actions

Standalone symbol export:

- preserves the selected symbol `viewBox` whenever possible
- includes required namespaces
- includes referenced shared root definitions when they can be resolved safely
- includes shared root styles when the selected symbol depends on them

Current standalone export limitations:

- dependency extraction is conservative
- unresolved shared references produce warnings instead of guessed markup
- unrelated symbols are never copied into standalone exports

### Export Studio

The lower workspace now includes `Export Studio`.

Export Studio is the single export destination for the current session, even though existing copy/download entry points remain in Preview and Sprite Workspace.

It resolves export sources from workspace state instead of hardcoding them into individual UI sections.

Current source patterns:

- standalone documents: `Original SVG`, `Current SVG`, `Optimized SVG`
- sprite documents: `Original Sprite`, `Current Sprite`, `Optimized Sprite`, `Selected Symbol`

Unavailable exports stay visible as inactive cards with factual explanations instead of appearing as active controls.

Examples:

- `Optimized SVG` stays unavailable until the user has actually run `Optimize SVG`
- `Selected Symbol` stays unavailable until a sprite symbol is selected

Copy and download continue to use the shared clipboard and Blob implementations.

---

## Optimization Report

The Optimization Report appears only after **Optimize SVG** is executed.

It is intended to answer:

> What changed during this optimization?

The report should remain compact and should not duplicate information that already exists elsewhere in the interface.

### Optimization Timeline

When `Optimize SVG` completes, the Inspector shows a read-only Optimization Timeline.

The timeline:

- follows the real safe-fix execution order
- shows only steps that actually changed the SVG by default
- records UTF-8 byte sizes before and after each reported step
- keeps unchanged and skipped steps available in a compact secondary disclosure
- does not modify the optimizer output or the existing Diff workflow

The timeline is informational only.

It does not allow:

- disabling individual steps
- restoring an intermediate step
- downloading intermediate outputs

## Treatment language

Workspace actions should use this product language:

- `Optimize`: safe automatic improvements that preserve rendering
- `Review`: findings that require user judgment
- `Transform`: intent-dependent actions with more than one valid outcome

Transform actions currently include:

- `Generate ViewBox`
- `Convert to currentColor` for eligible direct hardcoded `fill` or `stroke` attributes

`Convert to currentColor` must remain explicit and never run through `Optimize SVG`.

It is intended for SVGs that should inherit color from UI context, such as icons, and should not be treated as universally appropriate for logos or brand assets.

---

## SVG Health

SVG Health is always visible.

It represents the current quality of the loaded SVG.

SVG Health does not contain optimization report UI.

It should remain focused on:

- grade
- score
- health areas
- issues
- the `Optimize SVG` action

Transform and Review findings should remain visible in the issues list, but they should not be framed as automatic optimizations.

---

## SVG Details

SVG Details is the stable SVG characteristics and applied optimizations area.

SVG Details should describe the SVG itself, not derived overall quality.

The Health score belongs only in `SVG Health`.

SVG Information includes static metadata about the current SVG, including:

- Type
- ViewBox
- Paths
- Colors
- Scalable

Type is optional user-provided context, not detected metadata.

Supported values are:

- `Icon`
- `Logo`
- `Sprite Sheet`

The Type row supports lightweight session-only context.

- `Not specified` is the default
- users can set or change type context at any time
- type resets on upload, paste, example load, and clear

Below SVG Information, the Inspector shows `Insights`.

Insights are:

- informational only
- driven by analysis, metadata, and optional type context
- never findings
- never health-affecting
- never SVG-modifying

Its structure should remain consistent before and after optimization:

- left column: metrics
- right column: applied optimizations

The metrics grid always contains exactly six cards in this order:

1. ViewBox
2. Size
3. Saved
4. Paths
5. Colors
6. Scalable

The `Scalable` card represents the current SVG state only:

- `Yes`
- `Mostly`
- `No`
- `Invalid`

It does not show before → after arrows.

Before optimization, the applied optimizations panel shows a calm empty state.

After optimization, the same layout shows:

- before → after metric changes only where meaningful for size
- saved bytes and percentage
- applied optimization labels

---

## Product principles

Workspace interactions follow these principles:

- Never surprise the user.
- Explain every optimization.
- Preserve rendering whenever possible.
- Never modify an SVG without an explicit action.
- Guide the user naturally through the workflow.
- Reduce unnecessary scrolling and clicks.

---

## Stable layouts

The Workspace layout should remain structurally stable before and after user actions.

Actions such as Optimize SVG should update the content of existing sections rather than introducing new sections or significantly changing the page layout.

Users should build familiarity with the interface over repeated use. Information may change, but the overall structure should remain predictable.

## Icon Workspace

When the current SVG is not a sprite, Workspace shows a dedicated `Icon Workspace` panel.

The Icon Workspace is read-only in the sense that it never exposes freeform drawing or editing tools.

Instead, this first milestone offers deterministic transformation groups:

- `Appearance`
- `Geometry`
- `History`
- `Preview Background`

### Transformation pipeline

Icon actions run through one shared transformation pipeline.

Each transformation declares:

- `id`
- `label`
- `description`
- `category`
- `isApplicable()`
- `apply()`

Buttons stay disabled when a transformation would not change the current SVG.

Current appearance transformations:

- `Convert to currentColor`
- `Remove fill`
- `Remove stroke`
- `Remove inline fill attributes`
- `Remove inline stroke attributes`

`Remove fill` and `Remove stroke` intentionally set eligible explicit paint values to `none` rather than silently removing them. This keeps the result deterministic and easy to verify in Diff.

Current geometry transformations:

- `Square canvas`
- `Add padding`
- `Remove padding`
- `Reset canvas`
- `Custom viewBox`
- `Output size`

Geometry changes:

- operate on `viewBox`, `width`, `height`, and `preserveAspectRatio`
- never rewrite child path coordinates
- reuse derived viewBox information only when numeric width and height make that safe

### ViewBox Inspector

The Geometry section includes a dedicated canvas inspector.

It shows:

- the current effective viewBox
- the current result or pending custom viewBox
- the geometry delta

When the SVG has no valid viewBox but does have numeric width and height, the inspector makes it explicit that the editable canvas is derived rather than guessed.

### Output and Preview size

Geometry distinguishes between:

- `Output size`: exported `width` / `height`
- `Preview size`: UI-only inspection size

Output size never changes the viewBox.

Preview size never changes the exported SVG.

### History

Icon Workspace keeps lightweight local session history:

- `Undo`
- `Redo`
- `Reset to original`

History stores serialized SVG states only.

- maximum 50 entries
- cleared on new upload, paste, example load, or workspace clear
- reset to original clears history

### Synchronization

Every icon transformation updates immediately:

- Preview
- SVG
- Diff
- Inspector metadata
- Findings
- Export output

`Optimize SVG` runs against the current transformed SVG state. Because the workspace already tracks serialized document states, optimization and icon transformations share the same local Undo / Redo history for the current session.

Geometry changes also update:

- Scalable findings when a missing viewBox becomes explicit
- Inspector warnings when output dimensions differ from the canvas
- the read-only Diff tab so canvas changes remain inspectable

### Known limitations

- no artwork-bounds calculations yet
- no centering or fit-to-bounds tools yet
- no per-path geometry editing
- no arbitrary dragging or handle-based editing
