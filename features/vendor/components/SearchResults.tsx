import type { Card } from "@/types/card";

type SearchResultsProps = {
  cards: Card[];
  selectedCardId: string;
  onSelectCard: (card: Card) => void;
};

export default function SearchResults({
  cards,
  selectedCardId,
  onSelectCard,
}: SearchResultsProps) {
  return (
    <div
      role="listbox"
      aria-label="Card search results"
      className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
    >
      {cards.length > 0 ? (
        cards.map((card) => (
          <button
            key={card.id}
            type="button"
            role="option"
            aria-selected={card.id === selectedCardId}
            onClick={() => onSelectCard(card)}
            className={`flex w-full items-center justify-between gap-4 border-b border-zinc-800 px-4 py-3 text-left last:border-b-0 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-400 ${
              card.id === selectedCardId
                ? "bg-cyan-400 text-zinc-950"
                : "bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
            }`}
          >
            <span>
              <span className="block text-sm font-semibold">{card.name}</span>
              <span className="mt-1 block text-xs opacity-75">
                {card.game} / {card.set} / {card.finish}
              </span>
            </span>
            <span className="text-xs opacity-70">{card.rarity}</span>
          </button>
        ))
      ) : (
        <p className="px-4 py-5 text-sm text-zinc-400">No cards found.</p>
      )}
    </div>
  );
}
