import type { Watchlist } from "@/types/watchlist";

type WatchlistCardProps = {
  watchlist: Watchlist;
};

const colorStyles: Record<string, string> = {
  emerald: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  blue: "border-blue-400/30 bg-blue-400/10 text-blue-300",
  orange: "border-orange-400/30 bg-orange-400/10 text-orange-300",
  purple: "border-purple-400/30 bg-purple-400/10 text-purple-300",
};

const iconLabels: Record<string, string> = {
  brazil: "BR",
  usa: "US",
  spike: "UP",
  watch: "MW",
};

export default function WatchlistCard({ watchlist }: WatchlistCardProps) {
  const typeLabel = watchlist.type === "system" ? "System" : "Manual";
  const statusLabel = watchlist.enabled ? "Enabled" : "Disabled";
  const accentClass = colorStyles[watchlist.color] ?? colorStyles.blue;

  return (
    <article className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-lg shadow-black/10 transition hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-zinc-900/80">
      {/* TODO: Open Watchlist. */}
      {/* TODO: Add Card. */}
      {/* TODO: Edit Watchlist. */}
      {/* TODO: Delete Watchlist. */}
      {/* TODO: View Opportunities. */}
      {/* TODO: Price History. */}
      {/* TODO: Alert Rules. */}
      <div className="flex items-start justify-between gap-5">
        <div className="flex gap-4">
          <div
            className={`flex h-12 w-12 flex-none items-center justify-center rounded-lg border text-xl ${accentClass}`}
            aria-hidden="true"
          >
            {iconLabels[watchlist.icon] ?? "WL"}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">
              {watchlist.name}
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {watchlist.description}
            </p>
          </div>
        </div>

        <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs font-medium text-zinc-300">
          {typeLabel}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-zinc-800 pt-5 text-sm">
        <div className="rounded-md bg-zinc-950/60 p-3">
          <p className="text-xs text-zinc-500">Cards</p>
          <p className="mt-1 text-lg font-semibold text-white">
            {watchlist.cardCount}
          </p>
        </div>
        <div className="rounded-md bg-zinc-950/60 p-3">
          <p className="text-xs text-zinc-500">Opportunities</p>
          <p className="mt-1 text-lg font-semibold text-white">
            {watchlist.opportunities}
          </p>
        </div>
        <div className="rounded-md bg-zinc-950/60 p-3">
          <p className="text-xs text-zinc-500">Last Updated</p>
          <p className="mt-1 text-sm font-medium text-zinc-300">
            {watchlist.lastUpdated}
          </p>
        </div>
        <div className="rounded-md bg-zinc-950/60 p-3">
          <p className="text-xs text-zinc-500">Status</p>
          <p
            className={`mt-1 text-sm font-medium ${
              watchlist.enabled ? "text-emerald-400" : "text-zinc-400"
            }`}
          >
            {statusLabel}
          </p>
        </div>
      </div>
    </article>
  );
}
