import type { MarketSnapshotRequestContext } from "@/lib/market/MarketIntelligenceRepository";
import type { ProviderConsistencyReport } from "@/lib/market/ProviderConsistencyReport";
import type { MarketSnapshot } from "@/types/marketSnapshot";

function normalize(value: string | undefined | null) {
  const normalized = (value ?? "").toLowerCase().trim();

  if (["nm", "near-mint", "near mint"].includes(normalized)) {
    return "near mint";
  }

  if (["nonfoil", "non-foil", "normal", "regular"].includes(normalized)) {
    return "nonfoil";
  }

  if (["magic", "magic: the gathering", "mtg"].includes(normalized)) {
    return "magic";
  }

  return normalized;
}

function finishMatches(expected: string | undefined, actual: string | undefined) {
  if (!expected || !actual || expected === "Unknown") {
    return true;
  }

  return normalize(expected) === normalize(actual);
}

function optionalMatch(expected: string | undefined, actual: string | null | undefined) {
  if (!expected || !actual) {
    return true;
  }

  return normalize(expected) === normalize(actual);
}

export function validateProviderMatch(input: {
  context: MarketSnapshotRequestContext;
  snapshot: MarketSnapshot;
}): ProviderConsistencyReport {
  const rejectedFields: string[] = [];
  const warnings: string[] = [];
  const firstPrice = input.snapshot.prices[0];
  const identity = input.snapshot.identityEvidence;
  const matchedPrinting =
    input.snapshot.printingId === input.context.printingId &&
    input.snapshot.variantId === input.context.variantId;
  const matchedFinish = finishMatches(
    input.context.finish,
    identity?.finish ?? firstPrice?.finish,
  );
  const matchedCondition = optionalMatch(
    input.context.condition,
    identity?.condition,
  );
  const matchedGame = optionalMatch(input.context.game, identity?.game);
  const matchedLanguage = optionalMatch(
    input.context.language,
    identity?.language,
  );
  const matchedCollectorNumber = optionalMatch(
    input.context.collectorNumber,
    identity?.collectorNumber,
  );
  const matchedCanonicalIdentity = optionalMatch(
    input.context.cardIdentity,
    identity?.canonicalName,
  );
  const providerTimestampValid = Boolean(
    identity?.providerTimestamp ?? input.snapshot.updatedAt,
  );
  const matchedProductIdentifier = Boolean(
    identity?.productIdentifier ?? input.snapshot.providerId,
  );

  if (!input.context.cardIdentity || !matchedCanonicalIdentity) {
    rejectedFields.push("Canonical Card Identity");
  }

  if (!matchedPrinting) {
    rejectedFields.push("Printing");
  }

  if (!matchedCollectorNumber) {
    rejectedFields.push("Collector Number");
  }

  if (!matchedFinish) {
    rejectedFields.push("Finish");
  }

  if (!matchedCondition) {
    rejectedFields.push("Condition");
  }

  if (!matchedGame) {
    rejectedFields.push("Game");
  }

  if (!matchedLanguage) {
    rejectedFields.push("Language");
  }

  if (!input.context.condition) {
    warnings.push("Condition was not supplied by request context.");
  }

  if (!input.context.game) {
    warnings.push("Game was not supplied by request context.");
  }

  if (!input.context.collectorNumber) {
    warnings.push("Collector number was not supplied by request context.");
  }

  if (!input.context.language) {
    warnings.push("Language was not supplied by request context.");
  }

  if (!identity) {
    warnings.push("Provider identity evidence was not supplied.");
  }

  if (!providerTimestampValid) {
    rejectedFields.push("Provider Timestamp");
  }

  if (!matchedProductIdentifier) {
    rejectedFields.push("Product Identifier");
  }

  return {
    matchedAsset: Boolean(input.context.cardIdentity) && matchedCanonicalIdentity,
    matchedCondition,
    matchedFinish,
    matchedGame,
    matchedLanguage,
    matchedPrinting,
    matchedProductIdentifier,
    providerTimestampValid,
    rejectedFields,
    warnings,
  };
}
