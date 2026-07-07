import { canonicalConfig } from "@/config/canonical";
import type { CanonicalCandidate } from "@/types/canonicalCandidate";
import type { CanonicalEntry } from "@/types/canonicalEntry";
import type { ParsedQuery } from "@/types/parsedQuery";

export function calculateCanonicalConfidence(
  entry: CanonicalEntry,
  matchType: CanonicalCandidate["matchType"],
  parsedQuery: ParsedQuery,
) {
  const matchWeight = {
    abbreviation: canonicalConfig.abbreviationWeight,
    alias: canonicalConfig.exactMatchWeight,
    canonical: canonicalConfig.exactMatchWeight,
    nickname: canonicalConfig.nicknameWeight,
  }[matchType];
  const popularity = Math.round(
    ((entry.communityPopularity + entry.professionalUsage) / 2) *
      canonicalConfig.popularityWeight,
  );
  const gameBonus = parsedQuery.game === entry.game ? 8 : 0;
  const queryContextBonus =
    parsedQuery.finish ||
    parsedQuery.promo ||
    parsedQuery.set ||
    parsedQuery.setCode ||
    parsedQuery.condition
      ? 5
      : 0;

  // TODO: Behavior Engine.
  // TODO: Vendor Intelligence.
  // TODO: Popularity Learning and Automatic Canonical Suggestions.
  // TODO: Regional Nicknames and Marketplace Nicknames.
  // TODO: AI-assisted Canonical Suggestions.
  return Math.min(
    100,
    Math.round(
      entry.confidenceWeight +
        matchWeight +
        popularity +
        gameBonus +
        queryContextBonus +
        entry.priority * 0.05,
    ),
  );
}
