export interface ProfitCalculation {
  netProfit: number;
  paymentFee: number;
  trace: ProfitCalculationTrace;
  totalCosts: number;
}

export interface ProfitCalculationTrace {
  estimatedFees: number;
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
  purchasePrice: number;
  sellPrice: number;
  marketplaceFees: number;
  shippingCost: number;
};

export function calculateNetProfit(
  input: CalculateNetProfitInput,
): ProfitCalculation {
  const paymentFee = input.sellPrice * 0.03;
  const totalCosts =
    input.purchasePrice +
    input.marketplaceFees +
    input.shippingCost +
    paymentFee;
  const netProfit = input.sellPrice - totalCosts;

  return {
    netProfit: Math.round(netProfit),
    paymentFee: Math.round(paymentFee),
    trace: {
      estimatedFees: input.marketplaceFees,
      estimatedShipping: input.shippingCost,
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
