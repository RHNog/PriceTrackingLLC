import {
  calculateEvidenceCoverage,
  type ProviderEvidenceCoverage,
} from "@/lib/market/EvidenceCoverage";
import {
  evidenceAggregator,
  type EvidenceAggregator,
} from "@/lib/market/EvidenceAggregator";
import {
  evidenceResolver,
  type EvidenceResolver,
} from "@/lib/market/EvidenceResolver";
import type {
  MarketProviderEvidence,
  MarketSnapshotFieldValues,
} from "@/lib/market/MarketSnapshot";
import type { MarketSnapshotField } from "@/lib/market/MarketSnapshotMetadata";
import type { EvidenceSelectionRecord } from "@/lib/market/EvidenceSelection";
import { marketSnapshotFields } from "@/lib/market/MarketRefreshPolicy";

export interface MarketEvidenceLayerResult {
  coverage: ProviderEvidenceCoverage;
  evidenceStack: MarketProviderEvidence[];
  selectedValues: MarketSnapshotFieldValues;
  selections: EvidenceSelectionRecord;
}

const fieldValueKeys: MarketSnapshotField[] = [
  "marketPrice",
  "lowestListing",
  "listingCount",
  "recentSales",
  "spread",
  "liquidity",
  "salesVelocity",
  "volatility",
  "marketConfidence",
];

function selectionsToValues(
  selections: EvidenceSelectionRecord,
): MarketSnapshotFieldValues {
  return Object.fromEntries(
    fieldValueKeys.map((field) => [field, selections[field]?.value ?? null]),
  ) as MarketSnapshotFieldValues;
}

export class MarketEvidenceLayer {
  constructor(
    private readonly aggregator: EvidenceAggregator = evidenceAggregator,
    private readonly resolver: EvidenceResolver = evidenceResolver,
  ) {}

  apply(input: {
    existingEvidence: MarketProviderEvidence[];
    incomingEvidence: MarketProviderEvidence[];
    fields?: MarketSnapshotField[];
    now?: Date;
  }): MarketEvidenceLayerResult {
    const evidenceStack = this.aggregator.merge({
      existingEvidence: input.existingEvidence,
      incomingEvidence: input.incomingEvidence,
      now: input.now,
    });
    const selections = this.resolver.resolve({
      evidenceStack,
      fields: input.fields ?? marketSnapshotFields,
      now: input.now,
    });

    return {
      coverage: calculateEvidenceCoverage(evidenceStack),
      evidenceStack,
      selections,
      selectedValues: selectionsToValues(selections),
    };
  }
}

export const marketEvidenceLayer = new MarketEvidenceLayer();
