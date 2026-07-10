import type { WatchlistObservationSource } from "@/features/watchlist/WatchlistRefreshEngine";

export type WatchObservation = {
  observedAt: string;
  source: WatchlistObservationSource;
  valuation: number;
};

export type WatchHistoryMetadata = {
  addedAt: string;
  initialMarketValuation: number | null;
  initialObservationSource: WatchlistObservationSource;
  lastSuccessfulRefresh: string | null;
  observations: WatchObservation[];
  reasonAdded?: string;
  refreshSource: WatchlistObservationSource;
};

export type WatchMarketChange = {
  difference: number | null;
  percentChange: number | null;
};

export type WatchMovement = "Rising" | "Falling" | "Volatile" | "Stable" | "No Data";

const maximumWatchObservations = 32;

function validTimestamp(value?: string | null) {
  if (!value) return undefined;
  return Number.isNaN(new Date(value).getTime()) ? undefined : value;
}

export function createWatchHistory(input: {
  addedAt?: string | null;
  currentValuation: number | null;
  lastRefresh?: string | null;
  observationSource: WatchlistObservationSource;
  reasonAdded?: string;
}): WatchHistoryMetadata {
  const addedAt = validTimestamp(input.addedAt) ?? new Date().toISOString();
  const hasValuation = input.currentValuation !== null;
  const source = hasValuation ? input.observationSource : "Unavailable";

  return {
    addedAt,
    initialMarketValuation: input.currentValuation,
    initialObservationSource: source,
    lastSuccessfulRefresh: hasValuation ? validTimestamp(input.lastRefresh) ?? addedAt : null,
    observations: hasValuation
      ? [{ observedAt: addedAt, source, valuation: input.currentValuation! }]
      : [],
    reasonAdded: input.reasonAdded?.trim() || undefined,
    refreshSource: source,
  };
}

export function ensureWatchHistory(
  history: WatchHistoryMetadata | undefined,
  input: Parameters<typeof createWatchHistory>[0],
) {
  if (!history) return createWatchHistory(input);
  return {
    ...history,
    addedAt: validTimestamp(history.addedAt) ?? createWatchHistory(input).addedAt,
    observations: (history.observations ?? []).slice(-maximumWatchObservations),
  };
}

export function appendSuccessfulWatchObservation(
  history: WatchHistoryMetadata,
  observation: WatchObservation,
) {
  const last = history.observations.at(-1);
  const observations =
    last?.observedAt === observation.observedAt &&
    last.valuation === observation.valuation
      ? history.observations
      : [...history.observations, observation].slice(-maximumWatchObservations);

  return {
    ...history,
    lastSuccessfulRefresh: observation.observedAt,
    observations,
    refreshSource: observation.source,
  };
}

export function calculateWatchMarketChange(
  initialMarketValuation: number | null,
  currentValuation: number | null,
): WatchMarketChange {
  if (initialMarketValuation === null || currentValuation === null) {
    return { difference: null, percentChange: null };
  }
  const difference = currentValuation - initialMarketValuation;
  return {
    difference,
    percentChange:
      initialMarketValuation === 0
        ? null
        : (difference / initialMarketValuation) * 100,
  };
}

export function classifyWatchMovement(observations: WatchObservation[]): WatchMovement {
  if (observations.length === 0) return "No Data";
  if (observations.length === 1) return "Stable";

  const values = observations.map((observation) => observation.valuation);
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const directions = values.slice(1).map((value, index) => Math.sign(value - values[index]));
  const directionChanges = directions.slice(1).filter(
    (direction, index) =>
      direction !== 0 && directions[index] !== 0 && direction !== directions[index],
  ).length;

  if (directionChanges >= 2 && average > 0 && (maximum - minimum) / average >= 0.08) {
    return "Volatile";
  }

  const first = values[0];
  const last = values.at(-1)!;
  const percent = first === 0 ? 0 : ((last - first) / first) * 100;
  if (percent > 1) return "Rising";
  if (percent < -1) return "Falling";
  return "Stable";
}

export function formatWatchingDuration(addedAt: string, now = Date.now()) {
  const added = new Date(addedAt).getTime();
  if (Number.isNaN(added)) return "No Data";
  const milliseconds = Math.max(0, now - added);
  const days = Math.floor(milliseconds / 86_400_000);
  if (days >= 60) {
    const months = Math.floor(days / 30);
    return `${months} ${months === 1 ? "month" : "months"}`;
  }
  if (days >= 1) return `${days} ${days === 1 ? "day" : "days"}`;
  const hours = Math.max(1, Math.floor(milliseconds / 3_600_000));
  return `${hours} ${hours === 1 ? "hour" : "hours"}`;
}
