export default function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6">
      {/* Search input placeholder for future market search. */}
      <div className="w-full max-w-md">
        <label htmlFor="app-search" className="sr-only">
          Search
        </label>
        <input
          id="app-search"
          type="search"
          placeholder="Search cards, sets, or watchlists"
          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
        />
      </div>

      {/* Simple avatar placeholder until user accounts are added. */}
      <button
        type="button"
        aria-label="User menu"
        className="ml-4 flex h-10 w-10 flex-none items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold text-zinc-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
      >
        PT
      </button>
    </header>
  );
}
