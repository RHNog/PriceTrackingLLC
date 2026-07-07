import { mockCards } from "@/data/mockCards";
import { mockListings } from "@/data/mockListings";
import { calculateOpportunityRanking } from "@/lib/engines/ranking/calculateOpportunityRanking";
import type { Opportunity, RankedOpportunity } from "@/types/opportunity";
import type { StrategyProfile } from "@/types/strategyProfile";

const DEFAULT_CONFIDENCE = 80;
const DEFAULT_LIQUIDITY = 50;
const DEFAULT_RISK = 50;

function findById<T extends { id: string }>(items: T[], id: string) {
  return items.find((item) => item.id === id);
}

function passesStrategyFilters(
  strategyProfile: StrategyProfile,
  opportunity: Opportunity,
) {
  const card = findById(mockCards, opportunity.cardId);
  const buyListing = findById(mockListings, opportunity.buyListingId);

  if (!card || !buyListing) {
    return false;
  }

  const constraints = strategyProfile.constraints;

  return (
    opportunity.profit >= constraints.minimumProfit &&
    opportunity.roi >= constraints.minimumROI &&
    buyListing.price <= constraints.maximumPurchasePrice &&
    constraints.allowedGames.includes(card.game) &&
    constraints.allowedMarketplaces.includes(buyListing.marketplaceId)
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
    .filter((opportunity) => passesStrategyFilters(strategyProfile, opportunity))
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
        opportunity.score >= strategyProfile.constraints.minimumOpportunityScore,
    )
    .sort((first, second) => second.score - first.score);
}
