import { relationshipWeights } from "@/config/relationships";
import type { EntityRelationshipType } from "@/types/entityRelationship";

export function calculateRelationshipWeight(type: EntityRelationshipType) {
  return relationshipWeights[type] ?? relationshipWeights.UNKNOWN;
}
