import type { MarketRepositoryStatistics } from "@/lib/market/MarketRepositoryStatistics";
import type { ProviderEvidenceCoverage } from "@/lib/market/EvidenceCoverage";

export interface MarketRepositoryDiagnostics {
  averageFreshness: number;
  cacheHitRate: number;
  evidenceCoverage: ProviderEvidenceCoverage;
  estimatedApiCostSaved: number;
  health: "Healthy" | "Empty" | "Degraded";
  newestSnapshot: string | null;
  oldestSnapshot: string | null;
  providerUsage: Record<string, number>;
  statistics: MarketRepositoryStatistics;
}
