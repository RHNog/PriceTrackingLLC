import type { ValidatedOfferLadder } from "@/lib/engines/negotiation/OfferLadderValidator";
import { resolveNegotiationZone } from "@/lib/engines/negotiation/NegotiationZone";
import type { DecisionAction } from "@/lib/engines/decision/DecisionEngine";

type DecisionResolverInput = {
  askingPrice: number;
  negotiationLadder: ValidatedOfferLadder;
};

export function resolveDecision(input: DecisionResolverInput): DecisionAction {
  const zone = resolveNegotiationZone(
    input.negotiationLadder,
    input.askingPrice,
  );

  if (zone === "buy") {
    return "BUY";
  }

  if (zone === "negotiate") {
    return "NEGOTIATE";
  }

  return "PASS";
}
