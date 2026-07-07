import { fleshAndBloodKnowledge } from "@/knowledge/fleshandblood";
import { lorcanaKnowledge } from "@/knowledge/lorcana";
import { mtgKnowledge } from "@/knowledge/mtg";
import { onePieceKnowledge } from "@/knowledge/onepiece";
import { pokemonKnowledge } from "@/knowledge/pokemon";

export const universalKnowledgeBase = [
  ...mtgKnowledge,
  ...pokemonKnowledge,
  ...onePieceKnowledge,
  ...lorcanaKnowledge,
  ...fleshAndBloodKnowledge,
];
