import { normalizeQuery } from "@/lib/engines/search/normalizeQuery";
import { scoreSearchResults } from "@/lib/engines/search/scoreSearchResults";
import { tokenizeQuery } from "@/lib/engines/search/tokenizeQuery";
import type { Card } from "@/types/card";
import type { SearchQuery } from "@/types/searchQuery";
import type { SearchResult } from "@/types/searchResult";

function createSearchQuery(raw: string): SearchQuery {
  const normalized = normalizeQuery(raw);

  return {
    raw,
    normalized,
    tokens: tokenizeQuery(normalized),
  };
}

function getCardSearchText(card: Card) {
  return normalizeQuery(
    `${card.name} ${card.game} ${card.set} ${card.number} ${card.rarity} ${card.finish}`,
  );
}

export function searchCards(raw: string, cards: Card[]): SearchResult<Card>[] {
  // TODO: Abbreviation dictionaries.
  // TODO: Set code aliases and collector number matching.
  // TODO: Language aliases and OCR normalization.
  // TODO: Barcode lookup.
  // TODO: Marketplace-backed search.
  // TODO: Inventory search and watchlist search.
  const query = createSearchQuery(raw);

  return scoreSearchResults({
    candidates: cards,
    getSearchText: getCardSearchText,
    query,
  });
}
