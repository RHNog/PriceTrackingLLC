import { notFound } from "next/navigation";
import AppShell from "@/components/ui/AppShell";
import IdentityExplorer from "@/features/developer/identity/components/IdentityExplorer";
import {
  searchIdentityCardsWithDiagnostics,
  type IdentitySearchResponse,
} from "@/lib/engines/search/searchIdentityCards";
import { resolveCanonicalTerms } from "@/lib/engines/canonical/resolveCanonicalTerms";
import { parseQuery } from "@/lib/engines/query/parseQuery";
import { createSearchQuery } from "@/lib/engines/search/searchCards";
import { resolveIntent } from "@/lib/engines/intent/resolveIntent";
import { ScryfallProvider } from "@/lib/providers/identity/ScryfallProvider";

type IdentityDeveloperPageProps = {
  searchParams: Promise<{
    cardId?: string;
    q?: string;
  }>;
};

function createEmptyResponse(raw: string): IdentitySearchResponse {
  const parsedQuery = parseQuery(raw);
  const canonicalResolution = resolveCanonicalTerms(parsedQuery);

  return {
    intent: resolveIntent(parsedQuery, []),
    parsedQuery,
    query: createSearchQuery(raw),
    results: [],
    diagnostics: {
      cacheStatus: "MISS",
      canonicalResolution,
      durationMs: 0,
      identityResolutionTimeMs: 0,
      providerName: "Scryfall",
      printingResolutionTimeMs: 0,
      rawResponses: [],
      resolutionTimeMs: 0,
    },
  };
}

export default async function IdentityDeveloperPage({
  searchParams,
}: IdentityDeveloperPageProps) {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const params = await searchParams;
  const query = params.q ?? "";
  const provider = new ScryfallProvider();
  const response = query
    ? await searchIdentityCardsWithDiagnostics(query, provider)
    : createEmptyResponse(query);

  return (
    <AppShell>
      <IdentityExplorer response={response} selectedCardId={params.cardId} />
    </AppShell>
  );
}
