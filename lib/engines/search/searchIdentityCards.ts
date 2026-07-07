import { parseQuery } from "@/lib/engines/query/parseQuery";
import { resolveCanonicalTerms } from "@/lib/engines/canonical/resolveCanonicalTerms";
import { resolveIntent } from "@/lib/engines/intent/resolveIntent";
import { createSearchQuery } from "@/lib/engines/search/searchCards";
import type { Card } from "@/types/card";
import type { CardIdentity } from "@/types/cardIdentity";
import type { CanonicalResolution } from "@/types/canonicalResolution";
import type { IdentityProvider } from "@/types/identityProvider";
import type { ParsedQuery } from "@/types/parsedQuery";
import type { ResolvedIntent } from "@/types/resolvedIntent";
import type { SearchQuery } from "@/types/searchQuery";
import type { SearchResult } from "@/types/searchResult";

export type IdentitySearchDiagnostics = {
  cacheStatus: "HIT" | "MISS";
  canonicalResolution: CanonicalResolution;
  durationMs: number;
  errorMessage?: string;
  identityResolutionTimeMs: number;
  printingResolutionTimeMs: number;
  providerName: string;
  rawResponses: unknown[];
  resolutionTimeMs: number;
};

export type IdentitySearchResponse = {
  intent: ResolvedIntent;
  parsedQuery: ParsedQuery;
  query: SearchQuery;
  results: SearchResult<CardIdentity>[];
  diagnostics: IdentitySearchDiagnostics;
};

type DiagnosticIdentityProvider = IdentityProvider & {
  searchCardsWithDiagnostics?: (
    query: string,
  ) => Promise<{
    cacheStatus: "HIT" | "MISS";
    cards: Card[];
    durationMs: number;
    errorMessage?: string;
    rawResponses: unknown[];
  }>;
};

export async function searchIdentityCards(
  raw: string,
  provider: IdentityProvider,
): Promise<SearchResult<CardIdentity>[]> {
  const response = await searchIdentityCardsWithDiagnostics(raw, provider);

  return response.results;
}

function getProviderQuery(parsedQuery: ParsedQuery, raw: string) {
  return parsedQuery.cardName || raw;
}

function applyCanonicalResolution(
  parsedQuery: ParsedQuery,
  canonicalResolution: CanonicalResolution,
): ParsedQuery {
  if (!canonicalResolution.chosenCandidate) {
    return parsedQuery;
  }

  return {
    ...parsedQuery,
    cardName: canonicalResolution.resolvedQuery,
    game: parsedQuery.game ?? canonicalResolution.chosenCandidate.entry.game,
    remainingTokens: canonicalResolution.resolvedQuery
      .toLowerCase()
      .split(" "),
  };
}

function groupPrintings(cards: Card[]) {
  const groups = new Map<string, Card[]>();

  cards.forEach((card) => {
    const key = card.name.toLowerCase();
    const printings = groups.get(key) ?? [];

    groups.set(key, [...printings, card]);
  });

  return Array.from(groups.entries()).map(([id, printings]) => {
    const firstPrinting = printings[0];

    return {
      id,
      name: firstPrinting.name,
      game: firstPrinting.game,
      printings,
    };
  });
}

export async function searchIdentityCardsWithDiagnostics(
  raw: string,
  provider: DiagnosticIdentityProvider,
): Promise<IdentitySearchResponse> {
  const parsedQuery = parseQuery(raw);
  const canonicalResolution = resolveCanonicalTerms(parsedQuery);
  const resolvedParsedQuery = applyCanonicalResolution(
    parsedQuery,
    canonicalResolution,
  );
  const query = createSearchQuery(raw);
  const startedAt = Date.now();

  if (!query.normalized) {
    const emptyIntent = resolveIntent(resolvedParsedQuery, []);

    return {
      intent: emptyIntent,
      parsedQuery: resolvedParsedQuery,
      query,
      results: [],
      diagnostics: {
        cacheStatus: "MISS",
        canonicalResolution,
        durationMs: 0,
        identityResolutionTimeMs: 0,
        providerName: provider.name,
        printingResolutionTimeMs: 0,
        rawResponses: [],
        resolutionTimeMs: 0,
      },
    };
  }

  const providerQuery = getProviderQuery(resolvedParsedQuery, raw);
  const providerResponse = provider.searchCardsWithDiagnostics
    ? await provider.searchCardsWithDiagnostics(providerQuery)
    : {
        cacheStatus: "MISS" as const,
        cards: await provider.searchCards(providerQuery),
        durationMs: Date.now() - startedAt,
        rawResponses: [],
      };

  const intentStartedAt = Date.now();
  const identities = groupPrintings(providerResponse.cards);
  const intent = resolveIntent(resolvedParsedQuery, identities);
  const resolutionTimeMs = Date.now() - intentStartedAt;

  return {
    intent,
    parsedQuery: resolvedParsedQuery,
    query,
    results: intent.identityCandidates.map((candidate) => ({
      item: candidate.identity,
      matchedTerms: resolvedParsedQuery.remainingTokens,
      score: candidate.confidence,
    })),
    diagnostics: {
      cacheStatus: providerResponse.cacheStatus,
      canonicalResolution,
      durationMs: providerResponse.durationMs,
      errorMessage: providerResponse.errorMessage,
      identityResolutionTimeMs: resolutionTimeMs,
      providerName: provider.name,
      printingResolutionTimeMs: intent.printingCandidates.length
        ? resolutionTimeMs
        : 0,
      rawResponses: providerResponse.rawResponses,
      resolutionTimeMs,
    },
  };
}
