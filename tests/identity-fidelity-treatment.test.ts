import assert from "node:assert/strict";
import test from "node:test";
import { calculateIdentityCompleteness } from "../lib/engines/identity/IdentityCompleteness.ts";
import { deriveLorcastTreatment, normalizeLorcastCard } from "../lib/providers/lorcast/LorcastNormalizer.ts";

function lorcastCard(rarity?: string) {
  return normalizeLorcastCard({
    collector_number: "42",
    id: `card-${rarity ?? "missing"}`,
    image_uris: { digital: { normal: "https://cards.lorcast.io/card.avif" } },
    lang: "en",
    name: "Elsa",
    rarity,
    set: { code: "1", id: "set-1", name: "The First Chapter" },
    version: "Spirit of Winter",
  });
}

test("derives only evidence-backed Lorcast treatments", () => {
  assert.equal(deriveLorcastTreatment("enchanted").value, "Enchanted");
  assert.equal(deriveLorcastTreatment("promo").value, "Promo");
  assert.equal(deriveLorcastTreatment("iconic").value, "Iconic");
  assert.equal(deriveLorcastTreatment("legendary").value, "Standard");
  assert.equal(deriveLorcastTreatment("legendary").value === "Cold Foil", false);
  assert.deepEqual(deriveLorcastTreatment(), {
    confidence: 0,
    explanation: "Lorcast did not supply a printing design facet.",
    source: "none",
    state: "Unknown",
    value: "Unknown",
  });
});

test("reports identity completeness independently from market data", () => {
  const complete = lorcastCard("enchanted");
  const incomplete = lorcastCard();
  assert.ok(complete);
  assert.ok(incomplete);

  const completeness = calculateIdentityCompleteness([complete, incomplete]);
  assert.equal(completeness.metrics.find((metric) => metric.field === "Artwork")?.percent, 100);
  assert.equal(completeness.metrics.find((metric) => metric.field === "Treatment")?.percent, 50);
  assert.equal(completeness.metrics.find((metric) => metric.field === "Market")?.status, "Not Applicable");
});
