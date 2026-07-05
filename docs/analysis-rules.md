# SVG Analysis Rules

## Rule Format

Every rule follows the same structure.

- ID
- Category
- Severity
- Title
- Description
- Why it matters
- Recommendation
- Fix Type
- MVP
- Score Impact

---

# Rule 001

## ID

STRUCTURE_001

## Category

Structure

## Severity

Warning

## Title

Missing viewBox

## Description

The SVG does not contain a `viewBox` attribute.

## Why it matters

Without a viewBox, the SVG cannot scale correctly across different screen sizes and containers.

## Recommendation

Add a viewBox that matches the artwork dimensions.

## Fix Type

Contextual

## MVP

Yes

## Score Impact

+5

---

# Rule 002

## ID

STRUCTURE_002

## Category

Structure

## Severity

Info

## Title

Fixed Width & Height

## Description

The SVG defines explicit width and height attributes.

## Why it matters

Scalable SVGs generally rely on the viewBox and CSS instead of fixed dimensions.

## Recommendation

Remove width and height when appropriate.

## Fix Type

Contextual

## MVP

Yes

## Score Impact

+2

---

# Rule 003

## ID

PERFORMANCE_001

## Category

Performance

## Severity

Info

## Title

Metadata Found

## Description

Metadata elements were detected.

## Why it matters

Metadata increases file size without affecting rendering.

## Recommendation

Remove metadata during optimization.

## Fix Type

Automatic

## MVP

Yes

## Score Impact

+2

---

# Rule 004

## ID

PERFORMANCE_002

## Category

Performance

## Severity

Info

## Title

Comments Found

## Description

The SVG contains XML comments.

## Why it matters

Comments increase file size and are unnecessary in production.

## Recommendation

Remove comments.

## Fix Type

Automatic

## MVP

Yes

## Score Impact

+1

---

# Rule 005

## ID

PERFORMANCE_003

## Category

Performance

## Severity

Info

## Title

High Decimal Precision

## Description

Coordinates contain excessive decimal places.

## Why it matters

Reducing precision can significantly decrease file size with minimal visual impact.

## Recommendation

Round decimal values during optimization.

## Fix Type

Automatic

## MVP

Yes

## Score Impact

+3

---

# Rule 006

## ID

COLORS_001

## Category

Colors

## Severity

Warning

## Title

Hardcoded Fill Colors

## Description

One or more elements use fixed fill colors.

## Why it matters

Hardcoded colors make theming and reuse more difficult.

## Recommendation

Use currentColor or CSS variables when appropriate.

## Fix Type

Manual

## MVP

Yes

## Score Impact

+3

---

# Rule 007

## ID

COLORS_002

## Category

Colors

## Severity

Success

## Title

Uses currentColor

## Description

The SVG already uses currentColor.

## Why it matters

currentColor allows the SVG to inherit text color automatically.

## Recommendation

No action required.

## Fix Type

Not Applicable

## MVP

Yes

## Score Impact

0

---

# Rule 008

## ID

STRUCTURE_003

## Category

Structure

## Severity

Warning

## Title

Duplicate IDs

## Description

Multiple elements share the same ID.

## Why it matters

Duplicate IDs can break references, gradients, masks and clip paths.

## Recommendation

Generate unique IDs.

## Fix Type

Automatic

## MVP

Yes

## Score Impact

+4

---

# Rule 009

## ID

PERFORMANCE_004

## Category

Performance

## Severity

Info

## Title

Unused Definitions

## Description

Unused gradients, clip paths or symbols were found.

## Why it matters

Unused definitions increase SVG complexity and file size.

## Recommendation

Remove unused definitions.

## Fix Type

Automatic

## MVP

Yes

## Score Impact

+2

---

# Rule 010

## ID

ACCESSIBILITY_001

## Category

Accessibility

## Severity

Info

## Title

Missing Title

## Description

The SVG does not contain a title element.

## Why it matters

Meaningful SVGs should provide a title for assistive technologies.

Decorative SVGs may intentionally omit it.

## Recommendation

Add a title when the SVG conveys information.

## Fix Type

Contextual

## MVP

Yes

## Score Impact

Contextual
