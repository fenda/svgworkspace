# SVG Workspace

SVG Workspace is a desktop-first browser tool for understanding, optimizing, and exporting SVGs with confidence.

It is designed for developers who want to inspect an SVG before changing it, apply safe optimizations, compare the result, and export the cleaned output without sending files to a server.

Core workflow: Upload -> Analyze -> Optimize -> Compare -> Export.

## Preview Status

SVG Workspace is currently in its first public Preview.

The Preview is intentionally focused on one complete workflow:

1. Upload SVG
2. Analyze SVG Health
3. Optimize SVG
4. Compare output
5. Copy or Download

Future workflows are part of the roadmap, but they are intentionally hidden until implementation begins.

## What Is SVG Workspace?

SVG Workspace is an SVG Health Checker first and an optimizer second.

Instead of treating optimization as a blind file-size pass, SVG Workspace tries to explain:

- what was detected
- why it matters
- what can be safely improved

The goal is to help developers improve SVG quality without surprises.

## Features

### Current Preview

- Upload SVG via file picker, drag and drop, or paste
- Analyze SVG Health across structure, performance, accessibility, colors, and maintainability
- Optimize SVG using the Safe Fix Engine
- Compare original and current SVG output in Preview, SVG, and Diff views
- Inspect metadata before and after optimization in SVG Details
- Copy optimized SVG
- Download optimized SVG

### Optimization Workflow

- Metadata removal
- Comment removal
- Hidden element removal
- Unused definition cleanup
- Fixed dimension removal when a valid `viewBox` already exists
- Simple inline style conversion to presentation attributes when fully safe
- Empty group and empty path cleanup
- Decimal precision rounding

## Product Philosophy

- Explain, don’t surprise.
- Never silently destroy user content.
- Only apply automatic optimizations when rendering is preserved.
- Keep the user’s original SVG as the baseline for comparison.
- Prefer a smaller focused product over exposing unfinished workflows.

## Desktop-First Strategy

SVG Workspace is designed for desktop browsers first.

The optimization workflow depends on side-by-side inspection, metadata review, diffing, and export controls that are best experienced on desktop. Mobile currently uses a lightweight landing experience instead of the full workspace.

## Current Roadmap

SVG Workspace follows this execution order:

1. Preview
2. Optimization Engine
3. Icon Workspace
4. Sprite Builder
5. Continue Working

The current priority is the public Preview and then deeper Optimization Engine improvements.

Destination-specific workflows such as React and Vue remain postponed until the core optimization workflow is fully mature.

## Development

### Requirements

- Node.js
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Validate

```bash
npm run lint
npm run build
```

## Screenshots

Screenshots coming soon.

Recommended future additions:

- Upload state
- SVG Health panel
- Optimize SVG flow
- Preview / SVG / Diff comparison

## Documentation

- [Project State](./docs/project-state.md)
- [Preview Milestone](./docs/milestones/preview.md)
- [Optimization Engine Milestone](./docs/milestones/optimization-engine.md)
- [Milestones Index](./docs/milestones/README.md)
- [Rules Specification](./docs/RULES.md)

## License

MIT
