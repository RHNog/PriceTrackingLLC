import { canonicalConfig } from "@/config/canonical";
import { canonicalDictionary } from "@/knowledge/shared/canonical";
import { calculateCanonicalConfidence } from "@/lib/engines/canonical/calculateCanonicalConfidence";
import { normalizeQuery } from "@/lib/engines/query/normalizeQuery";
import type { CanonicalCandidate } from "@/types/canonicalCandidate";
import type { CanonicalEntry } from "@/types/canonicalEntry";
import type { ParsedQuery } from "@/types/parsedQuery";

function getTerms(entry: CanonicalEntry) {
  return [
    ...entry.aliases.map((term) => ({ matchType: "alias" as const, term })),
    ...entry.nicknames.map((term) => ({ matchType: "nickname" as const, term })),
    ...entry.abbreviations.map((term) => ({
      matchType: "abbreviation" as const,
      term,
    })),
    { matchType: "canonical" as const, term: entry.canonicalIdentity },
  ];
}

function findMatchedTerm(entry: CanonicalEntry, normalizedCardName: string) {
  return getTerms(entry).find(({ term }) => {
    const normalizedTerm = normalizeQuery(term);

    return (
      normalizedCardName === normalizedTerm ||
      normalizedCardName.startsWith(`${normalizedTerm} `)
    );
  });
}

export function rankCanonicalCandidates(parsedQuery: ParsedQuery) {
  const normalizedCardName = normalizeQuery(parsedQuery.cardName);

  if (!normalizedCardName) {
    return [];
  }

  return canonicalDictionary
    .map<CanonicalCandidate | null>((entry) => {
      const matchedTerm = findMatchedTerm(entry, normalizedCardName);

      if (!matchedTerm) {
        return null;
      }

      const confidence = calculateCanonicalConfidence(
        entry,
        matchedTerm.matchType,
        parsedQuery,
      );

      return {
        confidence,
        entry,
        explanation: [
          `Matched ${matchedTerm.matchType} "${matchedTerm.term}".`,
          `Community popularity ${entry.communityPopularity}.`,
          `Professional usage ${entry.professionalUsage}.`,
        ],
        matchedTerm: matchedTerm.term,
        matchType: matchedTerm.matchType,
      };
    })
    .filter((candidate): candidate is CanonicalCandidate => Boolean(candidate))
    .sort((first, second) => {
      if (second.confidence !== first.confidence) {
        return second.confidence - first.confidence;
      }

      return second.entry.priority - first.entry.priority;
    })
    .slice(0, canonicalConfig.maximumCandidates);
}
