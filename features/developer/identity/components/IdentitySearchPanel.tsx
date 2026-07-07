type IdentitySearchPanelProps = {
  query: string;
};

export default function IdentitySearchPanel({ query }: IdentitySearchPanelProps) {
  return (
    <form className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <label className="space-y-2">
        <span className="block text-sm font-medium text-zinc-300">
          Identity Search
        </span>
        <input
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Search any Magic card..."
          className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
        />
      </label>
    </form>
  );
}
