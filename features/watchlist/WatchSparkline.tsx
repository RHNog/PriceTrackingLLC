import {
  classifyWatchMovement,
  type WatchObservation,
} from "@/features/watchlist/WatchHistory";

export default function WatchSparkline({ observations }: { observations: WatchObservation[] }) {
  const movement = classifyWatchMovement(observations);
  if (observations.length === 0) {
    return <span className="text-xs text-zinc-500">No Data</span>;
  }

  const values = observations.map((observation) => observation.valuation);
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const range = maximum - minimum || 1;
  const points = values.map((value, index) => {
    const x = values.length === 1 ? 56 : (index / (values.length - 1)) * 108 + 2;
    const y = 26 - ((value - minimum) / range) * 22;
    return `${x},${y}`;
  });
  const color =
    movement === "Rising"
      ? "#6ee7b7"
      : movement === "Falling"
        ? "#fca5a5"
        : movement === "Volatile"
          ? "#fcd34d"
          : "#67e8f9";

  return (
    <div className="flex items-center gap-2">
      <svg aria-label={`${movement} price movement since watch began`} className="h-7 w-28" role="img" viewBox="0 0 112 28">
        {values.length > 1 ? (
          <polyline fill="none" points={points.join(" ")} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        ) : (
          <circle cx="56" cy="14" fill={color} r="2.5" />
        )}
      </svg>
      <span className="text-xs text-zinc-400">{movement}</span>
    </div>
  );
}
