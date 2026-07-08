import type {
  BusinessCostBreakdown,
  CostProfile,
} from "@/lib/business/CostProfile";
import type { PaymentProfile } from "@/lib/business/PaymentProfile";
import type { ShippingProfile } from "@/lib/business/ShippingProfile";
import type { TaxProfile } from "@/lib/business/TaxProfile";

export type NegotiationAggressiveness =
  | "Conservative"
  | "Balanced"
  | "Aggressive";

export type RiskTolerance = "Low" | "Medium" | "High";

export interface OfferPolicy {
  desiredMargin: number;
  maximumCapitalExposure: number;
  minimumProfit: number;
  minimumROI: number;
  negotiationAggressiveness: NegotiationAggressiveness;
}

export interface BusinessProfile {
  id: string;
  name: string;
  currency: string;
  country: string;
  defaultMarketplace: string;
  costProfile: CostProfile;
  shippingProfile: ShippingProfile;
  paymentProfile: PaymentProfile;
  taxProfile: TaxProfile;
  minimumROI: number;
  minimumProfit: number;
  maximumCapitalExposure: number;
  targetMargin: number;
  targetROI: number;
  negotiationAggressiveness: NegotiationAggressiveness;
  riskTolerance: RiskTolerance;
  createdAt: string;
  updatedAt: string;
}

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

export function calculateBusinessCosts(
  businessProfile: BusinessProfile,
  sellPrice: number,
): BusinessCostBreakdown {
  const costProfile = businessProfile.costProfile;
  const marketplaceFees = sellPrice * (costProfile.marketplaceFeePercent / 100);
  const paymentFees =
    sellPrice * (costProfile.paymentProcessingFeePercent / 100);
  const variableCosts =
    sellPrice * (costProfile.variableTransactionCostPercent / 100);
  const fixedCosts =
    costProfile.packagingCost +
    costProfile.laborCost +
    costProfile.miscellaneousCost +
    costProfile.fixedTransactionCost +
    variableCosts;
  const totalCosts =
    marketplaceFees + paymentFees + costProfile.shippingCost + fixedCosts;

  return {
    fixedCosts: roundCurrency(fixedCosts),
    marketplaceFees: roundCurrency(marketplaceFees),
    paymentFees: roundCurrency(paymentFees),
    shippingCost: roundCurrency(costProfile.shippingCost),
    totalCosts: roundCurrency(totalCosts),
  };
}

export function explainBusinessProfile(
  businessProfile: BusinessProfile,
  costs: BusinessCostBreakdown,
) {
  return [
    `Business Profile: ${businessProfile.name}`,
    `Marketplace: ${businessProfile.defaultMarketplace}`,
    `Marketplace fees: ${costs.marketplaceFees}`,
    `Payment fees: ${costs.paymentFees}`,
    `Shipping: ${costs.shippingCost}`,
    `Fixed and variable costs: ${costs.fixedCosts}`,
    `Minimum profit: ${businessProfile.minimumProfit}`,
    `Minimum ROI: ${businessProfile.minimumROI}%`,
  ];
}

export function createOfferPolicy(
  businessProfile: BusinessProfile,
): OfferPolicy {
  return {
    desiredMargin: businessProfile.targetMargin,
    maximumCapitalExposure: businessProfile.maximumCapitalExposure,
    minimumProfit: businessProfile.minimumProfit,
    minimumROI: businessProfile.minimumROI,
    negotiationAggressiveness: businessProfile.negotiationAggressiveness,
  };
}
