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
6. Export the optimized SVG.

---

## Preview

### Automatic background

After an SVG is loaded, the preview canvas automatically selects the most suitable background:

- Dark SVG → Light background
- Light SVG → Dark background
- Mixed or transparent SVG → Checkerboard

The selected background affects only the preview canvas and never modifies the SVG itself.

Users can override the automatic selection manually.

---

## Optimization Report

The Optimization Report appears only after **Optimize SVG** is executed.

It is intended to answer:

> What changed during this optimization?

The report should remain compact and should not duplicate information that already exists elsewhere in the interface.

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

---

## SVG Details

SVG Details is the stable SVG characteristics and applied optimizations area.

SVG Details should describe the SVG itself, not derived overall quality.

The Health score belongs only in `SVG Health`.

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
