import assert from "node:assert/strict";
import test from "node:test";
import { getLocalReferenceIdsFromValue } from "./references.ts";

test("getLocalReferenceIdsFromValue finds explicit local paint-server references", () => {
  assert.deepEqual(
    getLocalReferenceIdsFromValue("fill: url(#brand-gradient); filter: url('#soft-shadow')"),
    ["brand-gradient", "soft-shadow"],
  );
});

test("getLocalReferenceIdsFromValue ignores external URLs and non-reference values", () => {
  assert.deepEqual(getLocalReferenceIdsFromValue("url(https://example.com/icon.svg)"), []);
  assert.deepEqual(getLocalReferenceIdsFromValue("currentColor"), []);
  assert.deepEqual(getLocalReferenceIdsFromValue("#not-a-url-reference"), []);
});
