import {
  DefaultRankingWeights,
  type RankingWeights,
} from "@/lib/engines/ranking/RankingWeights";
import type { OpportunityRanking } from "@/types/opportunity";

type OpportunityRankingInput = {
  profit: number;
  roi: number;
  confidence: number;
  liquidity?: number;
  risk?: number;
  weights?: RankingWeights;
};

function clampScore(score: number) {
  return Math.max(0, Math.min(100, score));
}

function normalizeProfit(profit: number) {
  return clampScore((profit / 150) * 100);
}

function normalizeRoi(roi: number) {
  return clampScore((roi / 25) * 100);
}

function getGrade(score: number): OpportunityRanking["grade"] {
  if (score >= 95) {
    return "S";
  }

  if (score >= 85) {
    return "A";
  }

  if (score >= 70) {
    return "B";
  }

  if (score >= 55) {
    return "C";
  }

  return "D";
}

export function calculateOpportunityRanking(
  input: OpportunityRankingInput,
): OpportunityRanking {
  const weights = input.weights ?? DefaultRankingWeights;
  const liquidity = input.liquidity ?? 50;
  const risk = input.risk ?? 50;
  const profitScore = normalizeProfit(input.profit);
  const roiScore = normalizeRoi(input.roi);
  const rawScore =
    profitScore * weights.profit +
    roiScore * weights.roi +
    input.confidence * weights.confidence +
    liquidity * weights.liquidity +
    risk * weights.risk;
  const score = Math.round(clampScore(rawScore));

  return {
    score,
    grade: getGrade(score),
    explanation: [
      `Profit contributes ${Math.round(profitScore)} points before weighting.`,
      `ROI contributes ${Math.round(roiScore)} points before weighting.`,
      `Confidence signal is ${input.confidence}.`,
      "Liquidity uses a placeholder signal.",
      "Risk uses a placeholder signal.",
    ],
  };
}
