import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateAssessmentStrategyScore,
  calculateSignalStrategyScore,
} from "@/lib/engines/strategy/calculateSignalStrategyScore";
import { createCardProfile } from "@/lib/engines/cardIntelligence/CardIntelligenceEngine";
import { evaluatePurchase } from "@/lib/engines/evaluation/evaluatePurchase";
import { createConditionMarketSnapshot } from "@/lib/engines/market/createConditionMarketSnapshot";
import { defaultBusinessProfiles } from "@/lib/business/BusinessDefaults";
import { findConditionProfile } from "@/types/conditionProfile";
import { defaultMarketContext } from "@/types/MarketContext";
import type { Card } from "@/types/card";
import type { MarketPrice } from "@/types/marketPrice";
import type { PrintingVariant } from "@/types/printingVariant";
import type { StrategyProfile } from "@/types/strategyProfile";

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

function createProfile(card: Card) {
  const variant = createVariant(card);

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
];

test("requested assets generate complete Asset Assessments", () => {
  for (const card of requestedCards) {
    const profile = createProfile(card);
    const assessment = profile.assetAssessment;

    assert.equal(assessment.modelId, "asset-assessment");
    assert.ok(assessment.overallScore >= 0);
    assert.ok(assessment.confidence.score >= 0);
    assert.ok(assessment.confidence.label);
    assert.ok(assessment.evidenceCoverage > 0);
    assert.ok(assessment.primaryDrivers.length > 0);
    assert.ok(assessment.riskFactors.length > 0);
    assert.ok(assessment.businessSummary.includes(card.name));
    assert.ok(assessment.dependencyGraph.includes("Asset Assessment Engine"));
    assert.ok(
      profile.intelligenceModels.some((model) => model.id === "asset-assessment"),
    );
  }
});

test("Asset Assessment differentiates unknown evidence from weak assets", () => {
  const profile = createProfile(requestedCards[0]);
  const assessment = profile.assetAssessment;

  assert.ok(assessment.overallScore > 0);
  assert.ok(assessment.confidence.reason.includes("Unknown evidence"));
  assert.ok(assessment.riskFactors.includes("Certification Unknown"));
});

test("Asset Assessment primary drivers include graph and intelligence evidence", () => {
  const moxOpal = createProfile(requestedCards[0]).assetAssessment;
  const solRing = createProfile(requestedCards[2]).assetAssessment;
  const blackLotus = createProfile(requestedCards[3]).assetAssessment;

  assert.ok(
    [...moxOpal.primaryDrivers, ...moxOpal.supportingDrivers].some((driver) =>
      driver.includes("Artifact"),
    ),
  );
  assert.ok(
    [...solRing.primaryDrivers, ...solRing.supportingDrivers].some((driver) =>
      driver.includes("Commander"),
    ),
  );
  assert.ok(
    [...blackLotus.primaryDrivers, ...blackLotus.supportingDrivers].some(
      (driver) => driver.includes("Reserved List") || driver.includes("Collector"),
    ),
  );
});

test("Business Profiles and Strategies consume Asset Assessment", () => {
  const card = requestedCards[0];
  const variant = createVariant(card);
  const strategyProfile: StrategyProfile = {
    id: "assessment-strategy",
    constraints: {
      allowedGames: ["Magic"],
      allowedMarketplaces: ["scryfall-market"],
      maximumPurchasePrice: 1000,
      minimumOpportunityScore: 0,
      minimumProfit: 5,
      minimumROI: 5,
    },
    rankingWeights: {
      confidence: 25,
      liquidity: 25,
      profit: 25,
      risk: 0,
      roi: 25,
    },
    signalWeights: { Playability: 1 },
  };
  const evaluation = evaluatePurchase({
    businessProfile: defaultBusinessProfiles[0],
    card,
    marketContext: defaultMarketContext,
    marketPrice: createMarketPrice(card, variant),
    purchasePrice: 40,
    selectedVariant: variant,
    strategyProfile,
  });
  const profile = createProfile(card);

  assert.ok(
    calculateAssessmentStrategyScore(strategyProfile, profile.assetAssessment) > 0,
  );
  assert.equal(
    calculateSignalStrategyScore(
      strategyProfile,
      profile.signals,
      profile.assetAssessment,
    ),
    calculateAssessmentStrategyScore(strategyProfile, profile.assetAssessment),
  );
  assert.equal(evaluation.status, "READY");
  if (evaluation.status === "READY") {
    assert.ok(
      evaluation.negotiationLadder.explanation.some((line) =>
        line.includes("Asset Assessment"),
      ),
    );
    assert.equal(
      evaluation.trace.offerLadderTrace.assetAssessment,
      evaluation.cardProfile.assetAssessment.businessSummary,
    );
  }
});
