import { createCardProfile } from "@/lib/engines/cardIntelligence/CardIntelligenceEngine";
import type { CardProfile } from "@/lib/engines/cardIntelligence/models/CardProfile";
import {
  createDecisionDrivers,
  type DecisionDriver,
} from "@/lib/engines/decision/DecisionDrivers";
import { createConditionMarketSnapshot } from "@/lib/engines/market/createConditionMarketSnapshot";
import { resolveDecision } from "@/lib/engines/negotiation/DecisionResolver";
import type { NegotiationLadder } from "@/lib/engines/negotiation/NegotiationLadder";
import { createNegotiationLadder } from "@/lib/engines/negotiation/NegotiationLadderEngine";
import {
  validateOfferLadder,
  type OfferLadderValidation,
} from "@/lib/engines/negotiation/OfferLadderValidator";
import { calculateNetProfit } from "@/lib/engines/profit/calculateNetProfit";
import { calculateOpportunityRanking } from "@/lib/engines/ranking/calculateOpportunityRanking";
import { calculateSignalStrategyScore } from "@/lib/engines/strategy/calculateSignalStrategyScore";
import { passesStrategyConstraints } from "@/lib/engines/strategy/applyStrategy";
import type { Card } from "@/types/card";
import {
  findConditionProfile,
  type CardConditionCode,
} from "@/types/conditionProfile";
import type { ConditionMarketSnapshot } from "@/types/conditionMarketSnapshot";
import type { Decision } from "@/types/decision";
import {
  defaultMarketContext,
  type MarketContext,
} from "@/types/MarketContext";
import type { MarketPrice } from "@/types/marketPrice";
import type { OpportunityRanking } from "@/types/opportunity";
import type { PrintingVariant } from "@/types/printingVariant";
import type { StrategyProfile } from "@/types/strategyProfile";

type EvaluatePurchaseInput = {
  card: Card;
  condition?: CardConditionCode;
  marketContext?: MarketContext;
  marketPrice: MarketPrice;
  purchasePrice: number;
  selectedVariant: PrintingVariant;
  strategyProfile: StrategyProfile;
};

export type EvaluationStatus =
  | "READY"
  | "UNAVAILABLE"
  | "INVALID"
  | "WAITING_FOR_DATA";

export type EvaluationTrace = {
  decisionTrace: {
    businessInvariantChecks: string[];
    decisionZone: string;
    reason: string;
    sellerAskingPrice: number;
  };
  offerLadderTrace: {
    calculatedMaximumBuyPrice: number | null;
    calculatedOpeningOffer: number | null;
    calculatedTargetOffer: number | null;
    cardIntelligenceInputs: string[];
    negotiationMargin: number | null;
    recommendedOffer: number | null;
    strategyWeights: string[];
  };
  pipeline: string[];
  profitTrace: {
    conditionAdjustment: string;
    estimatedFees: number | null;
    estimatedShipping: number | null;
    finalExpectedProfit: number | null;
    profitAfterCosts: number | null;
    profitBeforeCosts: number | null;
    rawMarketEstimate: number | null;
    strategyAdjustments: string[];
    variantAdjustment: string;
  };
  strategyTrace: {
    issues: string[];
    passedConstraints: boolean | null;
    score: number | null;
  };
  validation: {
    errors: string[];
    status: EvaluationStatus;
    warnings: string[];
  };
};

export type ReadyPurchaseEvaluation = {
  askingPrice: number;
  cardProfile: CardProfile;
  confidence: number;
  conditionMarketSnapshot: ConditionMarketSnapshot;
  decision: Decision;
  decisionDrivers: DecisionDriver[];
  estimatedMargin: number;
  estimatedProfit: number;
  intelligenceScore: number;
  marketEstimate: MarketPrice;
  negotiationLadder: NegotiationLadder;
  offerLadder: NegotiationLadder;
  ranking: OpportunityRanking;
  recommendedOffer: number;
  roi: number;
  selectedPrinting: Card;
  selectedVariant: PrintingVariant;
  status: "READY";
  strategyReason: string;
  trace: EvaluationTrace;
  validation: OfferLadderValidation;
};

export type UnavailablePurchaseEvaluation = {
  askingPrice: number;
  marketEstimate?: MarketPrice;
  reason: string;
  selectedPrinting: Card;
  selectedVariant: PrintingVariant;
  status: Exclude<EvaluationStatus, "READY">;
  trace: EvaluationTrace;
};

export type PurchaseEvaluation =
  | ReadyPurchaseEvaluation
  | UnavailablePurchaseEvaluation;

const MARKETPLACE_FEES = 46;
const SHIPPING_COST = 18;

function calculateRoi(profit: number, purchasePrice: number) {
  if (purchasePrice <= 0 || !Number.isFinite(purchasePrice)) {
    return 0;
  }

  return Math.round((profit / purchasePrice) * 1000) / 10;
}

const pipeline = [
  "Card",
  "Printing",
  "Variant",
  "Condition",
  "Market Context",
  "Asset Intelligence",
  "Strategy",
  "Offer Ladder",
  "Offer Ladder Validation",
  "Decision Resolver",
  "Vendor Workspace",
];

function isPositiveFinite(value: number) {
  return Number.isFinite(value) && value > 0;
}

function createUnavailableEvaluation(input: {
  askingPrice: number;
  marketEstimate?: MarketPrice;
  reason: string;
  selectedPrinting: Card;
  selectedVariant: PrintingVariant;
  status: Exclude<EvaluationStatus, "READY">;
  trace?: Partial<EvaluationTrace>;
}): UnavailablePurchaseEvaluation {
  return {
    askingPrice: input.askingPrice,
    marketEstimate: input.marketEstimate,
    reason: input.reason,
    selectedPrinting: input.selectedPrinting,
    selectedVariant: input.selectedVariant,
    status: input.status,
    trace: {
      decisionTrace: {
        businessInvariantChecks: [],
        decisionZone: "Unavailable",
        reason: input.reason,
        sellerAskingPrice: input.askingPrice,
        ...input.trace?.decisionTrace,
      },
      offerLadderTrace: {
        calculatedMaximumBuyPrice: null,
        calculatedOpeningOffer: null,
        calculatedTargetOffer: null,
        cardIntelligenceInputs: [],
        negotiationMargin: null,
        recommendedOffer: null,
        strategyWeights: [],
        ...input.trace?.offerLadderTrace,
      },
      pipeline,
      profitTrace: {
        conditionAdjustment: "Unavailable",
        estimatedFees: null,
        estimatedShipping: null,
        finalExpectedProfit: null,
        profitAfterCosts: null,
        profitBeforeCosts: null,
        rawMarketEstimate: input.marketEstimate?.price ?? null,
        strategyAdjustments: [],
        variantAdjustment: "Unavailable",
        ...input.trace?.profitTrace,
      },
      strategyTrace: {
        issues: [input.reason],
        passedConstraints: null,
        score: null,
        ...input.trace?.strategyTrace,
      },
      validation: {
        errors: [input.reason],
        status: input.status,
        warnings: [],
        ...input.trace?.validation,
      },
    },
  };
}

function calculateConfidence(input: {
  intelligenceScore: number;
  marketConfidence: number;
  rankingScore: number;
  strategyConfidence: number;
  variantConfidence: number;
}) {
  return Math.round(
    input.intelligenceScore * 0.25 +
      input.rankingScore * 0.25 +
      input.marketConfidence * 0.25 +
      input.strategyConfidence * 0.15 +
      input.variantConfidence * 0.1,
  );
}

function getSignalScore(
  cardProfile: CardProfile,
  name: string,
  fallback: number,
) {
  return (
    cardProfile.signals.find((signal) => signal.name === name)?.score ??
    fallback
  );
}

export function evaluatePurchase(
  input: EvaluatePurchaseInput,
): PurchaseEvaluation {
  // TODO: Barcode scanning.
  // TODO: Card image recognition and OCR.
  // TODO: Camera mode and voice mode.
  // TODO: Bulk evaluation.
  // TODO: Offline mode.
  if (!isPositiveFinite(input.marketPrice.price)) {
    return createUnavailableEvaluation({
      askingPrice: input.purchasePrice,
      marketEstimate: input.marketPrice,
      reason: "Incomplete market data.",
      selectedPrinting: input.card,
      selectedVariant: input.selectedVariant,
      status: "UNAVAILABLE",
    });
  }

  if (!isPositiveFinite(input.purchasePrice)) {
    return createUnavailableEvaluation({
      askingPrice: input.purchasePrice,
      marketEstimate: input.marketPrice,
      reason: "Current asking price is unavailable.",
      selectedPrinting: input.card,
      selectedVariant: input.selectedVariant,
      status: "WAITING_FOR_DATA",
    });
  }

  const condition = findConditionProfile(input.condition ?? "NM");
  const conditionMarketSnapshot = createConditionMarketSnapshot(
    input.marketPrice,
    condition.code,
  );
  const cardProfile = createCardProfile({
    condition,
    marketContext: input.marketContext ?? defaultMarketContext,
    marketContextSnapshot: conditionMarketSnapshot,
    printing: input.card,
    variant: input.selectedVariant,
  });
  const marketEstimate = conditionMarketSnapshot.selectedPrice;
  const profit = calculateNetProfit({
    purchasePrice: input.purchasePrice,
    sellPrice: marketEstimate.price,
    marketplaceFees: MARKETPLACE_FEES,
    shippingCost: SHIPPING_COST,
  });
  const roi = calculateRoi(profit.netProfit, input.purchasePrice);
  const intelligenceScore = calculateSignalStrategyScore(
    input.strategyProfile,
    cardProfile.signals,
  );
  const ranking = calculateOpportunityRanking({
    profit: profit.netProfit,
    roi,
    confidence: intelligenceScore,
    liquidity: getSignalScore(cardProfile, "Liquidity", 50),
    risk: 100 - getSignalScore(cardProfile, "ReprintRisk", 50),
    weights: input.strategyProfile.rankingWeights,
  });
  const negotiationLadder = createNegotiationLadder({
    cardProfile,
    marketplaceFees: MARKETPLACE_FEES,
    minimumProfit: input.strategyProfile.constraints.minimumProfit,
    shippingCost: SHIPPING_COST,
    strategyProfile: input.strategyProfile,
  });
  const recommendedOffer = Math.min(
    negotiationLadder.targetOffer,
    negotiationLadder.maximumBuyPrice,
  );
  const negotiationMargin =
    negotiationLadder.maximumBuyPrice - input.purchasePrice;
  const ladderValidation = validateOfferLadder({
    ladder: negotiationLadder,
    negotiationMargin,
    recommendedOffer,
  });
  const profitTrace = {
    conditionAdjustment: `${condition.code} multiplier ${condition.marketMultiplier}`,
    estimatedFees: profit.trace.estimatedFees,
    estimatedShipping: profit.trace.estimatedShipping,
    finalExpectedProfit: profit.trace.finalExpectedProfit,
    profitAfterCosts: profit.trace.profitAfterCosts,
    profitBeforeCosts: profit.trace.profitBeforeCosts,
    rawMarketEstimate: input.marketPrice.price,
    strategyAdjustments: [
      `Minimum profit ${input.strategyProfile.constraints.minimumProfit}`,
      `Minimum ROI ${input.strategyProfile.constraints.minimumROI}`,
    ],
    variantAdjustment: `${input.selectedVariant.finish} via ${input.selectedVariant.source}`,
  };
  const offerLadderTrace = {
    calculatedMaximumBuyPrice: negotiationLadder.maximumBuyPrice,
    calculatedOpeningOffer: negotiationLadder.openingOffer,
    calculatedTargetOffer: negotiationLadder.targetOffer,
    cardIntelligenceInputs: cardProfile.signals.map(
      (signal) => `${signal.name}: ${signal.score}`,
    ),
    negotiationMargin,
    recommendedOffer,
    strategyWeights: Object.entries(input.strategyProfile.signalWeights).map(
      ([signal, weight]) => `${signal}: ${weight}`,
    ),
  };

  if (!ladderValidation.validatedLadder) {
    const validationStatus =
      ladderValidation.status === "READY" ? "INVALID" : ladderValidation.status;

    return createUnavailableEvaluation({
      askingPrice: input.purchasePrice,
      marketEstimate,
      reason:
        ladderValidation.errors[0] ??
        "Offer ladder unavailable. Evaluation unavailable.",
      selectedPrinting: input.card,
      selectedVariant: input.selectedVariant,
      status: validationStatus,
      trace: {
        offerLadderTrace,
        profitTrace,
        validation: {
          errors: ladderValidation.errors,
          status: ladderValidation.status,
          warnings: ladderValidation.warnings,
        },
      },
    });
  }

  const passesConstraints = passesStrategyConstraints(input.strategyProfile, {
    game: input.card.game,
    marketplaceId: marketEstimate.providerId,
    profit: profit.netProfit,
    roi,
    purchasePrice: input.purchasePrice,
    score: ranking.score,
  });
  const strategyConfidence = passesConstraints ? 90 : 45;
  const confidence = calculateConfidence({
    intelligenceScore,
    rankingScore: ranking.score,
    marketConfidence: marketEstimate.confidence,
    strategyConfidence,
    variantConfidence: 90,
  });
  const action = resolveDecision({
    askingPrice: input.purchasePrice,
    negotiationLadder: ladderValidation.validatedLadder,
  });
  const estimatedMargin =
    Math.round((marketEstimate.price - input.purchasePrice) * 100) / 100;
  const strategyReason = passesConstraints
    ? "Matches the selected buying strategy."
    : "Does not satisfy the selected buying strategy thresholds.";
  const decisionDrivers = createDecisionDrivers({
    action,
    askingPrice: input.purchasePrice,
    estimatedProfit: profit.netProfit,
    maximumPurchasePrice: negotiationLadder.maximumBuyPrice,
    minimumProfit: input.strategyProfile.constraints.minimumProfit,
    minimumROI: input.strategyProfile.constraints.minimumROI,
    recommendedOffer,
    roi,
  });
  const strategyIssues: string[] = [];

  if (
    profit.netProfit < 0 &&
    marketEstimate.price > input.purchasePrice
  ) {
    strategyIssues.push(
      "Negative expected profit despite market estimate exceeding asking price; costs exceed spread.",
    );
  }

  if (!passesConstraints) {
    strategyIssues.push("Strategy constraints failed.");
  }
  const decisionTrace = {
    businessInvariantChecks: [
      `Opening <= Target: ${negotiationLadder.openingOffer <= negotiationLadder.targetOffer}`,
      `Target <= Maximum: ${negotiationLadder.targetOffer <= negotiationLadder.maximumBuyPrice}`,
      `Recommended <= Maximum: ${recommendedOffer <= negotiationLadder.maximumBuyPrice}`,
      "Decision Resolver executed with validated offer ladder.",
    ],
    decisionZone: action,
    reason: decisionDrivers[0]?.message ?? "Decision resolved from offer ladder.",
    sellerAskingPrice: input.purchasePrice,
  };

  return {
    askingPrice: input.purchasePrice,
    cardProfile,
    confidence,
    conditionMarketSnapshot,
    decision: {
      action,
      confidence,
      maximumPurchasePrice: negotiationLadder.maximumBuyPrice,
      negotiationMargin,
      recommendedOffer,
      expectedProfit: profit.netProfit,
      estimatedMargin,
      roi,
      explanation: decisionDrivers.map((driver) => driver.message),
    },
    decisionDrivers,
    estimatedMargin,
    estimatedProfit: profit.netProfit,
    intelligenceScore,
    marketEstimate,
    negotiationLadder,
    offerLadder: negotiationLadder,
    ranking,
    recommendedOffer,
    roi,
    selectedPrinting: input.card,
    selectedVariant: input.selectedVariant,
    status: "READY",
    strategyReason,
    trace: {
      decisionTrace,
      offerLadderTrace,
      pipeline,
      profitTrace,
      strategyTrace: {
        issues: strategyIssues,
        passedConstraints: passesConstraints,
        score: intelligenceScore,
      },
      validation: {
        errors: ladderValidation.errors,
        status: "READY",
        warnings: ladderValidation.warnings,
      },
    },
    validation: ladderValidation,
  };
}
