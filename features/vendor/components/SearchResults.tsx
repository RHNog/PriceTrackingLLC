import CardThumbnail from "@/components/cards/CardThumbnail";
import CardIdentityFacts from "@/components/cards/CardIdentityFacts";
import type { CardIdentity } from "@/types/cardIdentity";
import type { SearchResult } from "@/types/searchResult";
import { adaptCardPresentation } from "@/lib/engines/identity/IdentityPresentationAdapter";

type SearchResultsProps = {
  highlightedCardId: string;
  results: SearchResult<CardIdentity>[];
  selectedCardId: string;
  onSelectCard: (identity: CardIdentity) => void;
};

export default function SearchResults({
  highlightedCardId,
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
        results.map((result) => {
          const isHighlighted = result.item.id === highlightedCardId;
          const isSelected = result.item.id === selectedCardId;
          const presentation = adaptCardPresentation(result.item.printings[0]);

          return (
            <button
              key={result.item.id}
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => onSelectCard(result.item)}
              className={`flex w-full items-center justify-between gap-4 border-b border-zinc-800 px-4 py-3 text-left last:border-b-0 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-400 ${
                isSelected
                  ? "bg-cyan-400 text-zinc-950"
                  : isHighlighted
                    ? "bg-zinc-800 text-zinc-100"
                    : "bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
              }`}
            >
              {result.item.printings[0] ? (
                <CardThumbnail
                  alt={`${result.item.name}, ${result.item.printings[0].set}`}
                  assetKey={result.item.printings[0].id}
                  candidates={[{
                    source: "Provider",
                    urls: result.item.printings[0].imageUrls ?? { normal: result.item.printings[0].imageUrl },
                  }]}
                  className="w-12"
                  selected={isSelected}
                />
              ) : null}
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">
                  {result.item.name}
                </span>
                <span className="mt-1 block text-xs opacity-75">
                  {presentation.printing.presentationValue} / {presentation.language.presentationValue}
                </span>
                <CardIdentityFacts className="mt-1 block text-xs opacity-75" presentation={presentation} />
                <span className="mt-1 block text-[11px] font-medium uppercase tracking-wide opacity-70">
                  {isSelected
                    ? "Selected"
                    : isHighlighted
                      ? "Highlighted"
                      : "Suggested"}
                </span>
              </span>
              <span className="text-xs opacity-70">Score {result.score}</span>
            </button>
          );
        })
      ) : (
        <p className="px-4 py-5 text-sm text-zinc-400">No cards found.</p>
      )}
    </div>
  );
}
