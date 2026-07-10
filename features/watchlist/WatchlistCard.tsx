"use client";

import type { WatchlistEntry } from "@/features/watchlist/WatchlistRefreshEngine";

type WatchlistCardProps = {
  developerMode: boolean;
  entry: WatchlistEntry;
  isRefreshing: boolean;
  onRefresh: (entry: WatchlistEntry) => void;
};

const statusStyles: Record<string, string> = {
  "Above Target": "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  "Approaching Target": "border-amber-400/30 bg-amber-400/10 text-amber-300",
  "Recently Refreshed": "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
  "Refresh Recommended": "border-orange-400/30 bg-orange-400/10 text-orange-300",
  "Stale Observation": "border-red-400/30 bg-red-400/10 text-red-300",
  Waiting: "border-zinc-700 bg-zinc-900 text-zinc-300",
};

export default function WatchlistCard({
  developerMode,
  entry,
  isRefreshing,
  onRefresh,
}: WatchlistCardProps) {
  return (
    <article className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 md:hidden">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-white">
            {entry.assetIdentity.name}
          </h3>
          <p className="mt-1 text-sm text-zinc-400">
            {entry.assetIdentity.printing}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {entry.finish} / {entry.condition} / {entry.language}
          </p>
        </div>
        <StatusLabel status={entry.marketStatus} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <Metric label="Current" value={formatCurrency(entry.currentValuation)} />
        <Metric label="Target" value={formatCurrency(entry.targetPrice)} />
        <Metric label="Difference" value={formatCurrency(entry.difference)} />
        <Metric
          label="Target Reached"
          value={
            entry.percentToTarget === null
              ? "Unknown"
              : `${entry.percentToTarget.toFixed(1)}%`
          }
        />
      </div>

      {developerMode ? <DeveloperPanel entry={entry} /> : null}

      <button
        className="mt-4 w-full rounded-md border border-cyan-400/40 px-3 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isRefreshing}
        onClick={() => onRefresh(entry)}
        type="button"
      >
        {isRefreshing ? "Refreshing" : "Refresh"}
      </button>
    </article>
  );
}

export function StatusLabel({ status }: { status: string }) {
  return (
    <span
      className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${
        statusStyles[status] ?? statusStyles.Waiting
      }`}
    >
      {status}
    </span>
  );
}

export function DeveloperPanel({ entry }: { entry: WatchlistEntry }) {
  const diagnostics = entry.developerDiagnostics;

  return (
    <div className="mt-4 rounded-md border border-zinc-800 bg-zinc-900/70 p-3 text-xs text-zinc-400">
      <div className="grid grid-cols-2 gap-2">
        <p>Repository Hit: {diagnostics.repositoryHit ? "Yes" : "No"}</p>
        <p>Provider Hit: {diagnostics.providerHit ? "Yes" : "No"}</p>
        <p>Replay: {diagnostics.replay ? "Yes" : "No"}</p>
        <p>API Saved: {diagnostics.apiSaved ? "Yes" : "No"}</p>
        <p>Cache Age: {formatAge(diagnostics.cacheAgeMs)}</p>
        <p>Observation Age: {formatAge(diagnostics.observationAgeMs)}</p>
      </div>
      {diagnostics.providerRequestJustification ? (
        <p className="mt-2 text-zinc-500">
          {diagnostics.providerRequestJustification}
        </p>
      ) : null}
      {diagnostics.errorMessage ? (
        <p className="mt-2 text-red-300">{diagnostics.errorMessage}</p>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-zinc-900 px-3 py-2">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  );
}

export function formatCurrency(value: number | null) {
  if (value === null) {
    return "Unknown";
  }

  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 2,
    style: "currency",
  }).format(value);
}

export function formatAge(value: number | null) {
  if (value === null) {
    return "Unknown";
  }

  const minutes = Math.round(value / 60000);

  if (minutes < 60) {
    return `${minutes}m`;
  }

  return `${Math.round(minutes / 60)}h`;
}
