"use client";

import CardThumbnail from "@/components/cards/CardThumbnail";
import CardIdentityFacts from "@/components/cards/CardIdentityFacts";
import CapabilityCard from "@/components/ui/CapabilityCard";
import WatchlistEntryMenu from "@/features/watchlist/WatchlistEntryMenu";
import WatchDetails from "@/features/watchlist/WatchDetails";
import type { WatchlistEntry } from "@/features/watchlist/WatchlistRefreshEngine";
import { resolveCapability, resolveGameCapabilities } from "@/lib/capabilities/PlatformCapabilityResolver";
import { adaptIdentityPresentation } from "@/lib/engines/identity/IdentityPresentationAdapter";
import { createIdentityPresentationDiagnostics } from "@/lib/engines/identity/IdentityPresentationDiagnostics";

type WatchlistCardProps = {
  developerMode: boolean;
  entry: WatchlistEntry;
  isRefreshing: boolean;
  onRefresh: (entry: WatchlistEntry) => void;
  onEdit: (entry: WatchlistEntry) => void;
  onRemove: (entry: WatchlistEntry) => void;
};

const statusStyles: Record<string, string> = {
  "Above Target": "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  "Approaching Target": "border-amber-400/30 bg-amber-400/10 text-amber-300",
  "Recently Refreshed": "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
  "Refresh Recommended": "border-orange-400/30 bg-orange-400/10 text-orange-300",
  "Market Data Pending": "border-amber-400/30 bg-amber-400/10 text-amber-300",
  "Stale Observation": "border-red-400/30 bg-red-400/10 text-red-300",
  Waiting: "border-zinc-700 bg-zinc-900 text-zinc-300",
};

export default function WatchlistCard({
  developerMode,
  entry,
  isRefreshing,
  onRefresh,
  onEdit,
  onRemove,
}: WatchlistCardProps) {
  const marketCapability = resolveCapability(entry.assetIdentity.game, "marketData");
  const capabilities = resolveGameCapabilities(entry.assetIdentity.game).capabilities.filter(
    (capability) => ["identity", "artwork", "marketData"].includes(capability.id),
  );
  const presentation = createWatchlistPresentation(entry);
  return (
    <article className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 md:hidden">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <CardThumbnail
            alt={`${entry.assetIdentity.name}, ${entry.assetIdentity.printing}`}
            assetKey={entry.assetIdentity.variantId}
            candidates={entry.assetIdentity.image ? [entry.assetIdentity.image] : []}
            className="w-16"
            developerMode={developerMode}
          />
          <div>
          <h3 className="text-base font-semibold text-white">
            {entry.assetIdentity.name}
          </h3>
          <p className="mt-1 text-sm text-zinc-400">
            {entry.assetIdentity.printing}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {presentation.collectorNumber.presentationValue} / {entry.assetIdentity.game} / {presentation.language.presentationValue}
          </p>
          <CardIdentityFacts className="mt-1 block text-xs text-zinc-500" presentation={presentation} />
          </div>
        </div>
        <div className="flex items-start gap-1">
          <StatusLabel status={entry.marketStatus} />
          <WatchlistEntryMenu entry={entry} onEdit={onEdit} onRemove={onRemove} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <Metric label="Current" value={formatMarketValue(entry, entry.currentValuation)} />
        <Metric label="Target" value={formatTarget(entry)} />
        <Metric label="Difference" value={formatMarketValue(entry, entry.difference)} />
        <Metric
          label="Target Reached"
          value={
            entry.percentToTarget === null
              ? "No Data"
              : `${entry.percentToTarget.toFixed(1)}%`
          }
        />
      </div>

      {developerMode ? <DeveloperPanel entry={entry} /> : null}

      <details className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
        <summary className="cursor-pointer text-sm font-medium text-zinc-300">Watch details</summary>
        <div className="mt-3"><WatchDetails entry={entry} /></div>
      </details>

      {marketCapability.status !== "Operational" ? (
        <div className="mt-4">
          <CapabilityCard capabilities={capabilities} compact developerMode={developerMode} />
          <p className="mt-2 text-xs leading-5 text-zinc-500">
            This game currently supports identity only. Market pricing will become available when a compatible market provider is connected.
          </p>
        </div>
      ) : null}

      <button
        className="mt-4 w-full rounded-md border border-cyan-400/40 px-3 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isRefreshing || marketCapability.status !== "Operational"}
        title={marketCapability.status === "Operational" ? "Refresh market data" : marketCapability.reason}
        onClick={() => onRefresh(entry)}
        type="button"
      >
        {marketCapability.status !== "Operational"
          ? "Market Data Coming Soon"
          : isRefreshing
            ? "Refreshing"
            : "Refresh"}
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
  const presentationDiagnostics = createIdentityPresentationDiagnostics(
    createWatchlistPresentation(entry),
  );

  return (
    <div className="mt-4 rounded-md border border-zinc-800 bg-zinc-900/70 p-3 text-xs text-zinc-400">
      <div className="grid grid-cols-2 gap-2">
        <p>Repository Hit: {diagnostics.repositoryHit ? "Yes" : "No"}</p>
        <p>Provider Hit: {diagnostics.providerHit ? "Yes" : "No"}</p>
        <p>Replay: {diagnostics.replay ? "Yes" : "No"}</p>
        <p>API Saved: {diagnostics.apiSaved ? "Yes" : "No"}</p>
        <p>Cache Age: {formatAge(diagnostics.cacheAgeMs)}</p>
        <p>Observation Age: {formatAge(diagnostics.observationAgeMs)}</p>
        <p>Gameplay Identity: {entry.assetIdentity.gameplayIdentityId ?? "Legacy record"}</p>
        <p>Printing Identity: {entry.assetIdentity.printingIdentityId ?? "Legacy record"}</p>
        <p>Physical Variant: {entry.assetIdentity.physicalVariantIdentityId ?? "Legacy record"}</p>
        <p>Market Identity: {entry.assetIdentity.marketIdentityId ?? "Not mapped"}</p>
      </div>
      {diagnostics.providerRequestJustification ? (
        <p className="mt-2 text-zinc-500">
          {diagnostics.providerRequestJustification}
        </p>
      ) : null}
      {diagnostics.errorMessage ? (
        <p className="mt-2 text-red-300">{diagnostics.errorMessage}</p>
      ) : null}
      <div className="mt-3 border-t border-zinc-800 pt-3">
        <p className="font-medium text-zinc-300">Presentation Translation</p>
        {presentationDiagnostics
          .filter((item) => ["Set", "Treatment", "Printing"].includes(item.presentationLabel))
          .map((item) => (
            <p className="mt-1" key={item.canonicalConcept}>
              {item.canonicalConcept} → {item.presentationLabel}: {item.canonicalValue} → {item.presentationValue} ({item.visible ? "visible" : item.visibilityReason})
            </p>
          ))}
      </div>
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
    return "No Data";
  }

  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 2,
    style: "currency",
  }).format(value);
}

export function formatTarget(entry: WatchlistEntry) {
  return entry.targetPrice > 0 ? formatCurrency(entry.targetPrice) : "Not Set";
}

export function formatMarketValue(entry: WatchlistEntry, value: number | null) {
  const capability = resolveCapability(entry.assetIdentity.game, "marketData");
  if (capability.status !== "Operational") return capability.resolution;
  return formatCurrency(value);
}

export function formatPrintingDesign(entry: WatchlistEntry) {
  return createWatchlistPresentation(entry).treatment.presentationValue;
}

export function formatPhysicalFinish(entry: WatchlistEntry) {
  return createWatchlistPresentation(entry).finish.presentationValue;
}

export function createWatchlistPresentation(entry: WatchlistEntry) {
  return adaptIdentityPresentation({
    artwork: entry.assetIdentity.image?.urls,
    cardName: entry.assetIdentity.name,
    collectorNumber: entry.assetIdentity.collectorNumber,
    condition: entry.condition,
    language: entry.language,
    market: entry.currentValuation === null ? null : formatCurrency(entry.currentValuation),
    physicalFinish: entry.physicalFinish,
    printingDesignFacets: entry.printingDesignFacets,
    setName: entry.assetIdentity.printing.replace(/\s+#.+$/, ""),
  });
}

export function formatTrend(entry: WatchlistEntry) {
  const capability = resolveCapability(entry.assetIdentity.game, "marketData");
  if (capability.status !== "Operational") return "Market Data Coming Soon";
  return entry.marketTrend === "Unknown" ? "No Data" : entry.marketTrend;
}

export function formatAge(value: number | null) {
  if (value === null) {
    return "No Data";
  }

  const minutes = Math.round(value / 60000);

  if (minutes < 60) {
    return `${minutes}m`;
  }

  return `${Math.round(minutes / 60)}h`;
}
