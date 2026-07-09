import type { MarketIntelligenceRepositorySnapshot } from "@/lib/market/MarketSnapshot";

export function validateMarketSnapshot(
  snapshot: MarketIntelligenceRepositorySnapshot,
) {
  const messages: string[] = [];

  if (!snapshot.identity.cardIdentity) {
    messages.push("Card identity is required.");
  }

  if (!snapshot.identity.printingId) {
    messages.push("Printing is required.");
  }

  if (!snapshot.identity.variantId) {
    messages.push("Variant is required.");
  }

  if (!snapshot.identity.finish) {
    messages.push("Finish is required.");
  }

  if (!snapshot.identity.condition) {
    messages.push("Condition is required.");
  }

  if (!snapshot.providerId) {
    messages.push("Provider is required.");
  }

  if (snapshot.marketPrice !== null && snapshot.marketPrice < 0) {
    messages.push("Current market price cannot be negative.");
  }

  return messages;
}
