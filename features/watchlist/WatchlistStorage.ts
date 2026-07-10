import {
  calculateWatchlistMetrics,
  type WatchlistDeveloperDiagnostics,
  type WatchlistEntry,
} from "@/features/watchlist/WatchlistRefreshEngine";

const storageKey = "project-phronesis-market-watch-v1";

function hoursAgo(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function createSeedDiagnostics(hours: number): WatchlistDeveloperDiagnostics {
  const ageMs = hours * 60 * 60 * 1000;

  return {
    apiSaved: true,
    cacheAgeMs: ageMs,
    observationAgeMs: ageMs,
    providerHit: false,
    replay: false,
    repositoryHit: true,
    repositorySource: "Seeded repository observation",
  };
}

export const seedWatchlistEntries: WatchlistEntry[] = [
  calculateWatchlistMetrics({
    assetIdentity: {
      assetId: "magic:mox-opal",
      collectorNumber: "179",
      game: "magic",
      name: "Mox Opal",
      printing: "Scars of Mirrodin #179",
      printingId: "scars-of-mirrodin-179",
      providerProductIdentifier: "mox-opal",
      providerVariantIdentifier: "mox-opal-som-normal-nm-english",
      setCode: "SOM",
      variantId: "scars-of-mirrodin-179-normal",
    },
    condition: "NM",
    currentValuation: 182,
    developerDiagnostics: createSeedDiagnostics(2),
    finish: "normal",
    id: "mox-opal-som-normal-nm-english",
    language: "English",
    lastObservation: hoursAgo(2),
    lastRefresh: hoursAgo(2),
    marketTrend: "Stable",
    observationSource: "Repository",
    refreshStatus: "Repository Reused",
    targetPrice: 220,
  }),
  calculateWatchlistMetrics({
    assetIdentity: {
      assetId: "magic:lightning-bolt",
      collectorNumber: "150",
      game: "magic",
      name: "Lightning Bolt",
      printing: "Secret Lair #150",
      printingId: "secret-lair-lightning-bolt-150",
      providerProductIdentifier: "lightning-bolt",
      providerVariantIdentifier: "lightning-bolt-secret-lair-foil-nm-english",
      setCode: "SLD",
      variantId: "secret-lair-lightning-bolt-150-foil",
    },
    condition: "NM",
    currentValuation: 38,
    developerDiagnostics: createSeedDiagnostics(9),
    finish: "foil",
    id: "lightning-bolt-secret-lair-foil-nm-english",
    language: "English",
    lastObservation: hoursAgo(9),
    lastRefresh: hoursAgo(9),
    marketTrend: "Increasing",
    observationSource: "Repository",
    refreshStatus: "Refresh Skipped",
    targetPrice: 42,
  }),
  calculateWatchlistMetrics({
    assetIdentity: {
      assetId: "magic:collected-company",
      collectorNumber: "177",
      game: "magic",
      name: "Collected Company",
      printing: "Dragons of Tarkir #177",
      printingId: "dragons-of-tarkir-177",
      providerProductIdentifier: "collected-company",
      providerVariantIdentifier: "collected-company-dtk-normal-lp-english",
      setCode: "DTK",
      variantId: "dragons-of-tarkir-177-normal",
    },
    condition: "LP",
    currentValuation: 13.5,
    developerDiagnostics: createSeedDiagnostics(4),
    finish: "normal",
    id: "collected-company-dtk-normal-lp-english",
    language: "English",
    lastObservation: hoursAgo(4),
    lastRefresh: hoursAgo(4),
    marketTrend: "Declining",
    observationSource: "Repository",
    refreshStatus: "Repository Reused",
    targetPrice: 20,
  }),
  calculateWatchlistMetrics({
    assetIdentity: {
      assetId: "lorcana:elsa-spirit-of-winter",
      collectorNumber: "42",
      game: "lorcana",
      name: "Elsa - Spirit of Winter",
      printing: "The First Chapter #42",
      printingId: "lorcana-first-chapter-42",
      setCode: "TFC",
      variantId: "lorcana-first-chapter-42-cold-foil",
    },
    condition: "NM",
    currentValuation: 815,
    developerDiagnostics: createSeedDiagnostics(30),
    finish: "cold foil",
    id: "elsa-spirit-of-winter-tfc-cold-foil-nm-english",
    language: "English",
    lastObservation: hoursAgo(30),
    lastRefresh: hoursAgo(30),
    marketTrend: "Unknown",
    observationSource: "Repository",
    refreshStatus: "Refresh Skipped",
    targetPrice: 900,
  }),
];

export function loadWatchlistEntries() {
  if (typeof window === "undefined") {
    return seedWatchlistEntries;
  }

  const raw = window.localStorage.getItem(storageKey);

  if (!raw) {
    saveWatchlistEntries(seedWatchlistEntries);

    return seedWatchlistEntries;
  }

  try {
    const parsed = JSON.parse(raw) as WatchlistEntry[];

    return parsed.map((entry) => calculateWatchlistMetrics(entry));
  } catch {
    saveWatchlistEntries(seedWatchlistEntries);

    return seedWatchlistEntries;
  }
}

export function saveWatchlistEntries(entries: WatchlistEntry[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(entries));
}

export function updateWatchlistEntry(
  entries: WatchlistEntry[],
  updatedEntry: WatchlistEntry,
) {
  return entries.map((entry) =>
    entry.id === updatedEntry.id ? updatedEntry : entry,
  );
}
