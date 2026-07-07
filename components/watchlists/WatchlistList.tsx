import WatchlistCard from "@/components/watchlists/WatchlistCard";
import type { Watchlist } from "@/types/watchlist";

type WatchlistListProps = {
  watchlists: Watchlist[];
};

export default function WatchlistList({ watchlists }: WatchlistListProps) {
  return (
    <section
      aria-label="Watchlist strategies"
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
    >
      {/* TODO: Marketplace Synchronization. */}
      {watchlists.map((watchlist) => (
        <WatchlistCard key={watchlist.id} watchlist={watchlist} />
      ))}
    </section>
  );
}
