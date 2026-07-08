import type { Card } from "@/types/card";
import { relationshipResolver } from "@/lib/knowledge/RelationshipResolver";

export class KnowledgeGraphRegistry {
  resolve(card: Card) {
    return relationshipResolver.resolve(card);
  }
}

export const knowledgeGraphRegistry = new KnowledgeGraphRegistry();
