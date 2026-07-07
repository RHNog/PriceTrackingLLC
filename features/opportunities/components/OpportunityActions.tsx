import Link from "next/link";

export default function OpportunityActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/"
        className="rounded-md border border-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-900"
      >
        Back to Hot Opportunities
      </Link>
      <button
        type="button"
        className="rounded-md bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-100"
      >
        Review Opportunity
      </button>
    </div>
  );
}
