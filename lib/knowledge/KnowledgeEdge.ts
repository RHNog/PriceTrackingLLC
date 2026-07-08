import type { KnowledgeNodeKind } from "@/lib/knowledge/KnowledgeNode";

export type KnowledgeRelationshipType =
  | "belongs_to_family"
  | "has_archetype"
  | "has_color_identity"
  | "has_format_context"
  | "has_keyword"
  | "has_mechanic"
  | "has_premium_printing"
  | "has_reserved_list_status"
  | "has_role"
  | "has_strategy"
  | "has_theme"
  | "has_tribe"
  | "has_universes_beyond_status";

export interface KnowledgeEdge {
  confidence: number;
  evidence: string;
  relationship: KnowledgeRelationshipType;
  sourceId: string;
  sourceKind: KnowledgeNodeKind;
  targetId: string;
  targetKind: KnowledgeNodeKind;
}
