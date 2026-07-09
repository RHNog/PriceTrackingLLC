import {
  validateProviderEvidence,
  type ProviderEvidenceValidationResult,
} from "@/lib/market/ProviderEvidenceValidator";
import type { MarketSnapshotRequestContext } from "@/lib/market/MarketIntelligenceRepository";
import type { MarketSnapshot } from "@/types/marketSnapshot";

export class MarketTruthEngine {
  evaluate(input: {
    context: MarketSnapshotRequestContext;
    snapshot: MarketSnapshot;
  }): ProviderEvidenceValidationResult {
    return validateProviderEvidence(input);
  }
}

export const marketTruthEngine = new MarketTruthEngine();
