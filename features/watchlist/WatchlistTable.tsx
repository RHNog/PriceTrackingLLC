"use client";

import {
  DeveloperPanel,
  StatusLabel,
  formatAge,
  formatCurrency,
} from "@/features/watchlist/WatchlistCard";
import type { WatchlistEntry } from "@/features/watchlist/WatchlistRefreshEngine";

type WatchlistTableProps = {
  developerMode: boolean;
  entries: WatchlistEntry[];
  refreshingEntryId: string | null;
  onRefresh: (entry: WatchlistEntry) => void;
};

export default function WatchlistTable({
  developerMode,
  entries,
  refreshingEntryId,
  onRefresh,
}: WatchlistTableProps) {
  return (
    <section className="hidden overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 md:block">
      <table className="w-full table-fixed text-left text-sm">
        <thead className="border-b border-zinc-800 bg-zinc-900/70 text-xs uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="w-[22%] px-4 py-3 font-medium">Card</th>
            <th className="w-[18%] px-4 py-3 font-medium">Printing</th>
            <th className="w-[10%] px-4 py-3 font-medium">Current</th>
            <th className="w-[10%] px-4 py-3 font-medium">Target</th>
            <th className="w-[12%] px-4 py-3 font-medium">Difference</th>
            <th className="w-[9%] px-4 py-3 font-medium">Trend</th>
            <th className="w-[11%] px-4 py-3 font-medium">Last Updated</th>
            <th className="w-[13%] px-4 py-3 font-medium">Status</th>
            <th className="w-[9%] px-4 py-3 font-medium">Refresh</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-900">
          {entries.map((entry) => {
            const isRefreshing = refreshingEntryId === entry.id;

            return (
              <tr key={entry.id} className="align-top">
                <td className="px-4 py-4">
                  <p className="font-medium text-white">{entry.assetIdentity.name}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {entry.assetIdentity.game} / {entry.finish} / {entry.condition} /{" "}
                    {entry.language}
                  </p>
                  {developerMode ? <DeveloperPanel entry={entry} /> : null}
                </td>
                <td className="px-4 py-4 text-zinc-300">
                  {entry.assetIdentity.printing}
                  <p className="mt-1 text-xs text-zinc-500">
                    {entry.assetIdentity.collectorNumber ?? "No collector number"}
                  </p>
                </td>
                <td className="px-4 py-4 font-medium text-white">
                  {formatCurrency(entry.currentValuation)}
                </td>
                <td className="px-4 py-4 text-zinc-300">
                  {formatCurrency(entry.targetPrice)}
                </td>
                <td className="px-4 py-4">
                  <p
                    className={
                      entry.difference !== null && entry.difference >= 0
                        ? "font-medium text-emerald-300"
                        : "font-medium text-zinc-300"
                    }
                  >
                    {formatCurrency(entry.difference)}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {entry.percentToTarget === null
                      ? "Unknown"
                      : `${entry.percentToTarget.toFixed(1)}% of target`}
                  </p>
                </td>
                <td className="px-4 py-4 text-zinc-300">{entry.marketTrend}</td>
                <td className="px-4 py-4 text-zinc-300">
                  {formatAge(entry.developerDiagnostics.observationAgeMs)}
                  <p className="mt-1 text-xs text-zinc-500">
                    {entry.observationSource}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <StatusLabel status={entry.marketStatus} />
                  <p className="mt-2 text-xs text-zinc-500">
                    {entry.refreshStatus}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <button
                    className="rounded-md border border-cyan-400/40 px-3 py-2 text-xs font-medium text-cyan-200 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isRefreshing}
                    onClick={() => onRefresh(entry)}
                    type="button"
                  >
                    {isRefreshing ? "Refreshing" : "Refresh"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
