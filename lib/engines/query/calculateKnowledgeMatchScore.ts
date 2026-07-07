import { queryConfig } from "@/config/query";
import { normalizeQuery } from "@/lib/engines/query/normalizeQuery";
import type { KnowledgeMatch } from "@/types/knowledgeMatch";

function getPrefixConfidence(sourceToken: string, matchedAlias: string) {
  const lengthRatio = sourceToken.length / matchedAlias.length;

  return Math.min(
    95,
    Math.round(queryConfig.prefixMatchWeight + lengthRatio * 10),
  );
}

export function calculateKnowledgeMatchScore(
  sourceToken: string,
  matchedAlias: string,
  canonical: string,
  matchType: KnowledgeMatch["matchType"],
) {
  const normalizedSource = normalizeQuery(sourceToken);
  const normalizedAlias = normalizeQuery(matchedAlias);
  const normalizedCanonical = normalizeQuery(canonical);

  if (matchType === "exact" && normalizedSource === normalizedCanonical) {
    return queryConfig.exactMatchWeight;
  }

  if (matchType === "alias" && normalizedSource === normalizedAlias) {
    return queryConfig.aliasMatchWeight;
  }

  if (matchType === "prefix") {
    return getPrefixConfidence(normalizedSource, normalizedAlias);
  }

  if (matchType === "partial") {
    return queryConfig.partialMatchWeight;
  }

  return 0;
}
