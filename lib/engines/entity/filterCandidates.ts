import { resolveRelationships } from "@/lib/engines/entity/resolveRelationships";
import type { CardIdentity } from "@/types/cardIdentity";

export function filterCandidates(identities: CardIdentity[]) {
  const relatedIdentities = resolveRelationships(identities);
  const highestWeight = Math.max(
    ...relatedIdentities.map((candidate) => candidate.relationship.weight),
    0,
  );
  const minimumWeight = highestWeight >= 95 ? 50 : 0;

  return {
    accepted: relatedIdentities.filter(
      (candidate) => candidate.relationship.weight >= minimumWeight,
    ),
    rejected: relatedIdentities
      .filter((candidate) => candidate.relationship.weight < minimumWeight)
      .map((candidate) => ({
        ...candidate,
        rejectedReason: `Rejected ${candidate.relationship.type} relationship before scoring.`,
      })),
  };
}
