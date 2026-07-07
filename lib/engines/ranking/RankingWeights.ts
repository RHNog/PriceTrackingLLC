export type RankingWeights = {
  profit: number;
  roi: number;
  confidence: number;
  liquidity: number;
  risk: number;
};

export const DefaultRankingWeights: RankingWeights = {
  profit: 0.4,
  roi: 0.25,
  confidence: 0.15,
  liquidity: 0.15,
  risk: 0.05,
};
