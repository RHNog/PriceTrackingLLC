import type { BusinessProfile } from "@/lib/business/BusinessProfileEngine";
import { marketplaceProfiles } from "@/lib/business/MarketplaceProfile";

const timestamp = "2026-07-08T00:00:00.000Z";

function profileFromMarketplace(input: {
  id: string;
  name: string;
  marketplaceId: string;
  minimumProfit: number;
  minimumROI: number;
  maximumCapitalExposure: number;
  targetMargin: number;
  targetROI: number;
  laborCost: number;
  miscellaneousCost?: number;
  negotiationAggressiveness: BusinessProfile["negotiationAggressiveness"];
  riskTolerance: BusinessProfile["riskTolerance"];
}): BusinessProfile {
  const marketplace =
    marketplaceProfiles.find((item) => item.id === input.marketplaceId) ??
    marketplaceProfiles[0];

  return {
    id: input.id,
    name: input.name,
    currency: "USD",
    country: "US",
    defaultMarketplace: marketplace.name,
    costProfile: {
      marketplaceFeePercent: marketplace.marketplaceFeePercent,
      paymentProcessingFeePercent: marketplace.paymentFeePercent,
      packagingCost: marketplace.typicalPackagingCost,
      shippingCost: marketplace.typicalShippingCost,
      laborCost: input.laborCost,
      miscellaneousCost: input.miscellaneousCost ?? 0,
      fixedTransactionCost: marketplace.fixedTransactionCost,
      variableTransactionCostPercent: 0,
    },
    shippingProfile: {
      method: marketplace.typicalShippingCost > 0 ? "Tracked" : "None",
      typicalShippingCost: marketplace.typicalShippingCost,
      typicalPackagingCost: marketplace.typicalPackagingCost,
    },
    paymentProfile: {
      paymentMethod: marketplace.paymentFeePercent > 0 ? "Card / Digital" : "Cash",
      processingFeePercent: marketplace.paymentFeePercent,
      fixedProcessingCost: marketplace.fixedTransactionCost,
    },
    taxProfile: {
      taxModel: "excluded",
      estimatedTaxPercent: 0,
    },
    minimumROI: input.minimumROI,
    minimumProfit: input.minimumProfit,
    maximumCapitalExposure: input.maximumCapitalExposure,
    targetMargin: input.targetMargin,
    targetROI: input.targetROI,
    negotiationAggressiveness: input.negotiationAggressiveness,
    riskTolerance: input.riskTolerance,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export const defaultBusinessProfileId = "online-marketplace";

export const defaultBusinessProfiles: BusinessProfile[] = [
  profileFromMarketplace({
    id: "prime-time-retail",
    name: "Prime Time Retail",
    marketplaceId: "tcgplayer",
    minimumProfit: 75,
    minimumROI: 20,
    maximumCapitalExposure: 2000,
    targetMargin: 30,
    targetROI: 25,
    laborCost: 3,
    negotiationAggressiveness: "Balanced",
    riskTolerance: "Medium",
  }),
  profileFromMarketplace({
    id: "convention-buying",
    name: "Convention Buying",
    marketplaceId: "convention-sales",
    minimumProfit: 50,
    minimumROI: 18,
    maximumCapitalExposure: 2500,
    targetMargin: 26,
    targetROI: 22,
    laborCost: 5,
    miscellaneousCost: 2,
    negotiationAggressiveness: "Aggressive",
    riskTolerance: "Medium",
  }),
  profileFromMarketplace({
    id: "cash-only",
    name: "Cash Only",
    marketplaceId: "local-cash",
    minimumProfit: 35,
    minimumROI: 12,
    maximumCapitalExposure: 1500,
    targetMargin: 20,
    targetROI: 15,
    laborCost: 1,
    negotiationAggressiveness: "Conservative",
    riskTolerance: "Low",
  }),
  profileFromMarketplace({
    id: "online-marketplace",
    name: "Online Marketplace",
    marketplaceId: "ebay",
    minimumProfit: 8,
    minimumROI: 25,
    maximumCapitalExposure: 2000,
    targetMargin: 34,
    targetROI: 30,
    laborCost: 4,
    negotiationAggressiveness: "Balanced",
    riskTolerance: "Medium",
  }),
];
