import assert from "node:assert/strict";
import test from "node:test";
import { JustTCGAdapter } from "@/lib/providers/justtcg/JustTCGAdapter";
import { JUSTTCG_FIELD_MAPPINGS } from "@/lib/providers/justtcg/JustTCGNormalizer";
import type { JustTCGRawCardResponse } from "@/lib/providers/justtcg/JustTCGNormalizer";

const rawMoxOpalResponse: JustTCGRawCardResponse = {
  data: [
    {
      id: "magic-the-gathering-double-masters-mox-opal-mythic",
      uuid: "card-uuid",
      name: "Mox Opal",
      game: "Magic: The Gathering",
      set: "double-masters-magic-the-gathering",
      set_name: "Double Masters",
      number: "275",
      rarity: "Mythic",
      tcgplayerId: "12345",
      scryfallId: "scryfall-id",
      mtgjsonId: "mtgjson-id",
      variants: [
        {
          id: "mox-opal-near-mint",
          uuid: "variant-uuid",
          condition: "Near Mint",
          printing: "Normal",
          language: "English",
          tcgplayerSkuId: "4505945",
          price: 245.19,
          lastUpdated: 1783548455,
          priceChange24hr: 0,
          priceChange7d: -0.05,
          avgPrice: 246.38,
          priceHistory: [
            {
              p: 238.01,
              t: 1780963200,
            },
          ],
          minPrice7d: 245.19,
          maxPrice7d: 248.05,
          covPrice7d: 0.005,
          priceChange30d: 2.27,
          avgPrice30d: 242.54,
          minPrice30d: 237.21,
          maxPrice30d: 248.05,
          covPrice30d: 0.012,
          priceChange90d: 15.7,
          avgPrice90d: 229.37,
          minPrice90d: 210.96,
          maxPrice90d: 248.05,
          covPrice90d: 0.055,
        },
      ],
    },
  ],
  pagination: {
    total: 25,
    limit: 1,
    offset: 0,
    hasMore: true,
  },
  usage: {
    apiRequestLimit: 1000,
    apiDailyLimit: 100,
    apiRateLimit: 10,
    apiRequestsUsed: 1,
    apiDailyRequestsUsed: 1,
    apiRequestsRemaining: 999,
    apiDailyRequestsRemaining: 99,
    apiPlan: "Free Tier",
  },
};

test("JustTCG adapter normalizes known-card SDK response without exposing raw objects", () => {
  const adapter = new JustTCGAdapter();
  const normalized = adapter.normalize(rawMoxOpalResponse, {
    cardName: "Mox Opal",
    game: "Magic: The Gathering",
  });
  const evidence = adapter.mapEvidence(normalized);

  assert.equal(normalized.providerId, "justtcg");
  assert.equal(normalized.request.cardName, "Mox Opal");
  assert.equal(normalized.cards[0].name, "Mox Opal");
  assert.equal(normalized.cards[0].setName, "Double Masters");
  assert.ok(
    normalized.cards[0].rawObservations.some(
      (observation) => observation.providerField === "card.number",
    ),
  );
  assert.equal(normalized.cards[0].variants[0].currentPriceUsd, 245.19);
  assert.equal(normalized.cards[0].variants[0].lastUpdatedAt, "2026-07-08T22:07:35.000Z");
  assert.equal(normalized.cards[0].variants[0].priceHistory[0].priceUsd, 238.01);
  assert.ok(
    normalized.cards[0].variants[0].rawObservations.some(
      (observation) => observation.providerField === "variant.price",
    ),
  );
  assert.equal(
    normalized.cards[0].variants[0].providerDerivedMetrics.covPrice30d,
    0.012,
  );
  assert.equal(normalized.usage.apiDailyRequestsRemaining, 99);
  assert.ok(normalized.fieldMappings.length >= JUSTTCG_FIELD_MAPPINGS.length);
  assert.ok(evidence.every((item) => item.status === "AVAILABLE"));
  assert.deepEqual(adapter.validate(rawMoxOpalResponse), []);
});

test("JustTCG adapter reports validation gaps for empty provider data", () => {
  const adapter = new JustTCGAdapter();
  const messages = adapter.validate({
    ...rawMoxOpalResponse,
    data: [],
  });

  assert.ok(messages.includes("JustTCG returned no cards for the known-card request."));
  assert.ok(messages.includes("JustTCG returned no variants for the known-card request."));
});
