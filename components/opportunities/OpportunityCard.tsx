import Link from "next/link";
import { mockCards } from "@/data/mockCards";
import { mockListings } from "@/data/mockListings";
import { mockMarketplaces } from "@/data/mockMarketplaces";
import { mockWatchlists } from "@/data/mockWatchlists";
import type { RankedOpportunity } from "@/types/opportunity";

type OpportunityCardProps = {
  opportunity: RankedOpportunity;
};

function formatCurrency(value: number) {
  return `$${value.toLocaleString()}`;
}

function findById<T extends { id: string }>(items: T[], id: string) {
  return items.find((item) => item.id === id);
}

export default function OpportunityCard({
  opportunity,
}: OpportunityCardProps) {
  const card = findById(mockCards, opportunity.cardId);
  const buyListing = findById(mockListings, opportunity.buyListingId);
  const sellListing = findById(mockListings, opportunity.sellListingId);
  const watchlist = findById(mockWatchlists, opportunity.watchlistId);
  const buyMarketplace = buyListing
    ? findById(mockMarketplaces, buyListing.marketplaceId)
    : undefined;
  const sellMarketplace = sellListing
    ? findById(mockMarketplaces, sellListing.marketplaceId)
    : undefined;

  return (
    <Link
      href={`/opportunities/${opportunity.id}`}
      className="block rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
    >
      <article className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-lg shadow-black/10 transition hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-zinc-900/80">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {card?.name ?? "Unknown Card"}
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              {card?.game ?? "Unknown Game"}
            </p>
          </div>

          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
            Grade {opportunity.ranking.grade}
          </span>
        </div>

        <div className="mt-5 rounded-md border border-zinc-800 bg-zinc-950/40 p-3">
          <p className="text-xs text-zinc-500">Watchlist</p>
          <p className="mt-1 text-sm font-medium text-zinc-300">
            {watchlist?.name ?? "Unknown Watchlist"}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-zinc-800 pt-5 text-sm">
          <div className="rounded-md bg-zinc-950/60 p-3">
            <p className="text-xs text-zinc-500">Purchase Price</p>
            <p className="mt-1 font-semibold text-white">
              {formatCurrency(buyListing?.price ?? 0)}
            </p>
          </div>
          <div className="rounded-md bg-zinc-950/60 p-3">
            <p className="text-xs text-zinc-500">Sell Price</p>
            <p className="mt-1 font-semibold text-white">
              {formatCurrency(sellListing?.price ?? 0)}
            </p>
          </div>
          <div className="rounded-md bg-zinc-950/60 p-3">
            <p className="text-xs text-zinc-500">Net Profit</p>
            <p
              className={`mt-1 text-lg font-semibold ${
                opportunity.profit >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {formatCurrency(opportunity.profit)}
            </p>
          </div>
          <div className="rounded-md bg-zinc-950/60 p-3">
            <p className="text-xs text-zinc-500">ROI</p>
            <p className="mt-1 text-lg font-semibold text-cyan-300">
              {opportunity.roi}%
            </p>
          </div>
          <div className="rounded-md bg-zinc-950/60 p-3">
            <p className="text-xs text-zinc-500">Marketplace Fees</p>
            <p className="mt-1 font-semibold text-white">
              {formatCurrency(opportunity.estimatedFees)}
            </p>
          </div>
          <div className="rounded-md bg-zinc-950/60 p-3">
            <p className="text-xs text-zinc-500">Shipping</p>
            <p className="mt-1 font-semibold text-white">
              {formatCurrency(opportunity.shippingCost)}
            </p>
          </div>
          <div className="rounded-md bg-zinc-950/60 p-3">
            <p className="text-xs text-zinc-500">Payment Fee</p>
            <p className="mt-1 font-semibold text-white">
              {formatCurrency(opportunity.paymentFee)}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 border-t border-zinc-800 pt-5 text-sm md:grid-cols-2">
          <div>
            <p className="text-xs text-zinc-500">Buy Marketplace</p>
            <p className="mt-1 font-medium text-zinc-300">
              {buyMarketplace?.name ?? "Unknown Marketplace"}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Sell Marketplace</p>
            <p className="mt-1 font-medium text-zinc-300">
              {sellMarketplace?.name ?? "Unknown Marketplace"}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Opportunity Score</p>
            <p className="mt-1 font-medium text-amber-300">
              {opportunity.score}
            </p>
            <p className="mt-1 font-medium text-zinc-300">
              Grade {opportunity.ranking.grade}
            </p>
            <ul className="mt-3 space-y-1 text-xs text-zinc-400">
              {opportunity.ranking.explanation.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Last Updated</p>
            <p className="mt-1 font-medium text-zinc-300">
              {opportunity.detectedAt}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
