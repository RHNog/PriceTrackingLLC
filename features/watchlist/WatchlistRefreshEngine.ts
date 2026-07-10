import type { MarketSnapshot } from "@/types/marketSnapshot";

export type WatchlistRefreshStatus =
  | "Idle"
  | "Refreshing"
  | "Repository Reused"
  | "Provider Refreshed"
  | "Replay Reused"
  | "Refresh Skipped"
  | "Refresh Failed";

export type WatchlistObservationSource =
  | "Repository"
  | "Provider"
  | "Replay"
  | "Seed"
  | "Unavailable";

export type WatchlistMarketTrend =
  | "Increasing"
  | "Stable"
  | "Declining"
  | "Unknown";

export type WatchlistMarketStatus =
  | "Approaching Target"
  | "Waiting"
  | "Above Target"
  | "Recently Refreshed"
  | "Refresh Recommended"
  | "Stale Observation";

export type WatchlistRefreshPriority =
  | "Highest"
  | "High"
  | "Medium"
  | "Low"
  | "Lowest";

export interface WatchlistAssetIdentity {
  assetId: string;
  collectorNumber?: string;
  game: string;
  name: string;
  printing: string;
  printingId: string;
  providerProductIdentifier?: string;
  providerVariantIdentifier?: string;
  setCode?: string;
  variantId: string;
  image?: {
    source: "Repository" | "Replay" | "Provider";
    urls: {
      small?: string;
      normal?: string;
      large?: string;
    };
  };
}

export interface WatchlistEntry {
  assetIdentity: WatchlistAssetIdentity;
  condition: string;
  currentValuation: number | null;
  developerDiagnostics: WatchlistDeveloperDiagnostics;
  difference: number | null;
  finish: string;
  id: string;
  language: string;
  lastObservation: string | null;
  lastRefresh: string | null;
  marketStatus: WatchlistMarketStatus;
  marketTrend: WatchlistMarketTrend;
  observationSource: WatchlistObservationSource;
  percentDifference: number | null;
  percentToTarget: number | null;
  refreshPriority: WatchlistRefreshPriority;
  refreshStatus: WatchlistRefreshStatus;
  targetPrice: number;
}

export interface WatchlistDeveloperDiagnostics {
  apiSaved: boolean;
  cacheAgeMs: number | null;
  errorMessage?: string;
  observationAgeMs: number | null;
  providerHit: boolean;
  providerRequestJustification?: string;
  replay: boolean;
  repositoryHit: boolean;
  repositorySource?: string;
}

export interface WatchlistRefreshBudget {
  providerRequestsAvailable: number;
  providerRequestsUsed: number;
}

const marketPriceFreshnessMs = 6 * 60 * 60 * 1000;
const recentlyRefreshedMs = 60 * 60 * 1000;

export const defaultWatchlistRefreshBudget: WatchlistRefreshBudget = {
  providerRequestsAvailable: 100,
  providerRequestsUsed: 0,
};

export function calculateWatchlistMetrics(
  entry: Omit<
    WatchlistEntry,
    | "difference"
    | "marketStatus"
    | "percentDifference"
    | "percentToTarget"
    | "refreshPriority"
  >,
): WatchlistEntry {
  const current = entry.currentValuation;
  const difference = current === null ? null : current - entry.targetPrice;
  const percentToTarget =
    current === null || entry.targetPrice === 0
      ? null
      : (current / entry.targetPrice) * 100;
  const percentDifference =
    difference === null || entry.targetPrice === 0
      ? null
      : (difference / entry.targetPrice) * 100;
  const provisional = {
    ...entry,
    difference,
    percentDifference,
    percentToTarget,
  };
  const refreshPriority = getRefreshPriority(provisional);

  return {
    ...provisional,
    marketStatus: getMarketStatus(provisional),
    refreshPriority,
  };
}

export function getObservationAgeMs(entry: Pick<WatchlistEntry, "lastObservation">) {
  if (!entry.lastObservation) {
    return null;
  }

  const observedAt = new Date(entry.lastObservation).getTime();

  if (Number.isNaN(observedAt)) {
    return null;
  }

  return Math.max(0, Date.now() - observedAt);
}

export function isRepositoryFresh(entry: WatchlistEntry) {
  const ageMs = getObservationAgeMs(entry);

  return ageMs !== null && ageMs <= marketPriceFreshnessMs;
}

export function getRefreshPriority(
  entry: Pick<
    WatchlistEntry,
    "lastRefresh" | "percentToTarget" | "refreshStatus"
  >,
  manual = false,
): WatchlistRefreshPriority {
  if (manual) {
    return "Highest";
  }

  const lastRefreshMs = entry.lastRefresh
    ? new Date(entry.lastRefresh).getTime()
    : null;
  const recentlyRefreshed =
    lastRefreshMs !== null &&
    !Number.isNaN(lastRefreshMs) &&
    Date.now() - lastRefreshMs <= recentlyRefreshedMs;

  if (recentlyRefreshed) {
    return "Low";
  }

  if (entry.percentToTarget !== null && entry.percentToTarget >= 90) {
    return "High";
  }

  if (entry.percentToTarget !== null && entry.percentToTarget < 70) {
    return "Lowest";
  }

  return "Medium";
}

export function getMarketStatus(
  entry: Pick<
    WatchlistEntry,
    "lastRefresh" | "observationSource" | "percentToTarget" | "refreshStatus"
  >,
): WatchlistMarketStatus {
  if (entry.percentToTarget !== null && entry.percentToTarget >= 100) {
    return "Above Target";
  }

  if (entry.percentToTarget !== null && entry.percentToTarget >= 90) {
    return "Approaching Target";
  }

  const lastRefreshMs = entry.lastRefresh
    ? new Date(entry.lastRefresh).getTime()
    : null;
  const recentlyRefreshed =
    lastRefreshMs !== null &&
    !Number.isNaN(lastRefreshMs) &&
    Date.now() - lastRefreshMs <= recentlyRefreshedMs;

  if (recentlyRefreshed) {
    return "Recently Refreshed";
  }

  if (entry.refreshStatus === "Refresh Failed") {
    return "Refresh Recommended";
  }

  if (entry.observationSource === "Unavailable") {
    return "Stale Observation";
  }

  return "Waiting";
}

export function justifyProviderRequest(entry: WatchlistEntry, manual = false) {
  const priority = getRefreshPriority(entry, manual);

  if (isRepositoryFresh(entry)) {
    return "Repository evidence is fresh; provider request is not justified.";
  }

  if (manual) {
    return "Manual refresh requested for a single watchlist entry.";
  }

  if (priority === "High") {
    return "Asset is approaching the target price and stale evidence may change the decision.";
  }

  if (!isRepositoryFresh(entry)) {
    return "Repository valuation is outside the market price freshness policy.";
  }

  return "Repository evidence is stale or missing.";
}

function selectValuation(snapshot: MarketSnapshot) {
  return (
    snapshot.marketIntelligence?.marketPrice ??
    snapshot.prices.find((price) => price.priceType === "market_estimate")?.price ??
    snapshot.prices.find((price) => price.priceType === "variant_valuation")
      ?.price ??
    snapshot.prices[0]?.price ??
    null
  );
}

function detectReplay(snapshot: MarketSnapshot) {
  const haystack = [
    snapshot.sourceLabel,
    snapshot.providerId,
    snapshot.marketEvidenceDiagnostics?.evidenceSource,
    snapshot.marketEvidenceDiagnostics?.selectedProvider,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes("replay");
}

export async function refreshWatchlistEntry(input: {
  budget?: WatchlistRefreshBudget;
  entry: WatchlistEntry;
  manual?: boolean;
}): Promise<WatchlistEntry> {
  const { entry, manual = false } = input;
  const providerRequestJustification = justifyProviderRequest(entry, manual);

  if (isRepositoryFresh(entry)) {
    return calculateWatchlistMetrics({
      ...entry,
      developerDiagnostics: {
        ...entry.developerDiagnostics,
        apiSaved: true,
        cacheAgeMs: getObservationAgeMs(entry),
        observationAgeMs: getObservationAgeMs(entry),
        providerHit: false,
        providerRequestJustification,
        repositoryHit: true,
      },
      refreshStatus: "Repository Reused",
    });
  }

  const params = new URLSearchParams({
    cardName: entry.assetIdentity.name,
    condition: entry.condition,
    finish: entry.finish,
    game: entry.assetIdentity.game,
    printingId: entry.assetIdentity.printingId,
    variantId: entry.assetIdentity.variantId,
  });
  const startedAt = Date.now();

  try {
    const response = await fetch(`/api/market/snapshot?${params.toString()}`, {
      method: "GET",
    });
    const snapshot = (await response.json()) as MarketSnapshot;

    if (!response.ok) {
      throw new Error(snapshot.errorMessage ?? `Refresh failed with ${response.status}.`);
    }

    const providersQueried =
      snapshot.marketEvidenceDiagnostics?.providersQueried ?? [];
    const replay = detectReplay(snapshot);
    const providerHit = providersQueried.length > 0 && !replay;
    const valuation = selectValuation(snapshot);
    const observedAt =
      snapshot.marketIntelligence?.lastSynchronizedAt ?? snapshot.updatedAt;
    const repositorySource =
      snapshot.marketEvidenceDiagnostics?.repositorySource ?? null;
    const observationSource: WatchlistObservationSource = replay
      ? "Replay"
      : providerHit
        ? "Provider"
        : "Repository";

    return calculateWatchlistMetrics({
      ...entry,
      currentValuation: valuation,
      developerDiagnostics: {
        apiSaved: providersQueried.length === 0,
        cacheAgeMs: Math.max(0, Date.now() - new Date(snapshot.updatedAt).getTime()),
        observationAgeMs: Math.max(0, Date.now() - new Date(observedAt).getTime()),
        providerHit,
        providerRequestJustification,
        replay,
        repositoryHit: !providerHit,
        repositorySource: repositorySource ?? undefined,
      },
      lastObservation: observedAt,
      lastRefresh: new Date().toISOString(),
      marketTrend: snapshot.marketIntelligence?.trend ?? "Unknown",
      observationSource,
      refreshStatus: replay
        ? "Replay Reused"
        : providerHit
          ? "Provider Refreshed"
          : "Repository Reused",
    });
  } catch (error) {
    return calculateWatchlistMetrics({
      ...entry,
      developerDiagnostics: {
        ...entry.developerDiagnostics,
        apiSaved: false,
        cacheAgeMs: getObservationAgeMs(entry),
        errorMessage: error instanceof Error ? error.message : "Unknown refresh error.",
        observationAgeMs: Date.now() - startedAt,
        providerHit: false,
        providerRequestJustification,
        replay: false,
        repositoryHit: false,
      },
      lastRefresh: new Date().toISOString(),
      refreshStatus: "Refresh Failed",
    });
  }
}
