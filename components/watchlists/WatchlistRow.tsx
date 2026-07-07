import type { Watchlist } from "@/lib/mockWatchlists";

type WatchlistRowProps = {
  watchlist: Watchlist;
};

export default function WatchlistRow({ watchlist }: WatchlistRowProps) {
  return (
    <tr className="border-t border-zinc-800">
      <td className="px-5 py-4 font-medium text-white">{watchlist.name}</td>
      <td className="px-5 py-4 text-zinc-300">{watchlist.cards}</td>
      <td className="px-5 py-4 text-zinc-300">{watchlist.alerts}</td>
      <td className="px-5 py-4 text-zinc-400">{watchlist.lastUpdated}</td>
    </tr>
  );
}
