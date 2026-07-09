import { marketSnapshotFields } from "@/lib/market/MarketRefreshPolicy";
import type { MarketProviderEvidence } from "@/lib/market/MarketSnapshot";
import type { MarketSnapshotField } from "@/lib/market/MarketSnapshotMetadata";

export type ProviderEvidenceCoverage = Record<
  string,
  Partial<Record<MarketSnapshotField, boolean>>
>;

export function calculateEvidenceCoverage(
  evidenceStack: MarketProviderEvidence[],
): ProviderEvidenceCoverage {
  const providers = [...new Set(evidenceStack.map((evidence) => evidence.providerName))];

  return Object.fromEntries(
    providers.map((providerName) => [
      providerName,
      Object.fromEntries(
        marketSnapshotFields.map((field) => [
          field,
          evidenceStack.some(
            (evidence) =>
              evidence.providerName === providerName && evidence.field === field,
          ),
        ]),
      ),
    ]),
  ) as ProviderEvidenceCoverage;
}
