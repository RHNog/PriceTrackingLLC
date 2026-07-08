import type { KnowledgeEdge, KnowledgeRelationshipType } from "@/lib/knowledge/KnowledgeEdge";
import type { KnowledgeNodeKind } from "@/lib/knowledge/KnowledgeNode";

export interface KnowledgeQuery {
  kinds?: KnowledgeNodeKind[];
  relationships?: KnowledgeRelationshipType[];
}

export interface KnowledgeRelationshipSummary {
  confidence: number;
  evidence: string;
  kind: KnowledgeNodeKind;
  label: string;
  relationship: KnowledgeRelationshipType;
}

export function matchesKnowledgeQuery(edge: KnowledgeEdge, query: KnowledgeQuery) {
  const kindMatches =
    !query.kinds || query.kinds.length === 0 || query.kinds.includes(edge.targetKind);
  const relationshipMatches =
    !query.relationships ||
    query.relationships.length === 0 ||
    query.relationships.includes(edge.relationship);

  return kindMatches && relationshipMatches;
}
