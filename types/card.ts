import type { IdentityRelationship } from "@/types/identityRelationship";

export interface Card {
  id: string;
  name: string;
  game: "Magic" | "Pokemon" | "One Piece" | "Lorcana";
  set: string;
  setCode?: string;
  number: string;
  rarity: string;
  finish: string;
  frame?: string;
  frameEffects?: string[];
  imageUrl: string;
  identityRelationship?: IdentityRelationship;
  language?: string;
  productFamily?: string;
  promoTypes?: string[];
  releaseYear?: string;
  treatment?: string;
}
