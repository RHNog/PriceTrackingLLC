import { mockCards } from "@/data/mockCards";
import { mockListings } from "@/data/mockListings";
import { calculateOpportunityRanking } from "@/lib/engines/ranking/calculateOpportunityRanking";
import type { Card } from "@/types/card";
import type { Opportunity, RankedOpportunity } from "@/types/opportunity";
import type { StrategyProfile } from "@/types/strategyProfile";

const DEFAULT_CONFIDENCE = 80;
const DEFAULT_LIQUIDITY = 50;
const DEFAULT_RISK = 50;

type StrategyConstraintInput = {
  game: Card["game"];
  marketplaceId: string;
  profit: number;
  roi: number;
  purchasePrice: number;
  score?: number;
};

function findById<T extends { id: string }>(items: T[], id: string) {
  return items.find((item) => item.id === id);
}

export function passesStrategyConstraints(
  strategyProfile: StrategyProfile,
  input: StrategyConstraintInput,
) {
  const constraints = strategyProfile.constraints;

  return (
    input.profit >= constraints.minimumProfit &&
    input.roi >= constraints.minimumROI &&
    input.purchasePrice <= constraints.maximumPurchasePrice &&
    (input.score ?? 100) >= constraints.minimumOpportunityScore &&
    constraints.allowedGames.includes(input.game) &&
    constraints.allowedMarketplaces.includes(input.marketplaceId)
  );
}

export function applyStrategy(
  strategyProfile: StrategyProfile,
  opportunities: Opportunity[],
): RankedOpportunity[] {
  // TODO: Strategy Builder.
  // TODO: Editable Weight Sliders.
  // TODO: Constraint Editor.
  // TODO: Import strategy and export strategy.
  // TODO: Marketplace-specific strategies.
  // TODO: Tournament strategies and inventory strategies.
  // TODO: AI-generated strategies and machine-learning optimized strategies.
  return opportunities
    .filter((opportunity) => {
      const card = findById(mockCards, opportunity.cardId);
      const buyListing = findById(mockListings, opportunity.buyListingId);

      if (!card || !buyListing) {
        return false;
      }

      return passesStrategyConstraints(strategyProfile, {
        game: card.game,
        marketplaceId: buyListing.marketplaceId,
        profit: opportunity.profit,
        roi: opportunity.roi,
        purchasePrice: buyListing.price,
      });
    })
    .map((opportunity) => {
      const ranking = calculateOpportunityRanking({
        profit: opportunity.profit,
        roi: opportunity.roi,
        confidence: DEFAULT_CONFIDENCE,
        liquidity: DEFAULT_LIQUIDITY,
        risk: DEFAULT_RISK,
        weights: strategyProfile.rankingWeights,
      });

      return {
        ...opportunity,
        score: ranking.score,
        ranking,
      };
    })
    .filter(
      (opportunity) =>
        passesStrategyConstraints(strategyProfile, {
          game:
            findById(mockCards, opportunity.cardId)?.game ?? "Magic",
          marketplaceId:
            findById(mockListings, opportunity.buyListingId)?.marketplaceId ??
            "",
          profit: opportunity.profit,
          roi: opportunity.roi,
          purchasePrice:
            findById(mockListings, opportunity.buyListingId)?.price ?? 0,
          score: opportunity.score,
        }),
    )
    .sort((first, second) => second.score - first.score);
}
