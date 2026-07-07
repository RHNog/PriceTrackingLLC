import type { Strategy } from "@/types/strategy";
import type { StrategyProfile } from "@/types/strategyProfile";

const allGames = ["Magic", "Pokemon", "One Piece", "Lorcana"] as const;
const allMarketplaces = [
  "tcgplayer",
  "card-kingdom",
  "ebay",
  "ligamagic",
  "cardtrader",
];

export const defaultStrategyId = "custom";

export const seedStrategies: Strategy[] = [
  {
    id: "high-profit",
    name: "High Profit",
    description: "Maximize total dollars earned.",
    profileId: "high-profit-profile",
    editable: false,
  },
  {
    id: "high-roi",
    name: "High ROI",
    description: "Maximize return percentage.",
    profileId: "high-roi-profile",
    editable: false,
  },
  {
    id: "quick-flips",
    name: "Quick Flips",
    description: "Prioritize low-cost opportunities with high turnover.",
    profileId: "quick-flips-profile",
    editable: false,
  },
  {
    id: "long-term-investment",
    name: "Long-Term Investment",
    description:
      "Favor higher-confidence opportunities with greater long-term value.",
    profileId: "long-term-investment-profile",
    editable: false,
  },
  {
    id: "custom",
    name: "Custom",
    description: "User-editable strategy.",
    profileId: "custom-profile",
    editable: true,
  },
];

export const seedStrategyProfiles: StrategyProfile[] = [
  {
    id: "high-profit-profile",
    rankingWeights: {
      profit: 0.55,
      roi: 0.15,
      confidence: 0.15,
      liquidity: 0.1,
      risk: 0.05,
    },
    constraints: {
      minimumProfit: 80,
      minimumROI: 5,
      maximumPurchasePrice: 2000,
      minimumOpportunityScore: 0,
      allowedGames: [...allGames],
      allowedMarketplaces: allMarketplaces,
    },
  },
  {
    id: "high-roi-profile",
    rankingWeights: {
      profit: 0.2,
      roi: 0.5,
      confidence: 0.15,
      liquidity: 0.1,
      risk: 0.05,
    },
    constraints: {
      minimumProfit: 25,
      minimumROI: 10,
      maximumPurchasePrice: 1500,
      minimumOpportunityScore: 0,
      allowedGames: [...allGames],
      allowedMarketplaces: allMarketplaces,
    },
  },
  {
    id: "quick-flips-profile",
    rankingWeights: {
      profit: 0.2,
      roi: 0.3,
      confidence: 0.15,
      liquidity: 0.3,
      risk: 0.05,
    },
    constraints: {
      minimumProfit: 20,
      minimumROI: 5,
      maximumPurchasePrice: 800,
      minimumOpportunityScore: 0,
      allowedGames: [...allGames],
      allowedMarketplaces: allMarketplaces,
    },
  },
  {
    id: "long-term-investment-profile",
    rankingWeights: {
      profit: 0.35,
      roi: 0.15,
      confidence: 0.35,
      liquidity: 0.05,
      risk: 0.1,
    },
    constraints: {
      minimumProfit: 75,
      minimumROI: 8,
      maximumPurchasePrice: 3000,
      minimumOpportunityScore: 0,
      allowedGames: [...allGames],
      allowedMarketplaces: allMarketplaces,
    },
  },
  {
    id: "custom-profile",
    rankingWeights: {
      profit: 0.4,
      roi: 0.25,
      confidence: 0.15,
      liquidity: 0.15,
      risk: 0.05,
    },
    constraints: {
      minimumProfit: 0,
      minimumROI: 0,
      maximumPurchasePrice: 5000,
      minimumOpportunityScore: 0,
      allowedGames: [...allGames],
      allowedMarketplaces: allMarketplaces,
    },
  },
];
