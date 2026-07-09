import type {
  MarketSnapshotField,
  MarketSnapshotMetadata,
} from "@/lib/market/MarketSnapshotMetadata";
import type { ProviderEvidenceCoverage } from "@/lib/market/EvidenceCoverage";
import type { EvidenceSelectionRecord } from "@/lib/market/EvidenceSelection";
import type { ProviderEvidenceScore } from "@/lib/market/ProviderEvidenceScore";
import type { ProviderPriceClassification } from "@/lib/market/ProviderPricingClassifier";
import type { MarketProviderRawObservation } from "@/types/marketSnapshot";

export interface MarketSnapshotIdentity {
  cardIdentity: string;
  condition: string;
  finish: string;
  printingId: string;
  variantId: string;
}

export interface MarketEvidenceNode {
  assetId: string;
  certification?: {
    grade?: string;
    provider?: string;
    serialNumber?: string;
  };
  condition: string;
  conditionSpecific: boolean;
  finish: string;
  game?: string;
  language?: string;
  nodeId: string;
  printingId: string;
  productIdentifier?: string;
  providerCondition?: string;
  variantId: string;
}

export interface MarketProviderEvidence {
  classification: ProviderPriceClassification;
  confidence: ProviderEvidenceScore;
  field: MarketSnapshotField;
  node: MarketEvidenceNode;
  providerName: string;
  rawObservations?: MarketProviderRawObservation[];
  retrievedAt: string;
  source: string;
  value: number;
}

export interface MarketIntelligenceRepositorySnapshot {
  identity: MarketSnapshotIdentity;
  evidence: MarketProviderEvidence[];
  evidenceCoverage: ProviderEvidenceCoverage;
  evidenceSelections: EvidenceSelectionRecord;
  listingCount: number | null;
  liquidity: number | null;
  lowestListing: number | null;
  marketConfidence: number | null;
  marketPrice: number | null;
  metadata: MarketSnapshotMetadata;
  providerId: string;
  recentSales: number | null;
  salesVelocity: number | null;
  spread: number | null;
  volatility: number | null;
}

export type MarketSnapshotFieldValues = Partial<
  Pick<
    MarketIntelligenceRepositorySnapshot,
    | "listingCount"
    | "liquidity"
    | "lowestListing"
    | "marketConfidence"
    | "marketPrice"
    | "providerId"
    | "recentSales"
    | "salesVelocity"
    | "spread"
    | "volatility"
  >
>;

export interface MarketSnapshotRefresh {
  evidence: MarketProviderEvidence[];
  fields: MarketSnapshotField[];
  providerId: string;
  refreshedAt: string;
  refreshTimeMs: number;
  values: MarketSnapshotFieldValues;
}
