import type { EntityRelationshipType } from "@/types/entityRelationship";

export const relationshipWeights: Record<EntityRelationshipType, number> = {
  ADVENTURE: 75,
  BACK_FACE: 40,
  EMBLEM: 20,
  FRONT_FACE: 95,
  MELD: 80,
  MODAL_DFC: 50,
  PLANE: 20,
  PRIMARY_CARD: 100,
  REVERSIBLE: 50,
  SCHEME: 20,
  SERIES_CARD: 15,
  SPLIT_CARD: 80,
  TOKEN: 25,
  TRANSFORM: 95,
  UNKNOWN: 10,
  VANGUARD: 20,
};
