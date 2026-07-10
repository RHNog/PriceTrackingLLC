import type { IdentityRelationship } from "@/types/identityRelationship";
import type { PrintingVariant } from "@/types/printingVariant";

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
  game: "Magic" | "Pokemon" | "One Piece" | "Lorcana" | "Flesh and Blood";
  set: string;
  setCode?: string;
  number: string;
  rarity: string;
  finish: string;
  availableFinishes?: string[];
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
  layout?: string;
  legalities?: Record<string, string>;
  productFamily?: string;
  promoTypes?: string[];
  releaseYear?: string;
  selectedFinish?: string;
  sourceGames?: string[];
  treatment?: string;
  typeLine?: string;
  component?: string;
  finishVariants?: PrintingVariant[];
}
