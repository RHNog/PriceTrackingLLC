import type { MarketSnapshotFreshness } from "@/lib/market/MarketSnapshotMetadata";

export interface ProviderEvidenceScore {
  confidence: number;
  coverage: number;
  freshness: MarketSnapshotFreshness;
}

export function createProviderEvidenceScore(input: {
  confidence?: number | null;
  coverage?: number | null;
  freshness?: MarketSnapshotFreshness;
}): ProviderEvidenceScore {
  return {
    confidence: Math.max(0, Math.min(100, Math.round(input.confidence ?? 0))),
    coverage: Math.max(0, Math.min(100, Math.round(input.coverage ?? 0))),
    freshness: input.freshness ?? "Fresh",
  };
}
