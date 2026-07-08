export type KnowledgeNodeKind =
  | "Archetype"
  | "Asset"
  | "Color Identity"
  | "Family"
  | "Format"
  | "Keyword"
  | "Mechanic"
  | "Premium Printing"
  | "Reserved List"
  | "Role"
  | "Strategy"
  | "Theme"
  | "Tribe"
  | "Universes Beyond";

export interface KnowledgeNode {
  id: string;
  kind: KnowledgeNodeKind;
  label: string;
}
