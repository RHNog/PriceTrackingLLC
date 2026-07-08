import assert from "node:assert/strict";
import test from "node:test";
import type { ReadyPurchaseEvaluation } from "@/lib/engines/evaluation/evaluatePurchase";
import { createCardProfile } from "@/lib/engines/cardIntelligence/CardIntelligenceEngine";
import { createConditionMarketSnapshot } from "@/lib/engines/market/createConditionMarketSnapshot";
import { EvaluationHistoryEngine } from "@/lib/history/EvaluationHistoryEngine";
import { HistoryRepository } from "@/lib/history/HistoryRepository";
import { getDefaultBusinessProfile } from "@/lib/business/BusinessProfileRegistry";
import { createReadinessReport } from "@/lib/validation/ReadinessReport";
import type { AssetContext } from "@/types/AssetContext";
import type { Card } from "@/types/card";
import { findConditionProfile, type CardConditionCode } from "@/types/conditionProfile";
import type { Decision } from "@/types/decision";
import { defaultMarketContext } from "@/types/MarketContext";
import type { MarketPrice } from "@/types/marketPrice";
import type { MarketSnapshot } from "@/types/marketSnapshot";
import type { PrintingVariant } from "@/types/printingVariant";
import type { StrategyProfile } from "@/types/strategyProfile";

function createCard(id: string): Card {
  return {
    id,
    name: "Chrome Mox",
    game: "Magic",
    set: "Double Masters",
    number: "1",
    rarity: "Mythic",
    finish: "Nonfoil",
    imageUrl: "",
  };
}

function createVariant(printingId: string): PrintingVariant {
  return {
    id: `${printingId}:nonfoil`,
    printingId,
    finish: "Nonfoil",
    isAvailable: true,
    source: "test",
  };
}

function createAssetContext(input: {
  condition: CardConditionCode;
  generation: number;
  printingId: string;
  strategyId: string;
  variantId: string;
}): AssetContext {
  return {
    id: `asset:${input.generation}:chrome-mox:${input.printingId}:${input.variantId}`,
    identityId: "chrome-mox",
    printingId: input.printingId,
    variantId: input.variantId,
    condition: input.condition,
    marketContextId: "default",
    strategyId: input.strategyId,
    marketSnapshotId: `market:test:${input.printingId}:${input.variantId}`,
    cardProfileId: `card-profile:${input.generation}`,
    offerLadderId: `offer-ladder:${input.generation}`,
    decisionId: `decision:${input.generation}`,
    generation: input.generation,
    updatedAt: "2026-01-01T00:00:00.000Z",
  };
}

function createStrategy(id: string): StrategyProfile {
  return {
    id,
    constraints: {
      allowedGames: ["Magic"],
      allowedMarketplaces: ["test-market"],
      maximumPurchasePrice: 1000,
      minimumOpportunityScore: 0,
      minimumProfit: 20,
      minimumROI: 10,
    },
    rankingWeights: {
      confidence: 15,
      liquidity: 15,
      profit: 40,
      risk: 5,
      roi: 25,
    },
    signalWeights: {},
  };
}

function createMarketPrice(printingId: string, variantId: string): MarketPrice {
  return {
    id: `price:${printingId}:${variantId}`,
    cardId: "chrome-mox",
    printingId,
    variantId,
    providerId: "test-market",
    source: "Test Market Provider",
    currency: "USD",
    finish: "Nonfoil",
    price: 500,
    priceType: "market_estimate",
    updatedAt: "2026-01-01T00:00:00.000Z",
    confidence: 90,
  };
}

function createMarketSnapshot(
  printingId: string,
  variantId: string,
): MarketSnapshot {
  return {
    printingId,
    variantId,
    prices: [createMarketPrice(printingId, variantId)],
    providerId: "test-market",
    updatedAt: "2026-01-01T00:00:00.000Z",
    sourceLabel: "Test Market Provider",
  };
}

function createEvaluation(input: {
  decision?: Decision;
  printing: Card;
  variant: PrintingVariant;
}): ReadyPurchaseEvaluation {
  const marketEstimate = createMarketPrice(input.printing.id, input.variant.id);
  const businessProfile = getDefaultBusinessProfile();
  const conditionMarketSnapshot = createConditionMarketSnapshot(
    marketEstimate,
    "NM",
  );
  const cardProfile = createCardProfile({
    condition: findConditionProfile("NM"),
    marketContext: defaultMarketContext,
    marketContextSnapshot: conditionMarketSnapshot,
    printing: input.printing,
    variant: input.variant,
  });
  const decision =
    input.decision ??
    {
      action: "BUY",
      confidence: 92,
      estimatedMargin: 100,
      expectedProfit: 60,
      explanation: ["Within target offer."],
      maximumPurchasePrice: 350,
      negotiationMargin: 50,
      recommendedOffer: 300,
      roi: 20,
    };

  return {
    askingPrice: 300,
    businessProfile,
    cardProfile,
    confidence: 92,
    conditionMarketSnapshot,
    decision,
    decisionDrivers: [],
    estimatedMargin: 100,
    estimatedProfit: 60,
    intelligenceScore: 90,
    marketEstimate,
    negotiationLadder: {
      explanation: ["Offer ladder ready."],
      maximumBuyPrice: 350,
      openingOffer: 250,
      targetOffer: 300,
      walkAwayPrice: 351,
    },
    offerLadder: {
      explanation: ["Offer ladder ready."],
      maximumBuyPrice: 350,
      openingOffer: 250,
      targetOffer: 300,
      walkAwayPrice: 351,
    },
    pipelineReport: {
      status: "READY",
      stages: [],
    },
    ranking: {
      explanation: [],
      grade: "A",
      score: 88,
    },
    recommendedOffer: 300,
    readinessReport: createReadinessReport({
      readyComponents: [
        "Business Profile",
        "Market Snapshot",
        "Card Intelligence",
        "Strategy",
        "Offer Ladder",
        "Decision",
      ],
      status: "READY",
    }),
    roi: 20,
    selectedPrinting: input.printing,
    selectedVariant: input.variant,
    status: "READY",
    strategyReason: "Matches strategy.",
    trace: {
      decisionTrace: {
        businessInvariantChecks: [],
        decisionZone: "BUY",
        reason: "Within target.",
        sellerAskingPrice: 300,
      },
      offerLadderTrace: {
        calculatedMaximumBuyPrice: 350,
        calculatedOpeningOffer: 250,
        calculatedTargetOffer: 300,
        cardIntelligenceInputs: [],
        negotiationMargin: 50,
        recommendedOffer: 300,
        strategyWeights: [],
      },
      pipeline: [],
      profitTrace: {
        businessProfileName: businessProfile.name,
        conditionAdjustment: "NM",
        estimatedFees: 46,
        estimatedFixedCosts: 0,
        estimatedShipping: 18,
        finalExpectedProfit: 60,
        profitAfterCosts: 60,
        profitBeforeCosts: 200,
        rawMarketEstimate: 500,
        strategyAdjustments: [],
        variantAdjustment: "Nonfoil",
      },
      strategyTrace: {
        issues: [],
        passedConstraints: true,
        score: 90,
      },
      validation: {
        errors: [],
        status: "READY",
        warnings: [],
      },
    },
    validation: {
      errors: [],
      status: "READY",
      validatedLadder: {
        explanation: ["Offer ladder ready."],
        maximumBuyPrice: 350,
        openingOffer: 250,
        targetOffer: 300,
        validationStatus: "READY",
        walkAwayPrice: 351,
      },
      values: {
        maximumBuyPrice: {
          label: "Maximum Buy Price",
          status: "READY",
          value: 350,
        },
        negotiationMargin: {
          label: "Negotiation Margin",
          status: "READY",
          value: 50,
        },
        openingOffer: {
          label: "Opening Offer",
          status: "READY",
          value: 250,
        },
        recommendedOffer: {
          label: "Recommended Offer",
          status: "READY",
          value: 300,
        },
        targetOffer: {
          label: "Target Offer",
          status: "READY",
          value: 300,
        },
      },
      warnings: [],
    },
  };
}

function recordFixture(input: {
  condition?: CardConditionCode;
  generation: number;
  printingId?: string;
  strategyId?: string;
}) {
  const repository = new HistoryRepository();
  const engine = new EvaluationHistoryEngine(repository);
  const printing = createCard(input.printingId ?? "chrome-mox-2xm");
  const variant = createVariant(printing.id);
  const result = engine.recordCompletedEvaluation({
    assetContext: createAssetContext({
      condition: input.condition ?? "NM",
      generation: input.generation,
      printingId: printing.id,
      strategyId: input.strategyId ?? "default",
      variantId: variant.id,
    }),
    evaluation: createEvaluation({ printing, variant }),
    marketSnapshot: createMarketSnapshot(printing.id, variant.id),
    strategyProfile: createStrategy(input.strategyId ?? "default"),
    timestamp: `2026-01-01T00:00:0${input.generation}.000Z`,
  });

  return { engine, repository, result };
}

test("successful evaluation creates one immutable snapshot", () => {
  const { repository, result } = recordFixture({ generation: 1 });
  const snapshots = repository.all();

  assert.equal(result.recorded, true);
  assert.equal(snapshots.length, 1);
  assert.equal(snapshots[0].eventType, "Evaluation Completed");
  assert.equal(snapshots[0].asset.assetContextGeneration, 1);
  assert.throws(() => {
    Object.assign(snapshots[0], { id: "mutated" });
  });
});

test("changing strategy records a new append-only snapshot after evaluation", () => {
  const repository = new HistoryRepository();
  const engine = new EvaluationHistoryEngine(repository);
  const first = recordFixture({ generation: 1, strategyId: "default" });
  const second = recordFixture({ generation: 2, strategyId: "high-roi" });

  repository.append(first.repository.all()[0]);
  repository.append(second.repository.all()[0]);

  assert.equal(engine instanceof EvaluationHistoryEngine, true);
  assert.equal(repository.all().length, 2);
  assert.equal(repository.all()[0].strategy.id, "default");
  assert.equal(repository.all()[1].strategy.id, "high-roi");
});

test("changing condition records a new append-only snapshot after evaluation", () => {
  const first = recordFixture({ condition: "NM", generation: 1 });
  const second = recordFixture({ condition: "LP", generation: 2 });
  const repository = new HistoryRepository();

  repository.append(first.repository.all()[0]);
  repository.append(second.repository.all()[0]);

  assert.equal(repository.all().length, 2);
  assert.equal(repository.all()[0].asset.condition, "NM");
  assert.equal(repository.all()[1].asset.condition, "LP");
});

test("changing printing records a new append-only snapshot after evaluation", () => {
  const first = recordFixture({
    generation: 1,
    printingId: "chrome-mox-mrd",
  });
  const second = recordFixture({
    generation: 2,
    printingId: "chrome-mox-2xm",
  });
  const repository = new HistoryRepository();

  repository.append(first.repository.all()[0]);
  repository.append(second.repository.all()[0]);

  assert.equal(repository.all().length, 2);
  assert.equal(repository.all()[0].asset.printing.id, "chrome-mox-mrd");
  assert.equal(repository.all()[1].asset.printing.id, "chrome-mox-2xm");
});

test("incomplete snapshots are rejected", () => {
  const repository = new HistoryRepository();
  const engine = new EvaluationHistoryEngine(repository);
  const printing = createCard("chrome-mox-2xm");
  const variant = createVariant(printing.id);
  const result = engine.recordCompletedEvaluation({
    assetContext: {
      ...createAssetContext({
        condition: "NM",
        generation: 1,
        printingId: printing.id,
        strategyId: "default",
        variantId: variant.id,
      }),
      offerLadderId: "",
    },
    evaluation: createEvaluation({ printing, variant }),
    marketSnapshot: createMarketSnapshot(printing.id, variant.id),
    strategyProfile: createStrategy("default"),
  });

  assert.equal(result.recorded, false);
  assert.equal(repository.all().length, 0);
});
