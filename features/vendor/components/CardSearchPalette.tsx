"use client";

import { useEffect, useRef } from "react";
import SearchResults from "@/features/vendor/components/SearchResults";
import type { CardIdentity } from "@/types/cardIdentity";
import type { SearchResult } from "@/types/searchResult";

type CardSearchPaletteProps = {
  interpretationSummary?: string[];
  query: string;
  results: SearchResult<CardIdentity>[];
  selectedCardId: string;
  onQueryChange: (query: string) => void;
  onSelectCard: (identity: CardIdentity) => void;
};

export default function CardSearchPalette({
  interpretationSummary = [],
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

      {interpretationSummary.length > 0 ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-300">
          {interpretationSummary.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      ) : null}

      <SearchResults
        results={results}
        selectedCardId={selectedCardId}
        onSelectCard={onSelectCard}
      />
    </section>
  );
}
