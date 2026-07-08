import { resolveDecision } from "@/lib/engines/negotiation/DecisionResolver";
import type { NegotiationLadder } from "@/lib/engines/negotiation/NegotiationLadder";

export type DecisionAction = "BUY" | "NEGOTIATE" | "PASS";

type DecisionEngineInput = {
  askingPrice: number;
  offerLadder: NegotiationLadder;
  passesStrategyConstraints?: boolean;
  score?: number;
};

export function decidePurchase(input: DecisionEngineInput): DecisionAction {
  return resolveDecision({
    askingPrice: input.askingPrice,
    negotiationLadder: input.offerLadder,
  });
}
