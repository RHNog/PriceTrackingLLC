import type { Card } from "@/types/card";
import type { IdentityRelationship } from "@/types/identityRelationship";

export interface CardEntity {
  card: Card;
  relationship: IdentityRelationship;
}
