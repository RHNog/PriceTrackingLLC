import BuyListingCard from "@/features/opportunities/components/BuyListingCard";
import OpportunityActions from "@/features/opportunities/components/OpportunityActions";
import ProfitBreakdown from "@/features/opportunities/components/ProfitBreakdown";
import SellListingCard from "@/features/opportunities/components/SellListingCard";
import type { Card } from "@/types/card";
import type { Listing } from "@/types/listing";
import type { Marketplace } from "@/types/marketplace";
import type { RankedOpportunity } from "@/types/opportunity";
import type { Watchlist } from "@/types/watchlist";

type OpportunityDetailsProps = {
  opportunity: RankedOpportunity;
  card: Card;
  watchlist: Watchlist;
  buyListing: Listing;
  sellListing: Listing;
  buyMarketplace: Marketplace;
  sellMarketplace: Marketplace;
};

export default function OpportunityDetails({
  opportunity,
  card,
  watchlist,
  buyListing,
  sellListing,
  buyMarketplace,
  sellMarketplace,
}: OpportunityDetailsProps) {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            {card.name}
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            {card.game} · {watchlist.name}
          </p>
        </div>
        <div className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-300">
          <p className="font-semibold">Score {opportunity.score}</p>
          <p>Grade {opportunity.ranking.grade}</p>
        </div>
      </div>

      <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <h3 className="text-lg font-semibold text-white">
          Ranking Explanation
        </h3>
        <ul className="mt-4 space-y-2 text-sm text-zinc-400">
          {opportunity.ranking.explanation.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <BuyListingCard
          listing={buyListing}
          marketplace={buyMarketplace}
          sellerName="Mock Seller"
          condition="Near Mint"
        />
        <SellListingCard
          listing={sellListing}
          marketplace={sellMarketplace}
          recentSalePrice={sellListing.price}
        />
      </div>

      <ProfitBreakdown opportunity={opportunity} purchasePrice={buyListing.price} />
      <OpportunityActions />
    </div>
  );
}
