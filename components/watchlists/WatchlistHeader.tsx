export default function WatchlistHeader() {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {/* Page title and short helper text. */}
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          Watchlists
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Manage your tracked card lists.
        </p>
      </div>

      <button
        type="button"
        className="rounded-md bg-cyan-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
      >
        + New Watchlist
      </button>
    </header>
  );
}
