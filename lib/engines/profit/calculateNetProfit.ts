import {
  calculateBusinessCosts,
  type BusinessProfile,
} from "@/lib/business/BusinessProfileEngine";
import { getDefaultBusinessProfile } from "@/lib/business/BusinessProfileRegistry";

export interface ProfitCalculation {
  netProfit: number;
  paymentFee: number;
  trace: ProfitCalculationTrace;
  totalCosts: number;
}

export interface ProfitCalculationTrace {
  businessProfileName: string;
  estimatedFees: number;
  estimatedFixedCosts: number;
  estimatedShipping: number;
  finalExpectedProfit: number;
  profitAfterCosts: number;
  profitBeforeCosts: number;
  purchasePrice: number;
  rawMarketEstimate: number;
  strategyAdjustments: string[];
  variantAdjustment: string;
}

type CalculateNetProfitInput = {
  businessProfile?: BusinessProfile;
  purchasePrice: number;
  sellPrice: number;
  marketplaceFees?: number;
  shippingCost?: number;
};

export function calculateNetProfit(
  input: CalculateNetProfitInput,
): ProfitCalculation {
  const businessProfile = input.businessProfile ?? getDefaultBusinessProfile();
  const businessCosts = calculateBusinessCosts(businessProfile, input.sellPrice);
  const marketplaceFees = input.marketplaceFees ?? businessCosts.marketplaceFees;
  const shippingCost = input.shippingCost ?? businessCosts.shippingCost;
  const paymentFee =
    input.businessProfile || input.marketplaceFees === undefined
      ? businessCosts.paymentFees
      : input.sellPrice * 0.03;
  const fixedCosts =
    input.businessProfile || input.marketplaceFees === undefined
      ? businessCosts.fixedCosts
      : 0;
  const totalCosts =
    input.purchasePrice +
    marketplaceFees +
    shippingCost +
    paymentFee +
    fixedCosts;
  const netProfit = input.sellPrice - totalCosts;

  return {
    netProfit: Math.round(netProfit),
    paymentFee: Math.round(paymentFee),
    trace: {
      businessProfileName: businessProfile.name,
      estimatedFees: Math.round((marketplaceFees + paymentFee + fixedCosts) * 100) / 100,
      estimatedFixedCosts: fixedCosts,
      estimatedShipping: shippingCost,
      finalExpectedProfit: Math.round(netProfit),
      profitAfterCosts: Math.round(netProfit),
      profitBeforeCosts:
        Math.round((input.sellPrice - input.purchasePrice) * 100) / 100,
      purchasePrice: input.purchasePrice,
      rawMarketEstimate: input.sellPrice,
      strategyAdjustments: [],
      variantAdjustment: "Variant adjustment is represented in market price.",
    },
    totalCosts: Math.round(totalCosts),
  };
}
