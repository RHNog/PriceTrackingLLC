import assert from "node:assert/strict";
import test from "node:test";
import { createCardProfile } from "@/lib/engines/cardIntelligence/CardIntelligenceEngine";
import { resolveDecision } from "@/lib/engines/negotiation/DecisionResolver";
import { evaluatePurchase } from "@/lib/engines/evaluation/evaluatePurchase";
import { createConditionMarketSnapshot } from "@/lib/engines/market/createConditionMarketSnapshot";
import { createNegotiationLadder } from "@/lib/engines/negotiation/NegotiationLadderEngine";
import { calculateSignalStrategyScore } from "@/lib/engines/strategy/calculateSignalStrategyScore";
import {
  defaultStrategyId,
  seedStrategies,
  seedStrategyProfiles,
} from "@/data/seedStrategies";
import {
  findConditionProfile,
  type CardConditionCode,
} from "@/types/conditionProfile";
import { defaultMarketContext } from "@/types/MarketContext";
import type { Card } from "@/types/card";
import type { MarketPrice } from "@/types/marketPrice";
import type { PrintingVariant } from "@/types/printingVariant";
import type { StrategyProfile } from "@/types/strategyProfile";

const testCard: Card = {
  id: "test-urza",
  name: "Urza's Saga",
  game: "Magic",
  set: "Store Championships",
  setCode: "SCH",
  number: "29",
  rarity: "Rare",
  finish: "Foil",
  imageUrl: "https://example.com/urza.jpg",
  productFamily: "Store Championships",
  promoTypes: ["storechampionship"],
  treatment: "Textless",
};

const testVariant: PrintingVariant = {
  id: "test-urza:foil",
  printingId: testCard.id,
  finish: "Foil",
  isAvailable: true,
  source: "Test",
};

const testMarketPrice: MarketPrice = {
  id: "test-market-price",
  cardId: testCard.id,
  printingId: testCard.id,
  variantId: testVariant.id,
  providerId: "scryfall-market",
  source: "Test market estimate",
  currency: "USD",
  finish: "Foil",
  price: 302,
  priceType: "market_estimate",
  updatedAt: "2026-07-08T00:00:00.000Z",
  confidence: 80,
};

function getDefaultProfile() {
  const strategy = seedStrategies.find(
    (item) => item.id === defaultStrategyId,
  ) ?? seedStrategies[0];

  return seedStrategyProfiles.find(
    (profile) => profile.id === strategy.profileId,
  ) as StrategyProfile;
}

function evaluate(condition: CardConditionCode, purchasePrice: number) {
  return evaluatePurchase({
    card: testCard,
    condition,
    marketContext: defaultMarketContext,
    marketPrice: testMarketPrice,
    purchasePrice,
    selectedVariant: testVariant,
    strategyProfile: getDefaultProfile(),
  });
}

function getProfileById(id: string) {
  return seedStrategyProfiles.find((profile) => profile.id === id) as
    | StrategyProfile
    | undefined;
}

test("changing condition changes market estimate", () => {
  const nearMint = createConditionMarketSnapshot(testMarketPrice, "NM");
  const lightlyPlayed = createConditionMarketSnapshot(testMarketPrice, "LP");

  assert.equal(nearMint.selectedPrice.price, 302);
  assert.equal(lightlyPlayed.selectedPrice.price, 253.68);
});

test("changing condition changes negotiation ladder", () => {
  const strategyProfile = getDefaultProfile();
  const nearMintMarket = createConditionMarketSnapshot(testMarketPrice, "NM");
  const lightlyPlayedMarket = createConditionMarketSnapshot(testMarketPrice, "LP");
  const nearMintProfile = createCardProfile({
    condition: findConditionProfile("NM"),
    marketContext: defaultMarketContext,
    marketContextSnapshot: nearMintMarket,
    printing: testCard,
    variant: testVariant,
  });
  const lightlyPlayedProfile = createCardProfile({
    condition: findConditionProfile("LP"),
    marketContext: defaultMarketContext,
    marketContextSnapshot: lightlyPlayedMarket,
    printing: testCard,
    variant: testVariant,
  });
  const nearMintLadder = createNegotiationLadder({
    cardProfile: nearMintProfile,
    marketplaceFees: 46,
    minimumProfit: strategyProfile.constraints.minimumProfit,
    shippingCost: 18,
    strategyProfile,
  });
  const lightlyPlayedLadder = createNegotiationLadder({
    cardProfile: lightlyPlayedProfile,
    marketplaceFees: 46,
    minimumProfit: strategyProfile.constraints.minimumProfit,
    shippingCost: 18,
    strategyProfile,
  });

  assert.notEqual(
    nearMintLadder.maximumBuyPrice,
    lightlyPlayedLadder.maximumBuyPrice,
  );
  assert.ok(nearMintLadder.maximumBuyPrice > lightlyPlayedLadder.maximumBuyPrice);
});

test("changing condition changes decision", () => {
  const nearMint = evaluate("NM", 150);
  const lightlyPlayed = evaluate("LP", 150);

  assert.equal(nearMint.decision.action, "BUY");
  assert.equal(lightlyPlayed.decision.action, "NEGOTIATE");
});

test("changing strategy changes negotiation ladder", () => {
  const custom = evaluatePurchase({
    card: testCard,
    condition: "NM",
    marketContext: defaultMarketContext,
    marketPrice: testMarketPrice,
    purchasePrice: 150,
    selectedVariant: testVariant,
    strategyProfile: getProfileById("custom-profile") ?? getDefaultProfile(),
  });
  const highProfit = evaluatePurchase({
    card: testCard,
    condition: "NM",
    marketContext: defaultMarketContext,
    marketPrice: testMarketPrice,
    purchasePrice: 150,
    selectedVariant: testVariant,
    strategyProfile: getProfileById("high-profit-profile") ?? getDefaultProfile(),
  });

  assert.notEqual(
    custom.negotiationLadder.maximumBuyPrice,
    highProfit.negotiationLadder.maximumBuyPrice,
  );
});

test("changing finish changes negotiation ladder", () => {
  const regularCard: Card = {
    id: "collected-company-test",
    name: "Collected Company",
    game: "Magic",
    set: "Tarkir: Dragonstorm",
    setCode: "TDM",
    number: "186",
    rarity: "Rare",
    finish: "Multiple",
    imageUrl: "https://example.com/company.jpg",
  };
  const nonfoilVariant: PrintingVariant = {
    id: `${regularCard.id}:nonfoil`,
    printingId: regularCard.id,
    finish: "Nonfoil",
    isAvailable: true,
    source: "Test",
  };
  const foilVariant: PrintingVariant = {
    id: `${regularCard.id}:foil`,
    printingId: regularCard.id,
    finish: "Foil",
    isAvailable: true,
    source: "Test",
  };

  const nonfoil = evaluatePurchase({
    card: regularCard,
    condition: "NM",
    marketContext: defaultMarketContext,
    marketPrice: testMarketPrice,
    purchasePrice: 150,
    selectedVariant: nonfoilVariant,
    strategyProfile: getDefaultProfile(),
  });
  const foil = evaluatePurchase({
    card: regularCard,
    condition: "NM",
    marketContext: defaultMarketContext,
    marketPrice: testMarketPrice,
    purchasePrice: 150,
    selectedVariant: foilVariant,
    strategyProfile: getDefaultProfile(),
  });

  assert.notEqual(
    nonfoil.negotiationLadder.maximumBuyPrice,
    foil.negotiationLadder.maximumBuyPrice,
  );
});

test("BUY and PASS decisions cannot contradict the negotiation ladder", () => {
  const nearMint = evaluate("NM", 150);
  const damaged = evaluate("DMG", 150);

  assert.ok(nearMint.askingPrice <= nearMint.negotiationLadder.maximumBuyPrice);
  assert.notEqual(nearMint.decision.action, "PASS");
  assert.ok(damaged.askingPrice > damaged.negotiationLadder.maximumBuyPrice);
  assert.notEqual(damaged.decision.action, "BUY");
});

test("decision resolver enforces exact negotiation ladder zones", () => {
  const negotiationLadder = {
    openingOffer: 80,
    targetOffer: 98,
    maximumBuyPrice: 106,
    walkAwayPrice: 106,
    explanation: [],
  };

  assert.equal(
    resolveDecision({ askingPrice: 90, negotiationLadder }),
    "BUY",
  );
  assert.equal(
    resolveDecision({ askingPrice: 100, negotiationLadder }),
    "NEGOTIATE",
  );
  assert.equal(
    resolveDecision({ askingPrice: 108, negotiationLadder }),
    "PASS",
  );
});

test("signals remain independent measurements", () => {
  const profile = evaluate("NM", 150).cardProfile;

  assert.equal(profile.signals.length, 12);
  assert.ok(profile.signals.every((signal) => "score" in signal));
  assert.ok(profile.signals.every((signal) => signal.version === "1.0.0"));
  assert.ok(profile.signals.every((signal) => signal.generatedAt));
  assert.ok(
    profile.signals.every((signal) => signal.contributingFactors.length > 0),
  );
  assert.ok(
    profile.signals.every((signal) => signal.supportingDataSources.length > 0),
  );
  assert.ok(profile.signals.every((signal) => !("action" in signal)));
});

test("strategies consume signal weights", () => {
  const profile = evaluate("NM", 150).cardProfile;
  const collectorStrategy = {
    ...getDefaultProfile(),
    signalWeights: { CollectorAppeal: 1 },
  };
  const riskStrategy = {
    ...getDefaultProfile(),
    signalWeights: { ReprintRisk: 1 },
  };

  assert.notEqual(
    calculateSignalStrategyScore(collectorStrategy, profile.signals),
    calculateSignalStrategyScore(riskStrategy, profile.signals),
  );
});
