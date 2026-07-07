import type { Listing } from "@/types/listing";
import type { Marketplace } from "@/types/marketplace";

type BuyListingCardProps = {
  listing: Listing;
  marketplace: Marketplace;
  sellerName: string;
  condition: string;
};

function formatCurrency(value: number) {
  return `$${value.toLocaleString()}`;
}

export default function BuyListingCard({
  listing,
  marketplace,
  sellerName,
  condition,
}: BuyListingCardProps) {
  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
      <h3 className="text-lg font-semibold text-white">Buy Listing</h3>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-zinc-500">Marketplace</dt>
          <dd className="mt-1 font-medium text-zinc-200">{marketplace.name}</dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Seller Name</dt>
          <dd className="mt-1 font-medium text-zinc-200">{sellerName}</dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Condition</dt>
          <dd className="mt-1 font-medium text-zinc-200">{condition}</dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Quantity</dt>
          <dd className="mt-1 font-medium text-zinc-200">{listing.quantity}</dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Price</dt>
          <dd className="mt-1 font-semibold text-white">
            {formatCurrency(listing.price)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Last Updated</dt>
          <dd className="mt-1 font-medium text-zinc-200">{listing.updatedAt}</dd>
        </div>
      </dl>

      <a
        href={listing.url}
        className="mt-6 inline-flex rounded-md bg-cyan-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-cyan-300"
      >
        Open Buy Listing
      </a>
    </section>
  );
}
