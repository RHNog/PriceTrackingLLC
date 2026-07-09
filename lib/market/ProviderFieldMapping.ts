import type { MarketSnapshotField } from "@/lib/market/MarketSnapshotMetadata";
import type { ProviderPriceClassification } from "@/lib/market/ProviderPricingClassifier";

export interface ProviderFieldMapping {
  classification: ProviderPriceClassification;
  providerField: string;
  repositoryField: MarketSnapshotField;
}

export const providerFieldMappings: ProviderFieldMapping[] = [
  {
    classification: "Market Price",
    providerField: "prices[].price where priceType=market_estimate",
    repositoryField: "marketPrice",
  },
  {
    classification: "Lowest Listing",
    providerField: "prices[].price where priceType=lowest_known",
    repositoryField: "lowestListing",
  },
  {
    classification: "Recent Sale",
    providerField: "marketIntelligence.recentSalesCount",
    repositoryField: "recentSales",
  },
  {
    classification: "Market Price",
    providerField: "marketIntelligence.marketConfidence",
    repositoryField: "marketConfidence",
  },
  {
    classification: "Market Price",
    providerField: "marketIntelligence.liquidity",
    repositoryField: "liquidity",
  },
];
