import {
  calculateBusinessCosts,
  type BusinessProfile,
  type OfferPolicy,
} from "@/lib/business/BusinessProfileEngine";
import { getDefaultBusinessProfile } from "@/lib/business/BusinessProfileRegistry";
import type { CardProfile } from "@/lib/engines/cardIntelligence/models/CardProfile";

type OfferCalculatorInput = {
  businessProfile?: BusinessProfile;
  cardProfile: CardProfile;
  offerPolicy?: OfferPolicy | null;
  minimumProfit: number;
  minimumROI: number;
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
  const businessProfile = input.businessProfile ?? getDefaultBusinessProfile();
  const businessCosts = calculateBusinessCosts(businessProfile, marketPrice);
  const offerPolicy = input.offerPolicy;
  const minimumProfit = Math.max(
    offerPolicy?.minimumProfit ?? 0,
    input.minimumProfit,
  );
  const minimumROI = Math.max(offerPolicy?.minimumROI ?? 0, input.minimumROI);
  const desiredMargin = offerPolicy?.desiredMargin ?? 0;
  const maximumCapitalExposure =
    offerPolicy?.maximumCapitalExposure ?? Number.POSITIVE_INFINITY;
  const availableAfterCosts = marketPrice - businessCosts.totalCosts;
  const rawMaximum =
    availableAfterCosts -
    minimumProfit;
  const roiMaximum = minimumROI > 0
    ? availableAfterCosts / (1 + minimumROI / 100)
    : availableAfterCosts;
  const marginMaximum = desiredMargin > 0
    ? marketPrice * (1 - desiredMargin / 100) - businessCosts.totalCosts
    : availableAfterCosts;
  const conditionAdjustedMaximum =
    Math.min(rawMaximum, roiMaximum, marginMaximum) *
    input.cardProfile.condition.offerMultiplier;
  const signalAdjustedMaximum =
    conditionAdjustedMaximum * getMaximumModifier(input.cardProfile);
  const strategyCeiling =
    input.strategyMaximumPurchasePrice * input.cardProfile.condition.offerMultiplier;

  return roundCurrency(
    Math.min(signalAdjustedMaximum, strategyCeiling, maximumCapitalExposure),
  );
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
