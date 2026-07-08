import assert from "node:assert/strict";
import test from "node:test";
import { defaultBusinessProfiles } from "@/lib/business/BusinessDefaults";
import type { BusinessProfile } from "@/lib/business/BusinessProfileEngine";
import { createCardProfile } from "@/lib/engines/cardIntelligence/CardIntelligenceEngine";
import { evaluatePurchase } from "@/lib/engines/evaluation/evaluatePurchase";
import { createConditionMarketSnapshot } from "@/lib/engines/market/createConditionMarketSnapshot";
import { inspectEvaluationPipeline } from "@/lib/pipeline/PipelineInspector";
import { seedStrategyProfiles } from "@/data/seedStrategies";
import type { Card } from "@/types/card";
import { findConditionProfile } from "@/types/conditionProfile";
import { defaultMarketContext } from "@/types/MarketContext";
import type { MarketPrice } from "@/types/marketPrice";
import type { PrintingVariant } from "@/types/printingVariant";
import type { StrategyProfile } from "@/types/strategyProfile";

const testCard: Card = {
  id: "pipeline-test-card",
  name: "Counterspell",
  game: "Magic",
  set: "Secret Lair",
  number: "1",
  rarity: "Uncommon",
  finish: "Nonfoil",
  imageUrl: "https://example.com/counterspell.jpg",
};

const testVariant: PrintingVariant = {
  id: "pipeline-test-card:nonfoil",
  printingId: testCard.id,
  finish: "Nonfoil",
  isAvailable: true,
  source: "Test",
};

const marketPrice: MarketPrice = {
  id: "pipeline-market",
  cardId: testCard.id,
  printingId: testCard.id,
  variantId: testVariant.id,
  providerId: "scryfall-market",
  source: "Test market estimate",
  currency: "USD",
  finish: "Nonfoil",
  price: 34.01,
  priceType: "market_estimate",
  updatedAt: "2026-07-08T00:00:00.000Z",
  confidence: 80,
};

const onlineMarketplace = defaultBusinessProfiles.find(
  (profile) => profile.id === "online-marketplace",
) as BusinessProfile;
const strategyProfile = seedStrategyProfiles.find(
  (profile) => profile.id === "custom-profile",
) as StrategyProfile;

function createProfile() {
  return createCardProfile({
    condition: findConditionProfile("NM"),
    marketContext: defaultMarketContext,
    marketContextSnapshot: createConditionMarketSnapshot(marketPrice, "NM"),
    printing: testCard,
    variant: testVariant,
  });
}

test("low-value market estimate does not collapse Offer Ladder to zero", () => {
  const evaluation = evaluatePurchase({
    businessProfile: onlineMarketplace,
    card: testCard,
    condition: "NM",
    marketContext: defaultMarketContext,
    marketPrice,
    purchasePrice: 5,
    selectedVariant: testVariant,
    strategyProfile,
  });

  assert.equal(evaluation.status, "READY");
  assert.ok(evaluation.negotiationLadder.openingOffer > 0);
  assert.ok(evaluation.negotiationLadder.targetOffer > 0);
  assert.ok(evaluation.negotiationLadder.maximumBuyPrice > 0);
  assert.notEqual(evaluation.decision.action, "PASS");
});

test("Pipeline Inspector terminates at first invalid Offer Policy output", () => {
  const impossibleProfile: BusinessProfile = {
    ...onlineMarketplace,
    id: "impossible-online",
    minimumProfit: 80,
    targetMargin: 90,
  };
  const report = inspectEvaluationPipeline({
    askingPrice: 5,
    businessProfile: impossibleProfile,
    cardProfile: createProfile(),
    marketPrice,
    selectedVariant: testVariant,
    strategyProfile,
  });

  assert.equal(report.status, "INVALID");
  assert.equal(report.firstInvalidStage?.name, "Offer Ladder");
  assert.ok(
    report.stages
      .slice(report.stages.findIndex((stage) => stage.name === "Offer Ladder") + 1)
      .every((stage) => stage.name !== "Decision"),
  );
});

