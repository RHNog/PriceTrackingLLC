"use client";

import { useEffect, useMemo, useState } from "react";
import WatchlistCard from "@/features/watchlist/WatchlistCard";
import {
  loadWatchlistEntries,
  saveWatchlistEntries,
  updateWatchlistEntry,
} from "@/features/watchlist/WatchlistStorage";
import WatchlistTable from "@/features/watchlist/WatchlistTable";
import WatchlistToolbar from "@/features/watchlist/WatchlistToolbar";
import {
  refreshWatchlistEntry,
  type WatchlistEntry,
} from "@/features/watchlist/WatchlistRefreshEngine";

export default function WatchlistWorkspace() {
  const [developerMode, setDeveloperMode] = useState(false);
  const [entries, setEntries] = useState<WatchlistEntry[]>([]);
  const [refreshingEntryId, setRefreshingEntryId] = useState<string | null>(null);
  const [providerRequestsUsed, setProviderRequestsUsed] = useState(0);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setEntries(loadWatchlistEntries());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const sortedEntries = useMemo(
    () =>
      [...entries].sort((first, second) => {
        const priorityOrder = {
          Highest: 0,
          High: 1,
          Medium: 2,
          Low: 3,
          Lowest: 4,
        };

        return (
          priorityOrder[first.refreshPriority] -
          priorityOrder[second.refreshPriority]
        );
      }),
    [entries],
  );

  async function handleRefresh(entry: WatchlistEntry) {
    setRefreshingEntryId(entry.id);

    const refreshed = await refreshWatchlistEntry({
      budget: {
        providerRequestsAvailable: 100,
        providerRequestsUsed,
      },
      entry,
      manual: true,
    });
    const nextEntries = updateWatchlistEntry(entries, refreshed);

    if (refreshed.developerDiagnostics.providerHit) {
      setProviderRequestsUsed((current) => current + 1);
    }

    setEntries(nextEntries);
    saveWatchlistEntries(nextEntries);
    setRefreshingEntryId(null);
  }

  return (
    <div className="w-full space-y-5">
      <WatchlistToolbar
        developerMode={developerMode}
        entries={entries}
        onDeveloperModeChange={setDeveloperMode}
        providerRequestsUsed={providerRequestsUsed}
      />

      <WatchlistTable
        developerMode={developerMode}
        entries={sortedEntries}
        onRefresh={handleRefresh}
        refreshingEntryId={refreshingEntryId}
      />

      <section className="space-y-3 md:hidden">
        {sortedEntries.map((entry) => (
          <WatchlistCard
            developerMode={developerMode}
            entry={entry}
            isRefreshing={refreshingEntryId === entry.id}
            key={entry.id}
            onRefresh={handleRefresh}
          />
        ))}
      </section>
    </div>
  );
}
