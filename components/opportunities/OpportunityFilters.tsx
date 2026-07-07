import type { Strategy } from "@/types/strategy";

type OpportunityFiltersProps = {
  strategies: Strategy[];
  selectedStrategyId: string;
  onStrategyChange: (strategyId: string) => void;
};

export default function OpportunityFilters({
  strategies,
  selectedStrategyId,
  onStrategyChange,
}: OpportunityFiltersProps) {
  return (
    <div className="grid gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4 md:grid-cols-2 xl:grid-cols-6">
      <label className="space-y-1">
        <span className="block text-xs font-medium text-zinc-400">
          Buying Strategy
        </span>
        <select
          value={selectedStrategyId}
          onChange={(event) => onStrategyChange(event.target.value)}
          className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
        >
          {strategies.map((strategy) => (
            <option key={strategy.id} value={strategy.id}>
              {strategy.name}
            </option>
          ))}
        </select>
      </label>

      <input
        type="search"
        placeholder="Search"
        aria-label="Search opportunities"
        className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
      />

      <select
        aria-label="Game"
        defaultValue=""
        className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
      >
        <option value="">Game</option>
      </select>

      <select
        aria-label="Watchlist"
        defaultValue=""
        className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
      >
        <option value="">Watchlist</option>
      </select>

      <input
        type="number"
        placeholder="Minimum ROI"
        aria-label="Minimum ROI"
        className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
      />

      <select
        aria-label="Sort By"
        defaultValue="opportunity-score"
        className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
      >
        <option value="opportunity-score">Sort By: Opportunity Score</option>
      </select>
    </div>
  );
}
