import type { IdentityRelationship } from "@/types/identityRelationship";

export interface CardImageUrls {
  artCrop?: string;
  large?: string;
  normal?: string;
  small?: string;
}

export interface CardFaceImage {
  imageUrls: CardImageUrls;
  name?: string;
}

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
  cardFaces?: CardFaceImage[];
  hasCardFaces?: boolean;
  imageFace?: "front" | "single";
  imageSource?: "card" | "card_faces" | "fallback";
  imageUrl: string;
  imageUrls?: CardImageUrls;
  identityRelationship?: IdentityRelationship;
  language?: string;
  productFamily?: string;
  promoTypes?: string[];
  releaseYear?: string;
  treatment?: string;
}
