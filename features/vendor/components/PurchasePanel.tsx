"use client";

import CardImage from "@/components/ui/CardImage";
import EvaluationSummary from "@/features/vendor/components/EvaluationSummary";
import {
  evaluatePurchase,
  type PurchaseEvaluation,
} from "@/lib/engines/evaluation/evaluatePurchase";
import type { Card } from "@/types/card";
import type { FormEvent } from "react";
import type { Listing } from "@/types/listing";
import type { PrintingVariant } from "@/types/printingVariant";
import type { Strategy } from "@/types/strategy";
import type { StrategyProfile } from "@/types/strategyProfile";

type PurchasePanelProps = {
  askingPrice: string;
  availableVariants: PrintingVariant[];
  card: Card;
  currentMarketListing?: Listing;
  lowestListing?: Listing;
  recentSale?: Listing;
  selectedStrategy?: Strategy;
  selectedStrategyProfile?: StrategyProfile;
  evaluation: PurchaseEvaluation | null;
  onAskingPriceChange: (price: string) => void;
  onEvaluationChange: (evaluation: PurchaseEvaluation) => void;
  onVariantChange: (variantId: string) => void;
  selectedVariant: PrintingVariant | null;
};

function formatCurrency(value?: number) {
  return typeof value === "number" ? `$${value.toLocaleString()}` : "Unavailable";
}

type MarketStatProps = { label: string; value?: number };

function MarketStat({ label, value }: MarketStatProps) {
  return (
    <div className="rounded-md bg-zinc-950/60 p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 font-semibold text-white">{formatCurrency(value)}</p>
    </div>
  );
}

export default function PurchasePanel({
  askingPrice,
  availableVariants,
  card,
  currentMarketListing,
  lowestListing,
  recentSale,
  selectedStrategy,
  selectedStrategyProfile,
  evaluation,
  onAskingPriceChange,
  onEvaluationChange,
  onVariantChange,
  selectedVariant,
}: PurchasePanelProps) {
  const canEvaluate = Boolean(
    currentMarketListing &&
    selectedStrategyProfile &&
    Number(askingPrice) > 0 &&
    selectedVariant,
  );
  const requiresFinishSelection = availableVariants.length > 1 && !selectedVariant;
  const marketStats = [
    {
      label: "Current Market Price",
      value: currentMarketListing?.price,
    },
    {
      label: "Lowest Listing",
      value: lowestListing?.price,
    },
    {
      label: "Recent Sale Price",
      value: recentSale?.price,
    },
  ];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentMarketListing || !selectedStrategyProfile || !selectedVariant) {
      return;
    }

    onEvaluationChange(
      evaluatePurchase({
        card,
        currentMarketListing,
        purchasePrice: Number(askingPrice),
        strategyProfile: selectedStrategyProfile,
      }),
    );
  }

  return (
    <section className="space-y-4">
      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 shadow-lg shadow-black/10"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row">
            <CardImage
              card={card}
              detail={`${card.set} ${card.finish}`}
              size="selected"
            />
            <div>
              <p className="text-xs text-zinc-500">Selected Card</p>
              <h3 className="mt-1 text-xl font-semibold text-white">{card.name}</h3>
              <p className="mt-1 text-sm text-zinc-400">
                {card.game} / {card.set} /{" "}
                {selectedVariant?.finish ?? card.finish}
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                #{card.number} / {card.language ?? "English"} /{" "}
                {card.treatment || "Standard"} / {card.releaseYear ?? "Unknown"}
              </p>
            </div>
          </div>
          <div className="rounded-md bg-zinc-950/60 px-3 py-2 text-left md:text-right">
            <p className="text-xs text-zinc-500">Current Buying Strategy</p>
            <p className="mt-1 text-sm font-medium text-cyan-300">
              {selectedStrategy?.name ?? "No strategy"}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 border-t border-zinc-800 pt-5 sm:grid-cols-3">
          {marketStats.map((stat) => (
            <MarketStat
              key={stat.label}
              label={stat.label}
              value={stat.value}
            />
          ))}
        </div>

        {availableVariants.length > 0 ? (
          <div className="mt-5 border-t border-zinc-800 pt-5">
            <p className="text-sm font-medium text-zinc-300">
              {requiresFinishSelection ? "Finish required" : "Selected Finish"}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {availableVariants.map((variant) => {
                const isSelected = variant.id === selectedVariant?.id;

                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => onVariantChange(variant.id)}
                    className={`rounded-md border px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                      isSelected
                        ? "border-cyan-400 bg-cyan-400 text-zinc-950"
                        : "border-zinc-700 bg-zinc-950 text-zinc-200 hover:border-zinc-500"
                    }`}
                  >
                    {variant.finish}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              {requiresFinishSelection
                ? "Choose Foil or Nonfoil before evaluation."
                : `✓ Finish: ${selectedVariant?.finish}`}
            </p>
          </div>
        ) : null}

        <div className="mt-5 flex flex-col gap-3 border-t border-zinc-800 pt-5 sm:flex-row">
          <label className="flex-1 space-y-2">
            <span className="block text-sm font-medium text-zinc-300">
              Current Asking Price
            </span>
            <input
              type="number"
              min="0"
              step="1"
              value={askingPrice}
              onChange={(event) => onAskingPriceChange(event.target.value)}
              className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
            />
          </label>
          <button
            type="submit"
            disabled={!canEvaluate}
            className="self-end rounded-md bg-cyan-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
          >
            Evaluate Purchase
          </button>
        </div>
      </form>

      {evaluation ? <EvaluationSummary askingPrice={Number(askingPrice)} evaluation={evaluation} /> : null}
    </section>
  );
}
