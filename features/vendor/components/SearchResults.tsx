import CardImage from "@/components/ui/CardImage";
import type { CardIdentity } from "@/types/cardIdentity";
import type { SearchResult } from "@/types/searchResult";

type SearchResultsProps = {
  results: SearchResult<CardIdentity>[];
  selectedCardId: string;
  onSelectCard: (identity: CardIdentity) => void;
};

export default function SearchResults({
  results,
  selectedCardId,
  onSelectCard,
}: SearchResultsProps) {
  return (
    <div
      role="listbox"
      aria-label="Card search results"
      className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
    >
      {results.length > 0 ? (
        results.map((result) => (
          <button
            key={result.item.id}
            type="button"
            role="option"
            aria-selected={result.item.id === selectedCardId}
            onClick={() => onSelectCard(result.item)}
            className={`flex w-full items-center justify-between gap-4 border-b border-zinc-800 px-4 py-3 text-left last:border-b-0 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-400 ${
              result.item.id === selectedCardId
                ? "bg-cyan-400 text-zinc-950"
                : "bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
            }`}
          >
            {result.item.printings[0] ? (
              <CardImage
                card={result.item.printings[0]}
                detail={`${result.item.printings[0].set} ${result.item.printings[0].finish}`}
                size="identity"
              />
            ) : null}
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{result.item.name}</span>
              <span className="mt-1 block text-xs opacity-75">
                {result.item.game} / {result.item.printings.length} printings
              </span>
            </span>
            <span className="text-xs opacity-70">
              Score {result.score}
            </span>
          </button>
        ))
      ) : (
        <p className="px-4 py-5 text-sm text-zinc-400">No cards found.</p>
      )}
    </div>
  );
}
