import type { Listing } from "@/types/listing";
import type { Marketplace } from "@/types/marketplace";

type SellListingCardProps = {
  listing: Listing;
  marketplace: Marketplace;
  recentSalePrice: number;
};

function formatCurrency(value: number) {
  return `$${value.toLocaleString()}`;
}

export default function SellListingCard({
  listing,
  marketplace,
  recentSalePrice,
}: SellListingCardProps) {
  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
      <h3 className="text-lg font-semibold text-white">Sell Listing</h3>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-zinc-500">Marketplace</dt>
          <dd className="mt-1 font-medium text-zinc-200">{marketplace.name}</dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Market Price</dt>
          <dd className="mt-1 font-semibold text-white">
            {formatCurrency(listing.price)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Recent Sale Price</dt>
          <dd className="mt-1 font-semibold text-emerald-400">
            {formatCurrency(recentSalePrice)}
          </dd>
        </div>
      </dl>

      <a
        href={listing.url}
        className="mt-6 inline-flex rounded-md bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-100 transition-colors hover:bg-zinc-700"
      >
        Open Sell Listing
      </a>
    </section>
  );
}
