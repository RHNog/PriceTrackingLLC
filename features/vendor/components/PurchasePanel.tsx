"use client";

import CardImage from "@/components/ui/CardImage";
import CardProfilePanel from "@/features/vendor/components/CardProfilePanel";
import EvaluationSummary from "@/features/vendor/components/EvaluationSummary";
import type { BusinessProfile } from "@/lib/business/BusinessProfileEngine";
import { createCardProfile } from "@/lib/engines/cardIntelligence/CardIntelligenceEngine";
import { evaluatePurchase } from "@/lib/engines/evaluation/evaluatePurchase";
import { createConditionMarketSnapshot } from "@/lib/engines/market/createConditionMarketSnapshot";
import { evaluationHistoryEngine } from "@/lib/history/EvaluationHistoryEngine";
import { createMarketSnapshotId } from "@/lib/workflow/AssetContextValidator";
import type { AssetContext } from "@/types/AssetContext";
import type { Card } from "@/types/card";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  conditionProfiles,
  findConditionProfile,
  type CardConditionCode,
} from "@/types/conditionProfile";
import { defaultMarketContext } from "@/types/MarketContext";
import type { MarketPrice } from "@/types/marketPrice";
import type { MarketSnapshot } from "@/types/marketSnapshot";
import type { PrintingVariant } from "@/types/printingVariant";
import type { Strategy } from "@/types/strategy";
import type { StrategyProfile } from "@/types/strategyProfile";

type PurchasePanelProps = {
  askingPrice: string;
  assetContext: AssetContext;
  availableVariants: PrintingVariant[];
  card: Card;
  isMarketLoading: boolean;
  marketPrice?: MarketPrice;
  marketSnapshot?: MarketSnapshot;
  selectedCondition: CardConditionCode;
  selectedBusinessProfile: BusinessProfile;
  selectedStrategy?: Strategy;
  selectedStrategyProfile?: StrategyProfile;
  onAskingPriceChange: (price: string) => void;
  onConditionChange: (condition: CardConditionCode) => void;
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

function MarketTextStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-zinc-950/60 p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 font-semibold text-zinc-300">{value}</p>
    </div>
  );
}

function formatOptionalCurrency(value?: number | null) {
  return typeof value === "number" ? formatCurrency(value) : "Unavailable";
}

export default function PurchasePanel({
  askingPrice,
  assetContext,
  availableVariants,
  card,
  isMarketLoading,
  marketPrice,
  marketSnapshot,
  selectedCondition,
  selectedBusinessProfile,
  selectedStrategy,
  selectedStrategyProfile,
  onAskingPriceChange,
  onConditionChange,
  onVariantChange,
  selectedVariant,
}: PurchasePanelProps) {
  const [debouncedAskingPrice, setDebouncedAskingPrice] = useState(askingPrice);
  const lastRecordedSnapshotKey = useRef("");
  const condition = selectedCondition;
  const canEvaluate = Boolean(
    marketPrice &&
    selectedStrategyProfile &&
    Number(askingPrice) > 0 &&
    selectedVariant,
  );
  const requiresFinishSelection = availableVariants.length > 1 && !selectedVariant;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedAskingPrice(askingPrice);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [askingPrice]);

  const conditionMarketSnapshot = useMemo(() => {
    if (!marketPrice) {
      return null;
    }

    return createConditionMarketSnapshot(
      marketPrice,
      condition,
      marketSnapshot?.marketIntelligence,
    );
  }, [condition, marketPrice, marketSnapshot?.marketIntelligence]);
  const conditionMarketPrice = conditionMarketSnapshot?.selectedPrice;
  const cardProfilePreview = useMemo(() => {
    if (!conditionMarketSnapshot || !selectedVariant) {
      return null;
    }

    return createCardProfile({
      condition: findConditionProfile(condition),
      marketContext: defaultMarketContext,
      marketContextSnapshot: conditionMarketSnapshot,
      printing: card,
      variant: selectedVariant,
    });
  }, [card, condition, conditionMarketSnapshot, selectedVariant]);

  const liveEvaluation = useMemo(() => {
    if (!canEvaluate || !marketPrice || !selectedStrategyProfile || !selectedVariant) {
      return null;
    }

    return evaluatePurchase({
      businessProfile: selectedBusinessProfile,
      card,
      condition,
      marketContext: defaultMarketContext,
      marketPrice,
      purchasePrice: Number(debouncedAskingPrice),
      selectedVariant,
      strategyProfile: selectedStrategyProfile,
    });
  }, [
    canEvaluate,
    card,
    condition,
    debouncedAskingPrice,
    marketPrice,
    selectedBusinessProfile,
    selectedStrategyProfile,
    selectedVariant,
  ]);
  const evaluationToShow = liveEvaluation;
  const historySnapshotKey =
    evaluationToShow?.status === "READY" && marketSnapshot && selectedStrategyProfile
      ? [
          assetContext.id,
          assetContext.generation,
          askingPrice,
          selectedBusinessProfile.id,
          selectedStrategyProfile.id,
          createMarketSnapshotId({
            printingId: marketSnapshot.printingId,
            providerId: marketSnapshot.providerId,
            updatedAt: marketSnapshot.updatedAt,
            variantId: marketSnapshot.variantId,
          }),
          evaluationToShow.decision.action,
        ].join(":")
      : "";
  const marketStats = [
    {
      label: "Current Market Estimate",
      value: conditionMarketPrice?.price,
    },
  ];
  const marketIntelligence = marketSnapshot?.marketIntelligence;
  const averageRecentSale =
    marketIntelligence && marketIntelligence.recentSalesCount > 0
      ? marketIntelligence.marketPrice
      : null;

  useEffect(() => {
    if (
      !historySnapshotKey ||
      !marketSnapshot ||
      !selectedStrategyProfile ||
      evaluationToShow?.status !== "READY"
    ) {
      return;
    }

    if (lastRecordedSnapshotKey.current === historySnapshotKey) {
      return;
    }

    const result = evaluationHistoryEngine.recordCompletedEvaluation({
      assetContext,
      evaluation: evaluationToShow,
      marketSnapshot,
      strategyProfile: selectedStrategyProfile,
    });

    if (result.recorded) {
      lastRecordedSnapshotKey.current = historySnapshotKey;
    }
  }, [
    assetContext,
    evaluationToShow,
    historySnapshotKey,
    marketSnapshot,
    selectedStrategyProfile,
  ]);

  return (
    <section className="space-y-4 lg:sticky lg:top-6">
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 shadow-lg shadow-black/10">
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <CardImage
              card={card}
              detail={`${card.set} ${card.finish}`}
              size="printing"
            />
            <div className="min-w-0">
              <p className="text-xs text-zinc-500">Selected Card</p>
              <h3 className="mt-1 truncate text-lg font-semibold text-white">
                {card.name}
              </h3>
              <p className="mt-1 text-sm text-zinc-400">
                {card.set} #{card.number}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {selectedVariant?.finish ?? card.finish} /{" "}
                {card.releaseYear ?? "Unknown"}
              </p>
            </div>
          </div>
          <div className="rounded-md bg-zinc-950/60 px-3 py-2">
            <p className="text-xs text-zinc-500">Current Buying Strategy</p>
            <p className="mt-1 text-sm font-medium text-cyan-300">
              {selectedStrategy?.name ?? "No strategy"}
            </p>
          </div>
          <div className="rounded-md bg-zinc-950/60 px-3 py-2">
            <p className="text-xs text-zinc-500">Business Profile</p>
            <p className="mt-1 text-sm font-medium text-cyan-300">
              {selectedBusinessProfile.name}
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
          <MarketTextStat
            label="Lowest Listing"
            value={formatOptionalCurrency(marketIntelligence?.lowestListing)}
          />
          <MarketTextStat
            label="Recent Sale Price"
            value={formatOptionalCurrency(averageRecentSale)}
          />
        </div>

        <div className="mt-3 text-xs text-zinc-500">
          {isMarketLoading ? (
            <p>Loading market estimate...</p>
          ) : marketSnapshot?.errorMessage ? (
            <p>{marketSnapshot.errorMessage}</p>
          ) : !selectedVariant ? (
            <p>Select a finish variant to load a market estimate.</p>
          ) : marketPrice ? (
            <p>
              {marketIntelligence?.providerName ?? "Daily market estimate"} for{" "}
              {marketPrice.finish}. Live availability may differ.
            </p>
          ) : (
            <p>
              No market estimate available for this selected printing / finish.
            </p>
          )}
        </div>

        {availableVariants.length > 0 ? (
          <div className="mt-5 grid gap-4 border-t border-zinc-800 pt-5 sm:grid-cols-2">
            <div>
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
                  : availableVariants.length > 1
                    ? `✓ Default finish selected: ${selectedVariant?.finish}`
                    : `✓ Finish: ${selectedVariant?.finish}`}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-300">Condition</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {conditionProfiles.map((profile) => {
                  const isSelected = profile.code === condition;

                  return (
                    <button
                      key={profile.code}
                      type="button"
                      onClick={() => onConditionChange(profile.code)}
                      className={`rounded-md border px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                        isSelected
                          ? "border-cyan-400 bg-cyan-400 text-zinc-950"
                          : "border-zinc-700 bg-zinc-950 text-zinc-200 hover:border-zinc-500"
                      }`}
                    >
                      {profile.code}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                {findConditionProfile(condition).label}
              </p>
            </div>
          </div>
        ) : null}

        <div className="mt-5 border-t border-zinc-800 pt-5">
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
          <p className="mt-2 text-xs text-zinc-500">
            Decision updates automatically.
          </p>
        </div>
      </div>

      {evaluationToShow ? (
        <EvaluationSummary
          askingPrice={Number(askingPrice)}
          evaluation={evaluationToShow}
        />
      ) : (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-400">
          Enter an asking price to see the buy decision.
        </div>
      )}

      {cardProfilePreview ? (
        <CardProfilePanel cardProfile={cardProfilePreview} />
      ) : null}
    </section>
  );
}
