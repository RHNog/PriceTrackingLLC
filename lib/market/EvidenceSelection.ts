import type { EvidenceProvenance } from "@/lib/market/EvidenceProvenance";
import type { TransitionalEvidenceProjection } from "@/lib/market/TransitionalEvidenceProjection";
import type { MarketSnapshotField } from "@/lib/market/MarketSnapshotMetadata";

export interface EvidenceSelection {
  fallbackReason: string;
  field: MarketSnapshotField;
  provenance: EvidenceProvenance | null;
  projection?: TransitionalEvidenceProjection;
  selectedProvider: string | null;
  value: number | null;
}

export type EvidenceSelectionRecord = Partial<
  Record<MarketSnapshotField, EvidenceSelection>
>;
