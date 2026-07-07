export default function WatchlistHeader() {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {/* Page title and short workspace description. */}
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          Watchlists
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Monitor buying opportunities across multiple strategies.
        </p>
      </div>

      <div className="flex flex-col items-start gap-3 sm:items-end">
        <button
          type="button"
          className="rounded-md bg-cyan-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
        >
          + New Watchlist
        </button>
        <p className="max-w-sm text-sm leading-6 text-zinc-500 sm:text-right">
          System watchlists are maintained automatically. Manual watchlists
          allow you to organize cards you personally want to monitor.
        </p>
      </div>
    </header>
  );
}
