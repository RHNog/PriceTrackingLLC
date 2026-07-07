"use client";

import { useEffect, useRef } from "react";
import SearchResults from "@/features/vendor/components/SearchResults";
import type { Card } from "@/types/card";

type CardSearchPaletteProps = {
  query: string;
  results: Card[];
  selectedCardId: string;
  onQueryChange: (query: string) => void;
  onSelectCard: (card: Card) => void;
};

export default function CardSearchPalette({
  query,
  results,
  selectedCardId,
  onQueryChange,
  onSelectCard,
}: CardSearchPaletteProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  return (
    <section className="space-y-3">
      {/* TODO: Barcode scanning, OCR, camera recognition, keyboard navigation, and voice input. */}
      <input
        ref={searchInputRef}
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search cards..."
        aria-label="Search cards"
        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-5 py-4 text-lg text-zinc-100 shadow-lg shadow-black/10 outline-none placeholder:text-zinc-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
      />

      <SearchResults
        cards={results}
        selectedCardId={selectedCardId}
        onSelectCard={onSelectCard}
      />
    </section>
  );
}
