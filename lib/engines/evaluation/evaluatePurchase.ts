import { calculateNetProfit } from "@/lib/engines/profit/calculateNetProfit";
import { calculateOpportunityRanking } from "@/lib/engines/ranking/calculateOpportunityRanking";
import { passesStrategyConstraints } from "@/lib/engines/strategy/applyStrategy";
import type { Card } from "@/types/card";
import type { Decision } from "@/types/decision";
import type { MarketPrice } from "@/types/marketPrice";
import type { OpportunityRanking } from "@/types/opportunity";
import type { StrategyProfile } from "@/types/strategyProfile";

type EvaluatePurchaseInput = {
  card: Card;
  marketPrice: MarketPrice;
  purchasePrice: number;
  strategyProfile: StrategyProfile;
};

export type PurchaseEvaluation = {
  decision: Decision;
  ranking: OpportunityRanking;
};

const MARKETPLACE_FEES = 46;
const SHIPPING_COST = 18;
const CONFIDENCE_SIGNAL = 80;
const LIQUIDITY_SIGNAL = 50;
const RISK_SIGNAL = 50;

function calculateRoi(profit: number, purchasePrice: number) {
  if (purchasePrice <= 0) {
    return 0;
  }

  return Math.round((profit / purchasePrice) * 1000) / 10;
}

function calculateMaximumPurchasePrice(
  sellPrice: number,
  marketplaceFees: number,
  shippingCost: number,
  minimumProfit: number,
) {
  const paymentFee = sellPrice * 0.03;
  const maximumPrice =
    sellPrice - marketplaceFees - shippingCost - paymentFee - minimumProfit;

  return Math.max(0, Math.round(maximumPrice));
}

function getDecisionAction(
  passesConstraints: boolean,
  score: number,
  purchasePrice: number,
  maximumPurchasePrice: number,
): Decision["action"] {
  const isSlightlyAboveMaximum =
    purchasePrice > maximumPurchasePrice &&
    purchasePrice <= maximumPurchasePrice * 1.1;

  if (
    passesConstraints &&
    score >= 85 &&
    purchasePrice <= maximumPurchasePrice
  ) {
    return "BUY";
  }

  if (passesConstraints && score >= 65 && score <= 84 && isSlightlyAboveMaximum) {
    return "NEGOTIATE";
  }

  return "PASS";
}

export function evaluatePurchase(
  input: EvaluatePurchaseInput,
): PurchaseEvaluation {
  // TODO: Barcode scanning.
  // TODO: Card image recognition and OCR.
  // TODO: Camera mode and voice mode.
  // TODO: Bulk evaluation.
  // TODO: Offline mode.
  const profit = calculateNetProfit({
    purchasePrice: input.purchasePrice,
    sellPrice: input.marketPrice.price,
    marketplaceFees: MARKETPLACE_FEES,
    shippingCost: SHIPPING_COST,
  });
  const roi = calculateRoi(profit.netProfit, input.purchasePrice);
  const ranking = calculateOpportunityRanking({
    profit: profit.netProfit,
    roi,
    confidence: CONFIDENCE_SIGNAL,
    liquidity: LIQUIDITY_SIGNAL,
    risk: RISK_SIGNAL,
    weights: input.strategyProfile.rankingWeights,
  });
  const maximumPurchasePrice = calculateMaximumPurchasePrice(
    input.marketPrice.price,
    MARKETPLACE_FEES,
    SHIPPING_COST,
    input.strategyProfile.constraints.minimumProfit,
  );
  const passesConstraints = passesStrategyConstraints(input.strategyProfile, {
    game: input.card.game,
    marketplaceId: input.marketPrice.providerId,
    profit: profit.netProfit,
    roi,
    purchasePrice: input.purchasePrice,
    score: ranking.score,
  });
  const action = getDecisionAction(
    passesConstraints,
    ranking.score,
    input.purchasePrice,
    maximumPurchasePrice,
  );
  const negotiationMargin = maximumPurchasePrice - input.purchasePrice;

  return {
    decision: {
      action,
      confidence: ranking.score,
      maximumPurchasePrice,
      negotiationMargin,
      expectedProfit: profit.netProfit,
      roi,
      explanation: [
        passesConstraints
          ? "The offer fits the selected strategy constraints."
          : "The offer does not fit the selected strategy constraints.",
        `The ranking engine scored this offer ${ranking.score}.`,
        `The recommended maximum purchase price is $${maximumPurchasePrice}.`,
        negotiationMargin >= 0
          ? `Negotiation margin is $${negotiationMargin} below the maximum.`
          : `Negotiation margin is $${Math.abs(
              negotiationMargin,
            )} above the maximum.`,
        ...ranking.explanation,
      ],
    },
    ranking,
  };
}
