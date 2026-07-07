import type { CardIdentity } from "@/types/cardIdentity";
import type { IdentityRelationship } from "@/types/identityRelationship";
import type { ParsedQuery } from "@/types/parsedQuery";

function getTokenCoverage(parsedQuery: ParsedQuery, identity: CardIdentity) {
  if (parsedQuery.remainingTokens.length === 0) {
    return 0;
  }

  const identityName = identity.name.toLowerCase();
  const coveredTokens = parsedQuery.remainingTokens.filter((token) =>
    identityName.includes(token.toLowerCase()),
  );

  return coveredTokens.length / parsedQuery.remainingTokens.length;
}

export function calculateIdentityConfidence(
  identity: CardIdentity,
  parsedQuery: ParsedQuery,
  relationship?: IdentityRelationship,
) {
  const queryName = parsedQuery.cardName.toLowerCase();
  const identityName = identity.name.toLowerCase();
  let confidence = 0;

  if (queryName && identityName === queryName) {
    confidence += 55;
  } else if (queryName && identityName.includes(queryName)) {
    confidence += 38;
  }

  confidence += Math.round(getTokenCoverage(parsedQuery, identity) * 30);
  confidence += Math.round(((relationship?.weight ?? 10) / 100) * 15);

  if (parsedQuery.game && identity.game === parsedQuery.game) {
    confidence += 5;
  }

  if (identity.printings.length === 1) {
    confidence += 5;
  }

  if (
    parsedQuery.set ||
    parsedQuery.setCode ||
    parsedQuery.language ||
    parsedQuery.treatment ||
    parsedQuery.promo ||
    parsedQuery.collectorNumber ||
    parsedQuery.condition
  ) {
    confidence += 5;
  }

  return Math.min(100, confidence);
}
