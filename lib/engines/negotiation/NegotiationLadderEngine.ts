import {
  calculateBusinessCosts,
  createOfferPolicy,
  explainBusinessProfile,
  type BusinessProfile,
  type OfferPolicy,
} from "@/lib/business/BusinessProfileEngine";
import type { CardProfile } from "@/lib/engines/cardIntelligence/models/CardProfile";
import type { NegotiationLadder } from "@/lib/engines/negotiation/NegotiationLadder";
import {
  calculateMaximumBuyPrice,
  calculateOpeningOffer,
  calculateTargetOffer,
} from "@/lib/engines/negotiation/OfferCalculator";
import type { StrategyProfile } from "@/types/strategyProfile";

type NegotiationLadderInput = {
  businessProfile?: BusinessProfile;
  cardProfile: CardProfile;
  offerPolicy?: OfferPolicy | null;
  minimumProfit: number;
  strategyProfile: StrategyProfile;
};

export function createNegotiationLadder(
  input: NegotiationLadderInput,
): NegotiationLadder {
  const businessProfile = input.businessProfile;
  const offerPolicy =
    input.offerPolicy ??
    (businessProfile ? createOfferPolicy(businessProfile) : null);
  const marketPrice = input.cardProfile.marketContextSnapshot.selectedPrice.price;
  const businessCosts = businessProfile
    ? calculateBusinessCosts(businessProfile, marketPrice)
    : null;
  const maximumBuyPrice = calculateMaximumBuyPrice({
    businessProfile,
    cardProfile: input.cardProfile,
    offerPolicy,
    minimumProfit: input.minimumProfit,
    minimumROI: input.strategyProfile.constraints.minimumROI,
    strategyMaximumPurchasePrice:
      input.strategyProfile.constraints.maximumPurchasePrice,
  });
  const targetOffer = calculateTargetOffer(input.cardProfile, maximumBuyPrice);
  const openingOffer = calculateOpeningOffer(input.cardProfile, targetOffer);

  return {
    openingOffer,
    targetOffer,
    maximumBuyPrice,
    walkAwayPrice: maximumBuyPrice,
    explanation: [
      ...(businessProfile && businessCosts
        ? explainBusinessProfile(businessProfile, businessCosts)
        : []),
      ...(offerPolicy
        ? [
            `Offer Policy minimum profit: ${offerPolicy.minimumProfit}`,
            `Offer Policy minimum ROI: ${offerPolicy.minimumROI}%`,
            `Offer Policy desired margin: ${offerPolicy.desiredMargin}%`,
            `Offer Policy maximum capital exposure: ${offerPolicy.maximumCapitalExposure}`,
          ]
        : []),
      "Liquidity increases the opening offer.",
      "Scarcity increases the target offer.",
      "Collector appeal can raise the maximum buy price.",
      "Reprint risk can lower the maximum buy price.",
    ],
  };
}
