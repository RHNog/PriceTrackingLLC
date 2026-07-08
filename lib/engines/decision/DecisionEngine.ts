import { resolveDecision } from "@/lib/engines/negotiation/DecisionResolver";
import type { ValidatedOfferLadder } from "@/lib/engines/negotiation/OfferLadderValidator";

export type DecisionAction = "BUY" | "NEGOTIATE" | "PASS";

type DecisionEngineInput = {
  askingPrice: number;
  offerLadder: ValidatedOfferLadder;
  passesStrategyConstraints?: boolean;
  score?: number;
};

export function decidePurchase(input: DecisionEngineInput): DecisionAction {
  return resolveDecision({
    askingPrice: input.askingPrice,
    negotiationLadder: input.offerLadder,
  });
}
