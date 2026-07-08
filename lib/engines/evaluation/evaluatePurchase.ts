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

export type PurchaseEvaluation = {
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
  strategyReason: string;
};

const MARKETPLACE_FEES = 46;
const SHIPPING_COST = 18;

function calculateRoi(profit: number, purchasePrice: number) {
  if (purchasePrice <= 0) {
    return 0;
  }

  return Math.round((profit / purchasePrice) * 1000) / 10;
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
    negotiationLadder,
  });
  const negotiationMargin =
    negotiationLadder.maximumBuyPrice - input.purchasePrice;
  const recommendedOffer =
    action === "BUY"
      ? negotiationLadder.targetOffer
      : Math.min(
          negotiationLadder.targetOffer,
          negotiationLadder.maximumBuyPrice,
        );
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
    strategyReason,
  };
}
