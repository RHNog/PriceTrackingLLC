"use client";

import { Fragment, useState } from "react";
import CardThumbnail from "@/components/cards/CardThumbnail";
import CardIdentityFacts from "@/components/cards/CardIdentityFacts";
import CapabilityCard from "@/components/ui/CapabilityCard";
import {
  DeveloperPanel,
  StatusLabel,
  formatAge,
  createWatchlistPresentation,
  formatMarketValue,
  formatTarget,
  formatTrend,
} from "@/features/watchlist/WatchlistCard";
import WatchlistEntryMenu from "@/features/watchlist/WatchlistEntryMenu";
import WatchDetails from "@/features/watchlist/WatchDetails";
import WatchSparkline from "@/features/watchlist/WatchSparkline";
import type { WatchlistEntry } from "@/features/watchlist/WatchlistRefreshEngine";
import { resolveCapability, resolveGameCapabilities } from "@/lib/capabilities/PlatformCapabilityResolver";

type WatchlistTableProps = {
  developerMode: boolean;
  entries: WatchlistEntry[];
  refreshingEntryId: string | null;
  onEdit: (entry: WatchlistEntry) => void;
  onRefresh: (entry: WatchlistEntry) => void;
  onRemove: (entry: WatchlistEntry) => void;
};

export default function WatchlistTable({
  developerMode,
  entries,
  refreshingEntryId,
  onEdit,
  onRefresh,
  onRemove,
}: WatchlistTableProps) {
  const [expandedEntryKey, setExpandedEntryKey] = useState<string>();
  return (
    <section className="hidden overflow-visible rounded-lg border border-zinc-800 bg-zinc-950 md:block">
      <table className="w-full table-fixed text-left text-sm">
        <thead className="border-b border-zinc-800 bg-zinc-900/70 text-xs uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="w-[24%] px-4 py-3 font-medium">Card</th>
            <th className="w-[17%] px-4 py-3 font-medium">Printing</th>
            <th className="w-[11%] px-4 py-3 font-medium">Current</th>
            <th className="w-[9%] px-4 py-3 font-medium">Target</th>
            <th className="w-[11%] px-4 py-3 font-medium">Difference</th>
            <th className="w-[9%] px-4 py-3 font-medium">Trend</th>
            <th className="w-[10%] px-4 py-3 font-medium">Last Updated</th>
            <th className="w-[12%] px-4 py-3 font-medium">Status</th>
            <th className="w-[9%] px-4 py-3 font-medium">Refresh</th>
            <th className="w-10 px-2 py-3 font-medium"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-900">
          {entries.map((entry) => {
            const isRefreshing = refreshingEntryId === entry.id;
            const marketCapability = resolveCapability(entry.assetIdentity.game, "marketData");
            const capabilities = resolveGameCapabilities(entry.assetIdentity.game).capabilities.filter(
              (capability) => ["identity", "artwork", "marketData"].includes(capability.id),
            );
            const entryKey = `${entry.watchlistId}:${entry.id}`;
            const expanded = expandedEntryKey === entryKey;
            const presentation = createWatchlistPresentation(entry);

            return (
              <Fragment key={entryKey}>
              <tr className="group align-top">
                <td className="px-4 py-4">
                  <div className="flex gap-3">
                    <CardThumbnail
                      alt={`${entry.assetIdentity.name}, ${entry.assetIdentity.printing}`}
                      assetKey={entry.assetIdentity.variantId}
                      candidates={entry.assetIdentity.image ? [entry.assetIdentity.image] : []}
                      className="w-14"
                      developerMode={developerMode}
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-white">{entry.assetIdentity.name}</p>
                      <p className="mt-1 text-xs capitalize text-zinc-500">{entry.assetIdentity.game}</p>
                      {entry.notes ? <p className="mt-2 line-clamp-2 text-xs text-zinc-500">{entry.notes}</p> : null}
                    </div>
                  </div>
                  {developerMode ? <DeveloperPanel entry={entry} /> : null}
                  {marketCapability.status !== "Operational" ? (
                    <div className="mt-3">
                      <CapabilityCard capabilities={capabilities} compact developerMode={developerMode} />
                    </div>
                  ) : null}
                </td>
                <td className="px-4 py-4 text-zinc-300">
                  {entry.assetIdentity.printing}
                  <p className="mt-1 text-xs text-zinc-500">
                    #{entry.assetIdentity.collectorNumber ?? "No collector number"}
                  </p>
                  <CardIdentityFacts className="text-xs text-zinc-500" layout="stacked" presentation={presentation} />
                </td>
                <td className={`px-4 py-4 font-medium ${marketCapability.status === "Operational" ? "text-white" : "text-xs text-amber-200"}`}>
                  {formatMarketValue(entry, entry.currentValuation)}
                </td>
                <td className="px-4 py-4 text-zinc-300">{formatTarget(entry)}</td>
                <td className="px-4 py-4">
                  <p className={entry.difference !== null && entry.difference >= 0 ? "font-medium text-emerald-300" : "font-medium text-zinc-300"}>
                    {formatMarketValue(entry, entry.difference)}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {marketCapability.status !== "Operational"
                      ? "Market data required"
                      : entry.percentToTarget === null
                        ? "No Data"
                        : `${entry.percentToTarget.toFixed(1)}% of target`}
                  </p>
                </td>
                <td className="px-4 py-4 text-zinc-300">
                  <p>{formatTrend(entry)}</p>
                  {marketCapability.status === "Operational" && entry.watchHistory ? (
                    <div className="mt-2"><WatchSparkline observations={entry.watchHistory.observations} /></div>
                  ) : null}
                </td>
                <td className="px-4 py-4 text-zinc-300">
                  {marketCapability.status === "Operational" ? formatAge(entry.developerDiagnostics.observationAgeMs) : "Not Yet Connected"}
                  <p className="mt-1 text-xs text-zinc-500">{marketCapability.status === "Operational" ? entry.observationSource : "No Provider"}</p>
                </td>
                <td className="px-4 py-4">
                  <StatusLabel status={entry.marketStatus} />
                  <p className="mt-2 text-xs text-zinc-500">{marketCapability.status === "Operational" ? entry.refreshStatus : marketCapability.resolution}</p>
                </td>
                <td className="px-4 py-4">
                  <button
                    className="rounded-md border border-cyan-400/40 px-3 py-2 text-xs font-medium text-cyan-200 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isRefreshing || marketCapability.status !== "Operational"}
                    onClick={() => onRefresh(entry)}
                    title={marketCapability.status === "Operational" ? "Refresh market data" : marketCapability.reason}
                    type="button"
                  >
                    {marketCapability.status !== "Operational" ? "Coming Soon" : isRefreshing ? "Refreshing" : "Refresh"}
                  </button>
                </td>
                <td className="px-2 py-4 opacity-40 transition group-hover:opacity-100 focus-within:opacity-100">
                  <div className="flex flex-col items-center gap-1">
                    <button
                      aria-expanded={expanded}
                      aria-label={`${expanded ? "Collapse" : "Expand"} watch details for ${entry.assetIdentity.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-900 hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                      onClick={() => setExpandedEntryKey(expanded ? undefined : entryKey)}
                      type="button"
                    >
                      {expanded ? "⌃" : "⌄"}
                    </button>
                    <WatchlistEntryMenu entry={entry} onEdit={onEdit} onRemove={onRemove} />
                  </div>
                </td>
              </tr>
              {expanded ? (
                <tr>
                  <td className="border-t border-zinc-900 px-4 py-4" colSpan={10}>
                    <WatchDetails entry={entry} />
                  </td>
                </tr>
              ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
