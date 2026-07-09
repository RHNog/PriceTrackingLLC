import type { ProviderPriceClassification } from "@/lib/market/ProviderPricingClassifier";

export interface MarketTruthReport {
  matchedAsset: string;
  matchedCondition: string;
  matchedFinish: string;
  matchedPriceType: ProviderPriceClassification[];
  matchedPrinting: string;
  rejectedFields: string[];
  valid: boolean;
  validationConfidence: number;
  warnings: string[];
}
