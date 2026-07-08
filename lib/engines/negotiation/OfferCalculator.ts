import type { CardProfile } from "@/lib/engines/cardIntelligence/models/CardProfile";

type OfferCalculatorInput = {
  cardProfile: CardProfile;
  marketplaceFees: number;
  minimumProfit: number;
  shippingCost: number;
  strategyMaximumPurchasePrice: number;
};

function roundCurrency(value: number) {
  return Math.max(0, Math.round(value));
}

function getSignalScore(cardProfile: CardProfile, name: string, fallback: number) {
  return (
    cardProfile.signals.find((signal) => signal.name === name)?.score ??
    fallback
  );
}

function getMaximumModifier(cardProfile: CardProfile) {
  const collectorAppeal = getSignalScore(cardProfile, "CollectorAppeal", 50);
  const scarcity = getSignalScore(cardProfile, "Scarcity", 50);
  const reprintRisk = getSignalScore(cardProfile, "ReprintRisk", 50);

  const collectorPremium = (collectorAppeal - 50) / 1000;
  const scarcityPremium = (scarcity - 50) / 1200;
  const reprintPenalty = reprintRisk / 1000;

  return Math.max(0.75, 1 + collectorPremium + scarcityPremium - reprintPenalty);
}

export function calculateMaximumBuyPrice(input: OfferCalculatorInput) {
  const marketPrice = input.cardProfile.marketContextSnapshot.selectedPrice.price;
  const paymentFee = marketPrice * 0.03;
  const rawMaximum =
    marketPrice -
    input.marketplaceFees -
    input.shippingCost -
    paymentFee -
    input.minimumProfit;
  const conditionAdjustedMaximum =
    rawMaximum * input.cardProfile.condition.offerMultiplier;
  const signalAdjustedMaximum =
    conditionAdjustedMaximum * getMaximumModifier(input.cardProfile);
  const strategyCeiling =
    input.strategyMaximumPurchasePrice * input.cardProfile.condition.offerMultiplier;

  return roundCurrency(Math.min(signalAdjustedMaximum, strategyCeiling));
}

export function calculateTargetOffer(
  cardProfile: CardProfile,
  maximumBuyPrice: number,
) {
  const scarcity = getSignalScore(cardProfile, "Scarcity", 50);
  const targetRatio = 0.86 + (scarcity / 100) * 0.1;

  return roundCurrency(Math.min(maximumBuyPrice, maximumBuyPrice * targetRatio));
}

export function calculateOpeningOffer(
  cardProfile: CardProfile,
  targetOffer: number,
) {
  const liquidity = getSignalScore(cardProfile, "Liquidity", 50);
  const openingRatio = 0.78 + (liquidity / 100) * 0.12;

  return roundCurrency(Math.min(targetOffer, targetOffer * openingRatio));
}
