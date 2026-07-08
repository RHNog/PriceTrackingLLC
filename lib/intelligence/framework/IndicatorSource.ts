export interface IndicatorSource {
  id: string;
  name: string;
  dependencyType: "identity" | "market" | "analytics" | "grading" | "future";
}

export const indicatorSources: IndicatorSource[] = [
  { id: "scryfall", name: "Scryfall", dependencyType: "identity" },
  { id: "scryfall-market", name: "Scryfall Market Provider", dependencyType: "market" },
  { id: "tcgplayer", name: "TCGplayer", dependencyType: "future" },
  { id: "ebay", name: "eBay", dependencyType: "future" },
  { id: "cardmarket", name: "Cardmarket", dependencyType: "future" },
  { id: "edhrec", name: "EDHREC", dependencyType: "future" },
  { id: "mtggoldfish", name: "MTGGoldfish", dependencyType: "future" },
  { id: "psa", name: "PSA", dependencyType: "grading" },
  { id: "cgc", name: "CGC", dependencyType: "grading" },
  { id: "bgs", name: "BGS", dependencyType: "grading" },
  { id: "ligamagic", name: "LigaMagic", dependencyType: "future" },
];
