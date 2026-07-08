"use client";

import { useMemo, useState } from "react";
import PurchaseEvaluationResult from "@/features/evaluation/components/PurchaseEvaluationResult";
import {
  evaluatePurchase,
  type PurchaseEvaluation,
} from "@/lib/engines/evaluation/evaluatePurchase";
import type { Card } from "@/types/card";
import type { Listing } from "@/types/listing";
import type { MarketPrice } from "@/types/marketPrice";
import type { PrintingVariant } from "@/types/printingVariant";
import type { Strategy } from "@/types/strategy";
import type { StrategyProfile } from "@/types/strategyProfile";

type PurchaseEvaluationFormProps = {
  cards: Card[];
  marketListings: Listing[];
  strategies: Strategy[];
  strategyProfiles: StrategyProfile[];
  defaultStrategyId: string;
};

function findById<T extends { id: string }>(items: T[], id: string) {
  return items.find((item) => item.id === id);
}

function findMarketListingForCard(listings: Listing[], cardId: string) {
  return listings
    .filter((listing) => listing.cardId === cardId)
    .sort((first, second) => second.price - first.price)[0];
}

function toManualMarketPrice(listing: Listing): MarketPrice {
  return {
    id: `manual-market-price:${listing.id}`,
    cardId: listing.cardId,
    printingId: listing.cardId,
    variantId: `${listing.cardId}:manual`,
    providerId: listing.marketplaceId,
    source: "Mock market estimate",
    currency: "USD",
    finish: "Unknown",
    price: listing.price,
    priceType: "manual",
    updatedAt: listing.updatedAt,
    confidence: 50,
  };
}

function toManualVariant(card: Card): PrintingVariant {
  return {
    id: `${card.id}:manual`,
    printingId: card.id,
    finish: card.finish,
    imageUrls: card.imageUrls,
    isAvailable: true,
    source: "Manual",
  };
}

export default function PurchaseEvaluationForm({
  cards,
  marketListings,
  strategies,
  strategyProfiles,
  defaultStrategyId,
}: PurchaseEvaluationFormProps) {
  const [cardId, setCardId] = useState(cards[0]?.id ?? "");
  const [purchasePrice, setPurchasePrice] = useState("650");
  const [strategyId, setStrategyId] = useState(defaultStrategyId);
  const [evaluation, setEvaluation] = useState<PurchaseEvaluation | null>(null);

  const selectedCard = useMemo(() => findById(cards, cardId), [cardId, cards]);
  const selectedStrategy = useMemo(
    () => findById(strategies, strategyId) ?? strategies[0],
    [strategyId, strategies],
  );
  const selectedProfile = useMemo(
    () =>
      selectedStrategy
        ? findById(strategyProfiles, selectedStrategy.profileId)
        : undefined,
    [selectedStrategy, strategyProfiles],
  );
  const currentMarketListing = useMemo(
    () => findMarketListingForCard(marketListings, cardId),
    [cardId, marketListings],
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedCard || !currentMarketListing || !selectedProfile) {
      return;
    }

    setEvaluation(
      evaluatePurchase({
        card: selectedCard,
        marketPrice: toManualMarketPrice(currentMarketListing),
        purchasePrice: Number(purchasePrice),
        selectedVariant: toManualVariant(selectedCard),
        strategyProfile: selectedProfile,
      }),
    );
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-lg shadow-black/10"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2">
            <span className="block text-sm font-medium text-zinc-300">Card</span>
            <select
              value={cardId}
              onChange={(event) => setCardId(event.target.value)}
              className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
            >
              {cards.map((card) => (
                <option key={card.id} value={card.id}>
                  {card.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="block text-sm font-medium text-zinc-300">
              Purchase Price
            </span>
            <input
              type="number"
              min="0"
              step="1"
              value={purchasePrice}
              onChange={(event) => setPurchasePrice(event.target.value)}
              className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
            />
          </label>

          <label className="space-y-2">
            <span className="block text-sm font-medium text-zinc-300">
              Buying Strategy
            </span>
            <select
              value={strategyId}
              onChange={(event) => setStrategyId(event.target.value)}
              className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
            >
              {strategies.map((strategy) => (
                <option key={strategy.id} value={strategy.id}>
                  {strategy.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="submit"
          className="mt-6 rounded-md bg-cyan-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          Evaluate
        </button>
      </form>

      {evaluation ? <PurchaseEvaluationResult evaluation={evaluation} /> : null}
    </div>
  );
}
