export interface ProfitCalculation {
  netProfit: number;
  paymentFee: number;
  totalCosts: number;
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
    totalCosts: Math.round(totalCosts),
  };
}
