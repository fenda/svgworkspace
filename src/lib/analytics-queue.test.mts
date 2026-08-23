import assert from "node:assert/strict";
import test from "node:test";
import { ensureAnalyticsQueue } from "./analytics-queue.ts";

test("ensureAnalyticsQueue uses the gtag-compatible Arguments queue shape", () => {
  const target: { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void } = {};

  ensureAnalyticsQueue(target);
  target.gtag?.("config", "G-XDK5R1FYNK", { send_page_view: true });

  const command = target.dataLayer?.[0];

  assert.equal(Object.prototype.toString.call(command), "[object Arguments]");
  assert.deepEqual(Array.from(command as IArguments), [
    "config",
    "G-XDK5R1FYNK",
    { send_page_view: true },
  ]);
});
