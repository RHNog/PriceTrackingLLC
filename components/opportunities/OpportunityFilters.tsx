export default function OpportunityFilters() {
  return (
    <div className="grid gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4 md:grid-cols-2 xl:grid-cols-5">
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
