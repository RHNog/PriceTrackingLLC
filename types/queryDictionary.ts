export type QueryTokenType =
  | "collectorNumber"
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
  | "treatment"
  | "unknown"
  | "variant";

export type QueryDictionary = Record<string, string>;
