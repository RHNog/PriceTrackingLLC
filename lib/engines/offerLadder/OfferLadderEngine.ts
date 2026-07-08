import type { CardProfile } from "@/lib/engines/cardIntelligence/models/CardProfile";
import {
  createNegotiationLadder,
} from "@/lib/engines/negotiation/NegotiationLadderEngine";
import type { NegotiationLadder } from "@/lib/engines/negotiation/NegotiationLadder";
import type { StrategyProfile } from "@/types/strategyProfile";

type OfferLadderInput = {
  cardProfile: CardProfile;
  marketplaceFees: number;
  shippingCost: number;
  minimumProfit: number;
  strategyProfile: StrategyProfile;
};

export function createOfferLadder(input: OfferLadderInput): NegotiationLadder {
  return createNegotiationLadder(input);
}
