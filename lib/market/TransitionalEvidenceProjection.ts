import type { EvidenceProvenance } from "@/lib/market/EvidenceProvenance";
import type { MarketSnapshotField } from "@/lib/market/MarketSnapshotMetadata";

export interface TransitionalEvidenceProjection {
  evidenceSource: string | null;
  projectionUsed: boolean;
  reason: string;
  requestedUiField: string;
  resolvedEvidenceDomain: string;
}

function normalizeProvider(providerName: string | null | undefined) {
  return providerName?.toLowerCase().trim() ?? "";
}

export function getMissingEvidenceReason(field: MarketSnapshotField) {
  if (field === "lowestListing") {
    return "Listing Intelligence provider not connected.";
  }

  if (field === "recentSales") {
    return "No Transaction Intelligence provider connected.";
  }

  return "No provider evidence is available for this field.";
}

export function createTransitionalEvidenceProjection(input: {
  field: MarketSnapshotField;
  provenance: EvidenceProvenance | null;
}): TransitionalEvidenceProjection | undefined {
  if (input.field !== "marketPrice") {
    return undefined;
  }

  if (normalizeProvider(input.provenance?.providerName) !== "justtcg") {
    return {
      evidenceSource: input.provenance?.source ?? null,
      projectionUsed: false,
      reason: "Current Market Estimate resolved from direct market estimate evidence.",
      requestedUiField: "Current Market Estimate",
      resolvedEvidenceDomain: "Market Intelligence",
    };
  }

  return {
    evidenceSource: input.provenance?.source ?? null,
    projectionUsed: true,
    reason:
      "Variant Valuation is projected into Current Market Estimate until the Market Intelligence Engine is available.",
    requestedUiField: "Current Market Estimate",
    resolvedEvidenceDomain: "Variant Valuation",
  };
}
