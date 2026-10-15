import assert from "node:assert/strict";
import test from "node:test";

import {
  centerCanvasOnArtwork,
  fitCanvasToArtwork,
} from "./geometry-math.ts";

test("centers artwork by changing only the canvas origin", () => {
  assert.deepEqual(
    centerCanvasOnArtwork(
      { minX: 0, minY: 0, width: 24, height: 24 },
      { minX: 4, minY: 2, width: 8, height: 16 },
    ),
    { minX: -4, minY: -2, width: 24, height: 24 },
  );
});

test("fits the canvas to non-zero artwork bounds", () => {
  assert.deepEqual(
    fitCanvasToArtwork({ minX: 10, minY: -2, width: 16, height: 20 }),
    { minX: 10, minY: -2, width: 16, height: 20 },
  );
});
