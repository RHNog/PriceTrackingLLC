type OpportunityScoreInput = {
  roi: number;
  profit: number;
  shippingCost: number;
  estimatedFees: number;
};

export function calculateOpportunityScore(input: OpportunityScoreInput) {
  const rawScore =
    50 +
    input.roi * 1.5 +
    input.profit / 5 -
    input.shippingCost -
    input.estimatedFees / 2;

  const clampedScore = Math.max(0, Math.min(100, rawScore));

  return Math.round(clampedScore);
}
