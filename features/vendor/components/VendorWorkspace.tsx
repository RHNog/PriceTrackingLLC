"use client";

import { useMemo, useState } from "react";
import CardSearchPalette from "@/features/vendor/components/CardSearchPalette";
import PurchasePanel from "@/features/vendor/components/PurchasePanel";
import type { PurchaseEvaluation } from "@/lib/engines/evaluation/evaluatePurchase";
import type { Card } from "@/types/card";
import type { Listing } from "@/types/listing";
import type { Strategy } from "@/types/strategy";
import type { StrategyProfile } from "@/types/strategyProfile";

export type VendorMarketSnapshot = {
  cardId: string;
  listings: Listing[];
  recentSales: Listing[];
};

type VendorWorkspaceProps = {
  cards: Card[];
  defaultStrategyId: string;
  marketSnapshots: VendorMarketSnapshot[];
  strategies: Strategy[];
  strategyProfiles: StrategyProfile[];
};

function findById<T extends { id: string }>(items: T[], id: string) {
  return items.find((item) => item.id === id);
}

function findMarketSnapshot(snapshots: VendorMarketSnapshot[], cardId: string) {
  return snapshots.find((snapshot) => snapshot.cardId === cardId);
}

function findHighestListing(listings: Listing[]) {
  return [...listings].sort((first, second) => second.price - first.price)[0];
}

function findLowestListing(listings: Listing[]) {
  return [...listings].sort((first, second) => first.price - second.price)[0];
}

function findRecentSale(snapshot?: VendorMarketSnapshot) {
  return snapshot?.recentSales[0] ?? findHighestListing(snapshot?.listings ?? []);
}

export default function VendorWorkspace({
  cards,
  defaultStrategyId,
  marketSnapshots,
  strategies,
  strategyProfiles,
}: VendorWorkspaceProps) {
  const [query, setQuery] = useState("");
  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id ?? "");
  const [askingPrice, setAskingPrice] = useState("");
  const [strategyId, setStrategyId] = useState(defaultStrategyId);
  const [evaluation, setEvaluation] = useState<PurchaseEvaluation | null>(null);

  const filteredCards = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return cards;
    }

    return cards.filter((card) =>
      `${card.name} ${card.game} ${card.set}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [cards, query]);
  const selectedCard = findById(cards, selectedCardId) ?? filteredCards[0];
  const selectedStrategy = findById(strategies, strategyId) ?? strategies[0];
  const selectedProfile = selectedStrategy
    ? findById(strategyProfiles, selectedStrategy.profileId)
    : undefined;
  const selectedSnapshot = selectedCard
    ? findMarketSnapshot(marketSnapshots, selectedCard.id)
    : undefined;
  const currentMarketListing = findHighestListing(
    selectedSnapshot?.listings ?? [],
  );
  const lowestListing = findLowestListing(selectedSnapshot?.listings ?? []);
  const recentSale = findRecentSale(selectedSnapshot);

  function handleSelectCard(card: Card) {
    const snapshot = findMarketSnapshot(marketSnapshots, card.id);
    const lowestPrice = findLowestListing(snapshot?.listings ?? [])?.price;

    setSelectedCardId(card.id);
    setAskingPrice(lowestPrice ? String(lowestPrice) : "");
    setEvaluation(null);
  }

  function handleStrategyChange(nextStrategyId: string) {
    setStrategyId(nextStrategyId);
    setEvaluation(null);
  }

  return (
    <div className="space-y-6">
      <CardSearchPalette
        query={query}
        results={filteredCards}
        selectedCardId={selectedCard?.id ?? ""}
        onQueryChange={setQuery}
        onSelectCard={handleSelectCard}
      />

      <label className="block max-w-xs space-y-2">
        <span className="block text-sm font-medium text-zinc-300">
          Buying Strategy
        </span>
        <select
          value={strategyId}
          onChange={(event) => handleStrategyChange(event.target.value)}
          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
        >
          {strategies.map((strategy) => (
            <option key={strategy.id} value={strategy.id}>
              {strategy.name}
            </option>
          ))}
        </select>
      </label>

      {selectedCard ? (
        <PurchasePanel
          askingPrice={askingPrice}
          card={selectedCard}
          currentMarketListing={currentMarketListing}
          lowestListing={lowestListing}
          recentSale={recentSale}
          selectedStrategy={selectedStrategy}
          selectedStrategyProfile={selectedProfile}
          evaluation={evaluation}
          onAskingPriceChange={setAskingPrice}
          onEvaluationChange={setEvaluation}
        />
      ) : null}
    </div>
  );
}
