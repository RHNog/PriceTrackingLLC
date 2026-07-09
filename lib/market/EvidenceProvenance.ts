import type { MarketSnapshotField } from "@/lib/market/MarketSnapshotMetadata";
import type { MarketEvidenceNode } from "@/lib/market/MarketSnapshot";
import type { ProviderEvidenceScore } from "@/lib/market/ProviderEvidenceScore";
import type { ProviderPriceClassification } from "@/lib/market/ProviderPricingClassifier";

export interface EvidenceProvenance {
  classification: ProviderPriceClassification;
  confidence: ProviderEvidenceScore;
  field: MarketSnapshotField;
  freshness: ProviderEvidenceScore["freshness"];
  node: MarketEvidenceNode;
  providerName: string;
  providerPriority: number;
  retrievedAt: string;
  source: string;
}
