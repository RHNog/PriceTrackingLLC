export interface KnowledgeEntry {
  canonical: string;
  aliases: string[];
  category:
    | "condition"
    | "finish"
    | "frame"
    | "game"
    | "grading"
    | "language"
    | "product"
    | "promo"
    | "rarity"
    | "set"
    | "setCode"
    | "treatment";
}
