import assert from "node:assert/strict";
import test from "node:test";
import { playabilityFormatWeights } from "@/config/playability";
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
  createMagicCard("Mox Opal", {
    commander: "legal",
    explorer: "not_legal",
    legacy: "legal",
    modern: "banned",
    pauper: "not_legal",
    pioneer: "not_legal",
    standard: "not_legal",
    vintage: "legal",
  }),
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
    assert.ok(profile.formats.Commander.importance > 0);
    assert.ok(profile.formats.Commander.demandLevel);
    assert.ok(profile.formats.Commander.competitiveRelevance);
    assert.ok(profile.formats.Commander.casualRelevance);
    assert.equal(profile.formats.Commander.provider, "Scryfall Playability Provider");
    assert.equal(
      profile.formats.Commander.deckPenetration.status,
      "WAITING_FOR_PROVIDER",
    );
    assert.ok(profile.businessConclusion.includes(card.name));
    assert.ok(profile.keySignals.length > 0);
    assert.ok(profile.roleSignals.length > 0);
    assert.ok(profile.providerAdapter.includes("Adapter"));
    assert.ok(profile.demandDimensions.commanderDemand);
    assert.ok(profile.formatAnalysis.Commander);
    assert.ok(profile.knowledgeGraph.edgeCount > 0);
    assert.ok(profile.knowledgeGraph.formats.includes("Commander"));
    assert.ok(profile.confidenceReason.length > 0);
    assert.ok(profile.dependencyGraph.includes("Asset Knowledge Graph"));
    assert.ok(profile.dependencyGraph.includes("Strategy"));
    assert.ok(profile.providerRoadmap.includes("EDHREC"));
  }
});

test("requested cards produce distinct business conclusions", () => {
  const conclusions = requestedCards.map(
    (card) => createPlayabilityProfile(card).businessConclusion,
  );

  assert.equal(new Set(conclusions).size, requestedCards.length);
  assert.match(conclusions[0], /artifact-centric competitive strategies/);
  assert.match(conclusions[2], /Commander demand/);
  assert.match(conclusions[4], /Vintage power/);
  assert.match(conclusions[6], /competitive creature decks/);
});

test("card role model produces explainable role signals", () => {
  const moxOpal = createPlayabilityProfile(requestedCards[0]);
  const solRing = createPlayabilityProfile(requestedCards[2]);
  const collectedCompany = createPlayabilityProfile(requestedCards[6]);

  assert.ok(moxOpal.roleSignals.some((signal) => signal.role === "Fast Mana"));
  assert.ok(moxOpal.roleSignals.some((signal) => signal.role === "Combo Piece"));
  assert.ok(moxOpal.roleSignals.some((signal) => signal.role === "Artifact Synergy"));
  assert.ok(moxOpal.roleSignals.some((signal) => signal.role === "Competitive Staple"));
  assert.ok(solRing.roleSignals.some((signal) => signal.role === "Commander Staple"));
  assert.ok(collectedCompany.roleSignals.some((signal) => signal.role === "Engine"));
  assert.ok(moxOpal.keySignals.includes("Fast Mana"));
});

test("Playability consumes Asset Knowledge Graph relationships", () => {
  const moxOpal = createPlayabilityProfile(requestedCards[0]);
  const counterspell = createPlayabilityProfile(requestedCards[5]);

  assert.ok(moxOpal.knowledgeGraph.archetypes.includes("Artifact Combo"));
  assert.ok(moxOpal.knowledgeGraph.themes.includes("Artifacts"));
  assert.ok(moxOpal.dependencyGraph.includes("Relationship Registry"));
  assert.ok(counterspell.knowledgeGraph.roles.includes("Counterspell"));
});

test("format demand uses configurable weights", () => {
  assert.ok(playabilityFormatWeights.Commander.demandWeight > playabilityFormatWeights.Vintage.demandWeight);
  assert.ok(playabilityFormatWeights.Modern.competitiveWeight > playabilityFormatWeights.Commander.competitiveWeight);
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
      (indicator) => indicator.id === "future-demand-readiness",
    ),
  );
  assert.ok(
    playabilityModel.indicators.some(
      (indicator) => indicator.id === "meta-dependency",
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
