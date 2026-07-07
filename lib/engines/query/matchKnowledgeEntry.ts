import { queryConfig } from "@/config/query";
import { calculateKnowledgeMatchScore } from "@/lib/engines/query/calculateKnowledgeMatchScore";
import { normalizeQuery } from "@/lib/engines/query/normalizeQuery";
import type { KnowledgeEntry } from "@/types/knowledgeEntry";
import type { KnowledgeMatch } from "@/types/knowledgeMatch";

function isShortTokenAllowed(sourceToken: string) {
  return queryConfig.shortTokenAllowlist.includes(sourceToken);
}

function getMatchType(
  sourceToken: string,
  alias: string,
  canonical: string,
): KnowledgeMatch["matchType"] {
  const normalizedAlias = normalizeQuery(alias);
  const normalizedCanonical = normalizeQuery(canonical);

  if (sourceToken === normalizedCanonical) {
    return "exact";
  }

  if (sourceToken === normalizedAlias) {
    return "alias";
  }

  if (
    sourceToken.length >= queryConfig.minimumPrefixLength &&
    normalizedAlias.startsWith(sourceToken)
  ) {
    return "prefix";
  }

  if (isShortTokenAllowed(sourceToken) && normalizedAlias.startsWith(sourceToken)) {
    return "prefix";
  }

  if (
    sourceToken.length >= queryConfig.minimumPrefixLength + 2 &&
    normalizedAlias.includes(sourceToken)
  ) {
    return "partial";
  }

  return "unknown";
}

export function matchKnowledgeEntry(
  sourceToken: string,
  entry: KnowledgeEntry,
): KnowledgeMatch | null {
  const normalizedSource = normalizeQuery(sourceToken);
  const aliases = [entry.canonical, ...entry.aliases];

  return aliases
    .map<KnowledgeMatch | null>((alias) => {
      const matchType = getMatchType(normalizedSource, alias, entry.canonical);

      if (matchType === "unknown") {
        return null;
      }

      const confidence = calculateKnowledgeMatchScore(
        normalizedSource,
        alias,
        entry.canonical,
        matchType,
      );

      if (
        (matchType === "prefix" || matchType === "partial") &&
        confidence < queryConfig.prefixMatchThreshold
      ) {
        return null;
      }

      return {
        canonical: entry.canonical,
        category: entry.category,
        confidence,
        matchedAlias: alias,
        matchType,
        sourceToken,
      };
    })
    .filter((match): match is KnowledgeMatch => Boolean(match))
    .sort((first, second) => second.confidence - first.confidence)[0] ?? null;
}
