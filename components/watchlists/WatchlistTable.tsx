import { mockWatchlists } from "@/lib/mockWatchlists";
import WatchlistRow from "@/components/watchlists/WatchlistRow";

export default function WatchlistTable() {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-950 text-xs uppercase tracking-wide text-zinc-500">
          <tr>
            <th scope="col" className="px-5 py-3 font-medium">
              Name
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              Cards
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              Alerts
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              Last Updated
            </th>
          </tr>
        </thead>
        <tbody>
          {mockWatchlists.map((watchlist) => (
            <WatchlistRow key={watchlist.name} watchlist={watchlist} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
