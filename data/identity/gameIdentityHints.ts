import type { Card } from "@/types/card";

export const gameIdentityHints: Array<{
  game: Card["game"];
  terms: string[];
}> = [
  { game: "Lorcana", terms: ["mulan", "elsa", "stitch", "maleficent"] },
  { game: "Pokemon", terms: ["charizard", "pikachu", "mewtwo", "eevee"] },
  { game: "One Piece", terms: ["luffy", "zoro", "nami", "one piece"] },
  { game: "Flesh and Blood", terms: ["command and conquer", "fyendal", "flesh and blood"] },
];
