import type { CardProfile } from "@/lib/engines/cardIntelligence/models/CardProfile";
import type { NegotiationLadder } from "@/lib/engines/negotiation/NegotiationLadder";
import {
  calculateMaximumBuyPrice,
  calculateOpeningOffer,
  calculateTargetOffer,
} from "@/lib/engines/negotiation/OfferCalculator";
import type { StrategyProfile } from "@/types/strategyProfile";

type NegotiationLadderInput = {
  cardProfile: CardProfile;
  marketplaceFees: number;
  minimumProfit: number;
  shippingCost: number;
  strategyProfile: StrategyProfile;
};

export function createNegotiationLadder(
  input: NegotiationLadderInput,
): NegotiationLadder {
  const maximumBuyPrice = calculateMaximumBuyPrice({
    cardProfile: input.cardProfile,
    marketplaceFees: input.marketplaceFees,
    minimumProfit: input.minimumProfit,
    shippingCost: input.shippingCost,
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
      "Liquidity increases the opening offer.",
      "Scarcity increases the target offer.",
      "Collector appeal can raise the maximum buy price.",
      "Reprint risk can lower the maximum buy price.",
    ],
  };
}
