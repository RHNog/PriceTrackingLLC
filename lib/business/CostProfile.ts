export interface CostProfile {
  marketplaceFeePercent: number;
  paymentProcessingFeePercent: number;
  packagingCost: number;
  shippingCost: number;
  laborCost: number;
  miscellaneousCost: number;
  fixedTransactionCost: number;
  variableTransactionCostPercent: number;
}

export interface BusinessCostBreakdown {
  fixedCosts: number;
  marketplaceFees: number;
  paymentFees: number;
  shippingCost: number;
  totalCosts: number;
}

