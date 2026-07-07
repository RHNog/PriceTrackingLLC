export type EntityRelationshipType =
  | "ADVENTURE"
  | "BACK_FACE"
  | "EMBLEM"
  | "FRONT_FACE"
  | "MELD"
  | "MODAL_DFC"
  | "PLANE"
  | "PRIMARY_CARD"
  | "REVERSIBLE"
  | "SCHEME"
  | "SERIES_CARD"
  | "SPLIT_CARD"
  | "TOKEN"
  | "TRANSFORM"
  | "UNKNOWN"
  | "VANGUARD";

export interface EntityRelationship {
  source: "provider" | "derived";
  type: EntityRelationshipType;
}
