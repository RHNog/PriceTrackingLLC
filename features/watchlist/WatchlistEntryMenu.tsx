"use client";

import type { WatchlistEntry } from "@/features/watchlist/WatchlistRefreshEngine";

type WatchlistEntryMenuProps = {
  entry: WatchlistEntry;
  onEdit: (entry: WatchlistEntry) => void;
  onRemove: (entry: WatchlistEntry) => void;
};

export default function WatchlistEntryMenu({
  entry,
  onEdit,
  onRemove,
}: WatchlistEntryMenuProps) {
  return (
    <details className="group/menu relative">
      <summary
        aria-label={`Actions for ${entry.assetIdentity.name}`}
        className="flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-md border border-transparent text-lg text-zinc-500 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 [&::-webkit-details-marker]:hidden"
      >
        ⋮
      </summary>
      <div className="absolute right-0 z-20 mt-1 w-48 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 p-1 shadow-xl shadow-black/50">
        <button
          className="w-full rounded-md px-3 py-2 text-left text-sm text-zinc-200 hover:bg-zinc-800"
          onClick={() => onEdit(entry)}
          type="button"
        >
          Edit entry
        </button>
        <button
          className="w-full rounded-md px-3 py-2 text-left text-sm text-red-300 hover:bg-red-400/10"
          onClick={() => onRemove(entry)}
          type="button"
        >
          Remove from Watchlist
        </button>
      </div>
    </details>
  );
}
