import { parseQuery } from "@/lib/engines/query/parseQuery";
import { printingMatchesParsedQuery } from "@/lib/engines/query/resolveQuery";
import {
  getCardExactText,
  getCardSearchText,
} from "@/lib/engines/search/searchCards";
import { scoreSearchResults } from "@/lib/engines/search/scoreSearchResults";
import type { Card } from "@/types/card";

export function searchPrintings(raw: string, printings: Card[]) {
  const parsedQuery = parseQuery(raw);
  const filteredPrintings = raw.trim()
    ? printings.filter((card) => printingMatchesParsedQuery(card, parsedQuery))
    : printings;

  return scoreSearchResults({
    candidates:
      filteredPrintings.length > 0 || !raw.trim() ? filteredPrintings : printings,
    getExactText: getCardExactText,
    getSearchText: getCardSearchText,
    query: {
      normalized: parsedQuery.remainingTokens.join(" ") || raw.toLowerCase(),
      punctuationStripped:
        parsedQuery.remainingTokens.join(" ") || raw.toLowerCase(),
      raw,
      tokens: parsedQuery.remainingTokens.length
        ? parsedQuery.remainingTokens
        : raw.toLowerCase().split(" ").filter(Boolean),
    },
  });
}
