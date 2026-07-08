import assert from "node:assert/strict";
import test from "node:test";
import { seedStrategyProfiles } from "@/data/seedStrategies";
import { createCardProfile } from "@/lib/engines/cardIntelligence/CardIntelligenceEngine";
import { createConditionMarketSnapshot } from "@/lib/engines/market/createConditionMarketSnapshot";
import { calculateSignalStrategyScore } from "@/lib/engines/strategy/calculateSignalStrategyScore";
import { createPlayabilityProfile } from "@/lib/intelligence/playability/PlayabilityEngine";
import { playabilityFormats } from "@/lib/intelligence/playability/PlayabilityRegistry";
import { findConditionProfile } from "@/types/conditionProfile";
import { defaultMarketContext } from "@/types/MarketContext";
import type { Card } from "@/types/card";
import type { MarketPrice } from "@/types/marketPrice";
import type { PrintingVariant } from "@/types/printingVariant";

function createMagicCard(
  name: string,
  legalities: Record<string, string>,
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
    legalities,
  };
}

function createVariant(card: Card): PrintingVariant {
  return {
    id: `${card.id}:nonfoil`,
    printingId: card.id,
    finish: "Nonfoil",
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
    finish: "Nonfoil",
    price: 100,
    priceType: "market_estimate",
    updatedAt: "2026-07-08T00:00:00.000Z",
    confidence: 75,
  };
}

const requestedCards = [
  createMagicCard("Chrome Mox", {
    commander: "legal",
    explorer: "not_legal",
    legacy: "legal",
    modern: "banned",
    pauper: "not_legal",
    pioneer: "not_legal",
    standard: "not_legal",
    vintage: "restricted",
  }),
  createMagicCard("Sol Ring", {
    commander: "legal",
    explorer: "not_legal",
    legacy: "banned",
    modern: "not_legal",
    pauper: "not_legal",
    pioneer: "not_legal",
    standard: "not_legal",
    vintage: "restricted",
  }),
  createMagicCard("Lightning Bolt", {
    commander: "legal",
    explorer: "not_legal",
    legacy: "legal",
    modern: "legal",
    pauper: "legal",
    pioneer: "not_legal",
    standard: "not_legal",
    vintage: "legal",
  }),
  createMagicCard("Black Lotus", {
    commander: "banned",
    explorer: "not_legal",
    legacy: "banned",
    modern: "not_legal",
    pauper: "not_legal",
    pioneer: "not_legal",
    standard: "not_legal",
    vintage: "restricted",
  }),
  createMagicCard("Counterspell", {
    commander: "legal",
    explorer: "not_legal",
    legacy: "legal",
    modern: "legal",
    pauper: "legal",
    pioneer: "not_legal",
    standard: "not_legal",
    vintage: "legal",
  }),
  createMagicCard("Collected Company", {
    commander: "legal",
    explorer: "legal",
    legacy: "legal",
    modern: "legal",
    pauper: "not_legal",
    pioneer: "legal",
    standard: "not_legal",
    vintage: "legal",
  }),
];

test("requested cards generate complete Playability Profiles", () => {
  for (const card of requestedCards) {
    const profile = createPlayabilityProfile(card);

    assert.equal(profile.modelId, "playability-intelligence");
    assert.equal(profile.overall.availability, "LIVE");
    assert.ok(profile.overall.score >= 0);
    assert.ok(playabilityFormats.every((format) => profile.formats[format]));
    assert.equal(profile.formats.Commander.dataSource, "Scryfall");
    assert.equal(profile.formats.Commander.trend, "Unknown");
    assert.equal(profile.formats.Commander.metaStability, "Unknown");
    assert.equal(
      profile.formats.Commander.deckPenetration.status,
      "PLACEHOLDER",
    );
    assert.ok(profile.dependencyGraph.includes("Strategy"));
    assert.ok(profile.providerRoadmap.includes("EDHREC"));
  }
});

test("card profile exposes Playability through framework registration", () => {
  const card = requestedCards[0];
  const variant = createVariant(card);
  const profile = createCardProfile({
    condition: findConditionProfile("NM"),
    marketContext: defaultMarketContext,
    marketContextSnapshot: createConditionMarketSnapshot(
      createMarketPrice(card, variant),
      "NM",
    ),
    printing: card,
    variant,
  });
  const playabilityModel = profile.intelligenceModels.find(
    (model) => model.id === "playability-intelligence",
  );

  assert.ok(playabilityModel);
  assert.equal(profile.playabilityProfile.modelName, "Playability Intelligence");
  assert.ok(
    playabilityModel.indicators.some(
      (indicator) => indicator.id === "commander-strength",
    ),
  );
  assert.ok(
    playabilityModel.indicators.some(
      (indicator) => indicator.id === "playability-trend",
    ),
  );
});

test("strategies consume Playability as a weighted signal", () => {
  const card = requestedCards[2];
  const variant = createVariant(card);
  const profile = createCardProfile({
    condition: findConditionProfile("NM"),
    marketContext: defaultMarketContext,
    marketContextSnapshot: createConditionMarketSnapshot(
      createMarketPrice(card, variant),
      "NM",
    ),
    printing: card,
    variant,
  });
  const playabilityOnly = {
    ...seedStrategyProfiles[0],
    signalWeights: { Playability: 1 },
  };
  const noPlayability = {
    ...seedStrategyProfiles[0],
    signalWeights: { Playability: 0 },
  };

  assert.ok(
    calculateSignalStrategyScore(playabilityOnly, profile.signals) > 0,
  );
  assert.equal(calculateSignalStrategyScore(noPlayability, profile.signals), 0);
});

