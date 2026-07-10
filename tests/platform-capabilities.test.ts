import assert from "node:assert/strict";
import test from "node:test";
import {
  canUseCapability,
  resolveCapability,
  resolveFinishDisplay,
} from "../lib/capabilities/PlatformCapabilityResolver.ts";

test("Magic identity and market are operational", () => {
  assert.equal(resolveCapability("Magic", "identity").status, "Operational");
  assert.equal(resolveCapability("Magic", "marketData").status, "Operational");
  assert.equal(canUseCapability("magic", "marketData"), true);
});

test("Lorcana identity is operational while market is pending", () => {
  assert.equal(resolveCapability("Lorcana", "identity").providerSelected, "Lorcast");
  assert.equal(resolveCapability("Lorcana", "artwork").status, "Operational");
  assert.equal(resolveCapability("Lorcana", "marketData").status, "Pending");
  assert.equal(canUseCapability("lorcana", "marketData"), false);
});

test("unknown finish is explained as provider-unavailable", () => {
  assert.equal(
    resolveFinishDisplay("Lorcana", ["Unknown"]),
    "Provider Does Not Supply Finish",
  );
  assert.equal(resolveFinishDisplay("Magic", ["Foil", "Nonfoil"]), "Foil, Nonfoil");
});
