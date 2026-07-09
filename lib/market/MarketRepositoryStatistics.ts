export interface MarketRepositoryStatistics {
  apiCallsSaved: number;
  averageRefreshTimeMs: number;
  averageSnapshotAgeMs: number;
  cacheHits: number;
  cacheMisses: number;
  providerCalls: number;
  repositorySize: number;
}

export function createEmptyMarketRepositoryStatistics(): MarketRepositoryStatistics {
  return {
    apiCallsSaved: 0,
    averageRefreshTimeMs: 0,
    averageSnapshotAgeMs: 0,
    cacheHits: 0,
    cacheMisses: 0,
    providerCalls: 0,
    repositorySize: 0,
  };
}
