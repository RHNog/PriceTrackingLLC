import type { NegotiationLadder } from "@/lib/engines/negotiation/NegotiationLadder";

export type NegotiationZone = "buy" | "negotiate" | "pass";

export function resolveNegotiationZone(
  ladder: NegotiationLadder,
  askingPrice: number,
): NegotiationZone {
  if (askingPrice <= ladder.targetOffer) {
    return "buy";
  }

  if (askingPrice <= ladder.maximumBuyPrice) {
    return "negotiate";
  }

  return "pass";
}
