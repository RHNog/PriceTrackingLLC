import { classifyRelationship } from "@/lib/engines/entity/classifyRelationship";
import { calculateRelationshipWeight } from "@/lib/engines/entity/calculateRelationshipWeight";
import type { CardIdentity } from "@/types/cardIdentity";
import type { IdentityRelationship } from "@/types/identityRelationship";

const unknownRelationship: IdentityRelationship = {
  source: "derived",
  type: "UNKNOWN",
  weight: calculateRelationshipWeight("UNKNOWN"),
};

export function resolveRelationships(identities: CardIdentity[]) {
  return identities.map((identity) => {
    const bestRelationship = identity.printings
      .map(classifyRelationship)
      .sort((first, second) => second.weight - first.weight)[0] ??
      unknownRelationship;

    return {
      identity,
      relationship: bestRelationship,
    };
  });
}
