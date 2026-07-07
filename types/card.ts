export interface Card {
  id: string;
  name: string;
  game: "Magic" | "Pokemon" | "One Piece" | "Lorcana";
  set: string;
  number: string;
  rarity: string;
  finish: string;
  imageUrl: string;
}
