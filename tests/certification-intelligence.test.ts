import assert from "node:assert/strict";
import test from "node:test";
import { seedStrategyProfiles } from "@/data/seedStrategies";
import { createCardProfile } from "@/lib/engines/cardIntelligence/CardIntelligenceEngine";
import { createConditionMarketSnapshot } from "@/lib/engines/market/createConditionMarketSnapshot";
import { calculateSignalStrategyScore } from "@/lib/engines/strategy/calculateSignalStrategyScore";
import { createCertificationProfile } from "@/lib/intelligence/certification/CertificationEngine";
import {
  certificationProviderIds,
  currentCertificationProviderIds,
} from "@/lib/intelligence/certification/CertificationRegistry";
import { findConditionProfile } from "@/types/conditionProfile";
import { defaultMarketContext } from "@/types/MarketContext";
import type { Card } from "@/types/card";
import type { MarketPrice } from "@/types/marketPrice";
import type { PrintingVariant } from "@/types/printingVariant";

function createCard(
  name: string,
  metadata: Partial<Card> = {},
): Card {
  return {
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    game: "Magic",
    set: "Test Set",
    number: "1",
    rarity: "Rare",
    finish: "Nonfoil",
    imageUrl: "https://example.com/card.jpg",
    ...metadata,
  };
}

function createVariant(card: Card, finish = card.finish): PrintingVariant {
  return {
    id: `${card.id}:${finish.toLowerCase()}`,
    printingId: card.id,
    finish,
    isAvailable: true,
    source: "Test",
  };
}

function createMarketPrice(card: Card, variant: PrintingVariant): MarketPrice {
  return {
    id: `${card.id}:market`,
    cardId: card.id,
    printingId: card.id,
    variantId: variant.id,
    providerId: "scryfall-market",
    source: "Test market estimate",
    currency: "USD",
    finish: variant.finish,
    price: 100,
    priceType: "market_estimate",
    updatedAt: "2026-07-08T00:00:00.000Z",
    confidence: 75,
  };
}

function createProfile(card: Card, variant = createVariant(card)) {
  return createCardProfile({
    condition: findConditionProfile("NM"),
    marketContext: defaultMarketContext,
    marketContextSnapshot: createConditionMarketSnapshot(
      createMarketPrice(card, variant),
      "NM",
    ),
    printing: card,
    variant,
  });
}

const requestedCards = [
  createCard("Chrome Mox", { rarity: "Mythic" }),
  createCard("Black Lotus", { rarity: "Rare" }),
  createCard("Urza's Saga Textless", {
    productFamily: "Store Championships",
    promoTypes: ["storechampionship"],
    treatment: "Textless",
  }),
  createCard("Serialized Sol Ring", {
    rarity: "Mythic",
    treatment: "Serialized",
  }),
  createCard("Mana Crypt Masterpiece", {
    productFamily: "Kaladesh Inventions",
    treatment: "Masterpiece",
  }),
  createCard("Mox Opal Judge Promo", {
    promoTypes: ["judge"],
    set: "Judge Gift Cards",
  }),
];

test("requested examples generate Certification Profiles", () => {
  for (const card of requestedCards) {
    const variant = createVariant(card, card.finish);
    const profile = createCertificationProfile(card, variant);

    assert.equal(profile.modelId, "certification-intelligence");
    assert.ok(profile.overallGrade >= 0);
    assert.equal(profile.providers.length, currentCertificationProviderIds.length);
    assert.ok(
      currentCertificationProviderIds.every((providerId) =>
        profile.providers.some((provider) => provider.providerId === providerId),
      ),
    );
    assert.ok(
      profile.futureProviders.every((provider) =>
        certificationProviderIds.includes(provider.providerId),
      ),
    );
    assert.equal(profile.providers[0].source, "Placeholder");
    assert.equal(profile.providers[0].population, null);
    assert.equal(profile.indicators.populationTrend.trend, "Unknown");
    assert.ok(profile.dependencyGraph.includes("Collector Intelligence"));
  }
});

test("card profile exposes Certification through framework registration", () => {
  const profile = createProfile(requestedCards[2]);
  const certificationModel = profile.intelligenceModels.find(
    (model) => model.id === "certification-intelligence",
  );

  assert.ok(certificationModel);
  assert.equal(profile.certificationProfile.modelName, "Certification Intelligence");
  assert.ok(
    certificationModel.indicators.some(
      (indicator) => indicator.id === "certification-grade",
    ),
  );
  assert.ok(
    certificationModel.indicators.some(
      (indicator) => indicator.id === "submission-saturation",
    ),
  );
});

test("Collector Intelligence consumes Certification without hardcoding strategy decisions", () => {
  const profile = createProfile(requestedCards[4]);
  const collectorSignal = profile.signals.find(
    (signal) => signal.name === "CollectorAppeal",
  );
  const certificationOnlyStrategy = {
    ...seedStrategyProfiles[0],
    signalWeights: { CollectorAppeal: 1 },
  };

  assert.ok(collectorSignal);
  assert.ok(
    collectorSignal.contributingFactors.includes(
      "Certification Intelligence Excellent",
    ),
  );
  assert.ok(
    calculateSignalStrategyScore(certificationOnlyStrategy, profile.signals) > 0,
  );
  assert.ok(!("action" in profile.certificationProfile));
});
