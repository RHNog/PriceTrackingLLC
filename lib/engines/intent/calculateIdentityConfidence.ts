import type { CardIdentity } from "@/types/cardIdentity";
import type { IdentityRelationship } from "@/types/identityRelationship";
import type { ParsedQuery } from "@/types/parsedQuery";

const identityStopWords = new Set(["a", "an", "of", "the"]);

function normalizeIdentityText(value: string) {
  return value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function removeStopWords(value: string) {
  return normalizeIdentityText(value)
    .split(" ")
    .filter((token) => !identityStopWords.has(token))
    .join(" ");
}

function removePossessiveS(value: string) {
  return normalizeIdentityText(value)
    .split(" ")
    .map((token) =>
      token.length > 3 && token.endsWith("s") ? token.slice(0, -1) : token,
    )
    .join(" ");
}

function getIdentityVariants(value: string) {
  return Array.from(
    new Set([
      normalizeIdentityText(value),
      removeStopWords(value),
      removePossessiveS(value),
      removeStopWords(removePossessiveS(value)),
    ].filter(Boolean)),
  );
}

function getNameMatchScore(queryName: string, identityName: string) {
  if (!queryName) {
    return 0;
  }

  const queryVariants = getIdentityVariants(queryName);
  const identityVariants = getIdentityVariants(identityName);

  if (
    queryVariants.some((queryVariant) =>
      identityVariants.some((identityVariant) => identityVariant === queryVariant),
    )
  ) {
    return 55;
  }

  if (
    queryVariants.some((queryVariant) =>
      identityVariants.some((identityVariant) =>
        identityVariant.includes(queryVariant),
      ),
    )
  ) {
    return 38;
  }

  return 0;
}

function getLegacyNameMatchScore(queryName: string, identityName: string) {
  if (!queryName) {
    return 0;
  }

  const loweredQueryName = queryName.toLowerCase();
  const loweredIdentityName = identityName.toLowerCase();

  if (loweredIdentityName === loweredQueryName) {
    return 55;
  }

  if (loweredIdentityName.includes(loweredQueryName)) {
    return 38;
  }

  return 0;
}

function tokenMatchesIdentity(token: string, identityName: string) {
  const identityTokens = getIdentityVariants(identityName).flatMap((variant) =>
    variant.split(" "),
  );
  const tokenVariants = getIdentityVariants(token);

  return tokenVariants.some((tokenVariant) =>
    identityTokens.some((identityToken) => identityToken === tokenVariant),
  );
}

function getTokenCoverage(parsedQuery: ParsedQuery, identity: CardIdentity) {
  if (parsedQuery.remainingTokens.length === 0) {
    return 0;
  }

  const coveredTokens = parsedQuery.remainingTokens.filter((token) =>
    tokenMatchesIdentity(token, identity.name),
  );

  return coveredTokens.length / parsedQuery.remainingTokens.length;
}

export function calculateIdentityScoreDetails(
  identity: CardIdentity,
  parsedQuery: ParsedQuery,
  relationship?: IdentityRelationship,
) {
  const legacyNameScore = getLegacyNameMatchScore(
    parsedQuery.cardName,
    identity.name,
  );
  const normalizedNameScore = getNameMatchScore(parsedQuery.cardName, identity.name);
  const nameScore = Math.max(legacyNameScore, normalizedNameScore);
  let confidence = nameScore;

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

  const scoreAfterNormalizationBoost = Math.min(100, confidence);

  return {
    normalizationBoost: Math.max(0, normalizedNameScore - legacyNameScore),
    scoreAfterNormalizationBoost,
    scoreBeforeNormalizationBoost: Math.max(
      0,
      scoreAfterNormalizationBoost - Math.max(0, normalizedNameScore - legacyNameScore),
    ),
  };
}

export function calculateIdentityConfidence(
  identity: CardIdentity,
  parsedQuery: ParsedQuery,
  relationship?: IdentityRelationship,
) {
  return calculateIdentityScoreDetails(
    identity,
    parsedQuery,
    relationship,
  ).scoreAfterNormalizationBoost;
}
