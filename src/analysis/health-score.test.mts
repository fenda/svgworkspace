import assert from "node:assert/strict";
import test from "node:test";
import { calculateScoreFromImpacts, getHealthGrade } from "./health-score.ts";

test("objective structural failures weigh more than cleanup-only findings", () => {
  assert.equal(calculateScoreFromImpacts([6, 0]), 94);
  assert.equal(calculateScoreFromImpacts([0, 0, 0]), 100);
});

test("Health score clamps and uses stable grade bands", () => {
  assert.equal(calculateScoreFromImpacts([150]), 0);
  assert.equal(getHealthGrade(95), "A+");
  assert.equal(getHealthGrade(94), "A");
  assert.equal(getHealthGrade(79), "C");
});
