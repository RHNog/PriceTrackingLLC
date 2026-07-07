import type { SearchQuery } from "@/types/searchQuery";
import type { SearchResult } from "@/types/searchResult";

type ScoreSearchResultsInput<T> = {
  candidates: T[];
  getSearchText: (candidate: T) => string;
  query: SearchQuery;
};

function getMatchedTerms(tokens: string[], candidateText: string) {
  return tokens.filter((token) =>
    candidateText
      .split(" ")
      .some((candidateToken) => candidateToken.startsWith(token)),
  );
}

function scoreCandidate(query: SearchQuery, candidateText: string) {
  if (!query.normalized) {
    return 1;
  }

  if (candidateText === query.normalized) {
    return 1000;
  }

  const matchedTerms = getMatchedTerms(query.tokens, candidateText);

  if (matchedTerms.length === 0) {
    return 0;
  }

  const prefixScore = query.tokens.reduce((score, token) => {
    if (candidateText.startsWith(token)) {
      return score + 120;
    }

    if (
      candidateText
        .split(" ")
        .some((candidateToken) => candidateToken.startsWith(token))
    ) {
      return score + 80;
    }

    if (candidateText.includes(token)) {
      return score + 40;
    }

    return score;
  }, 0);
  const multiTokenBonus = matchedTerms.length * 25;
  const completeMatchBonus =
    matchedTerms.length === query.tokens.length ? 100 : 0;

  return prefixScore + multiTokenBonus + completeMatchBonus;
}

export function scoreSearchResults<T>({
  candidates,
  getSearchText,
  query,
}: ScoreSearchResultsInput<T>): SearchResult<T>[] {
  return candidates
    .map((candidate) => {
      const candidateText = getSearchText(candidate);
      const matchedTerms = query.normalized
        ? getMatchedTerms(query.tokens, candidateText)
        : [];

      return {
        item: candidate,
        score: scoreCandidate(query, candidateText),
        matchedTerms,
      };
    })
    .filter((result) => result.score > 0)
    .sort((first, second) => second.score - first.score);
}
