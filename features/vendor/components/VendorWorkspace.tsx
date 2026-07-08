"use client";

import { useEffect, useMemo, useState } from "react";
import CardSearchPalette from "@/features/vendor/components/CardSearchPalette";
import PrintingResults from "@/features/vendor/components/PrintingResults";
import PurchasePanel from "@/features/vendor/components/PurchasePanel";
import { toPrintingConstraints } from "@/lib/engines/constraints/satisfyPrintingConstraints";
import { searchPrintings } from "@/lib/engines/search/searchPrintings";
import { resolvePrintingVariant } from "@/lib/engines/variantResolution/VariantResolutionPolicy";
import type { Card } from "@/types/card";
import type { CardIdentity } from "@/types/cardIdentity";
import type { MarketSnapshot } from "@/types/marketSnapshot";
import type { ResolvedIntent } from "@/types/resolvedIntent";
import type { SearchResult } from "@/types/searchResult";
import type { Strategy } from "@/types/strategy";
import type { StrategyProfile } from "@/types/strategyProfile";
import type { PrintingVariant } from "@/types/printingVariant";

type VendorWorkspaceProps = {
  cards: Card[];
  defaultStrategyId: string;
  strategies: Strategy[];
  strategyProfiles: StrategyProfile[];
};

function findById<T extends { id: string }>(items: T[], id: string) {
  return items.find((item) => item.id === id);
}

function getVariants(card?: Card) {
  return card?.finishVariants ?? [];
}

function getPolicyVariant(card?: Card, intent?: ResolvedIntent) {
  const variants = getVariants(card);

  if (!card) {
    return undefined;
  }

  return resolvePrintingVariant({
    availableVariants: variants,
    constraints: toPrintingConstraints(intent?.resolvedConstraints ?? []),
    printing: card,
  }).selectedVariant ?? undefined;
}

function findVariant(variants: PrintingVariant[], variantId: string) {
  return variants.find((variant) => variant.id === variantId);
}

const printingFilterChips = [
  "Foil",
  "Nonfoil",
  "Judge",
  "Retro",
  "Borderless",
  "Textless",
  "Serialized",
  "Showcase",
  "Secret Lair",
  "Special Guests",
  "Masterpiece",
];

function getPrintingFilterText(candidate: {
  availableFinishes: string[];
  printing: Card;
}) {
  const printing = candidate.printing;

  return [
    printing.set,
    printing.setCode,
    printing.number,
    printing.language,
    printing.treatment,
    printing.productFamily,
    ...(printing.promoTypes ?? []),
    ...(printing.frameEffects ?? []),
    ...candidate.availableFinishes,
  ]
    .join(" ")
    .toLowerCase();
}

function createInitialResults(cards: Card[]): SearchResult<CardIdentity>[] {
  return cards.map((card) => ({
    item: {
      id: card.name.toLowerCase(),
      name: card.name,
      game: card.game,
      printings: [card],
    },
    matchedTerms: [],
    score: 1,
  }));
}

export default function VendorWorkspace({
  cards,
  defaultStrategyId,
  strategies,
  strategyProfiles,
}: VendorWorkspaceProps) {
  const [query, setQuery] = useState("");
  const [selectedCardId, setSelectedCardId] = useState(
    cards[0]?.name.toLowerCase() ?? "",
  );
  const [selectedPrintingId, setSelectedPrintingId] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [printingQuery, setPrintingQuery] = useState("");
  const [activePrintingFilters, setActivePrintingFilters] = useState<string[]>([]);
  const [searchFocusKey, setSearchFocusKey] = useState(0);
  const [askingPrice, setAskingPrice] = useState("");
  const [strategyId, setStrategyId] = useState(defaultStrategyId);
  const [providerResults, setProviderResults] = useState<
    SearchResult<CardIdentity>[]
  >([]);
  const [resolvedIntent, setResolvedIntent] = useState<ResolvedIntent>();
  const [marketSnapshot, setMarketSnapshot] = useState<MarketSnapshot>();
  const [isMarketLoading, setIsMarketLoading] = useState(false);
  const initialResults = useMemo(() => createInitialResults(cards), [cards]);
  const searchResults = query.trim() ? providerResults : initialResults;

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return;
    }

    const controller = new AbortController();

    async function runIdentitySearch() {
      const response = await fetch(
        `/api/identity/search?q=${encodeURIComponent(normalizedQuery)}`,
        { signal: controller.signal },
      );
      const payload = (await response.json()) as {
        intent?: ResolvedIntent;
        results?: SearchResult<CardIdentity>[];
      };

      setResolvedIntent(payload.intent);
      setProviderResults(payload.results ?? []);
      setSelectedPrintingId(
        payload.intent?.printingResolution?.selectedPrinting?.id ??
          (payload.intent?.printingResolution?.shouldAutoCommit
            ? payload.intent?.printingResolution?.printingCandidates[0]?.printing.id
            : "") ??
          "",
      );
      setSelectedVariantId(
        payload.intent?.printingResolution?.shouldAutoCommitVariant
          ? payload.intent?.printingResolution?.selectedVariant?.id ?? ""
          : "",
      );
    }

    runIdentitySearch().catch((error) => {
      if (!controller.signal.aborted) {
        console.error(error);
        setResolvedIntent(undefined);
        setProviderResults([]);
      }
    });

    return () => controller.abort();
  }, [query]);

  const selectedIdentity =
    searchResults.find((result) => result.item.id === selectedCardId)?.item ??
    (query.trim() ? resolvedIntent?.selectedIdentity : undefined) ??
    searchResults[0]?.item;
  const printingResults = selectedIdentity
    ? searchPrintings(printingQuery, selectedIdentity.printings)
    : [];
  const constraintPrintingCandidates =
    resolvedIntent?.printingResolution?.printingCandidates ?? [];
  const filteredPrintingCandidates = constraintPrintingCandidates.filter(
    (candidate) => {
      const filterText = getPrintingFilterText(candidate);
      const matchesChips = activePrintingFilters.every((filter) =>
        filterText.includes(filter.toLowerCase()),
      );
      const matchesText =
        !printingQuery.trim() ||
        filterText.includes(printingQuery.trim().toLowerCase());

      return matchesChips && matchesText;
    },
  );
  const selectedConstraintPrinting =
    filteredPrintingCandidates.find(
      (candidate) => candidate.printing.id === selectedPrintingId,
    )?.printing ??
    (resolvedIntent?.printingResolution?.shouldAutoCommit
      ? resolvedIntent?.printingResolution?.selectedPrinting
      : undefined) ??
    (resolvedIntent?.printingResolution?.shouldAutoCommit
      ? filteredPrintingCandidates[0]?.printing
      : undefined);
  const selectedCard =
    selectedConstraintPrinting ??
    (resolvedIntent?.printingResolution?.shouldAutoCommit
      ? printingResults[0]?.item
      : undefined);
  const availableVariants = getVariants(selectedCard);
  const resolvedSelectedVariant =
    resolvedIntent?.printingResolution?.selectedVariant;
  const selectedVariant =
    findVariant(availableVariants, selectedVariantId) ??
    (resolvedSelectedVariant?.printingId === selectedCard?.id
      ? resolvedSelectedVariant
      : undefined) ??
    getPolicyVariant(selectedCard, resolvedIntent);
  const selectedStrategy = findById(strategies, strategyId) ?? strategies[0];
  const selectedProfile = selectedStrategy
    ? findById(strategyProfiles, selectedStrategy.profileId)
    : undefined;
  const activeMarketSnapshot =
    marketSnapshot?.printingId === selectedCard?.id &&
    marketSnapshot?.variantId === selectedVariant?.id
      ? marketSnapshot
      : undefined;
  const marketPrice = activeMarketSnapshot?.prices[0];

  useEffect(() => {
    if (!selectedCard || !selectedVariant) {
      return;
    }

    const controller = new AbortController();
    const printingId = selectedCard.id;
    const variantId = selectedVariant.id;

    async function loadMarketSnapshot() {
      setIsMarketLoading(true);

      try {
        const response = await fetch(
          `/api/market/snapshot?printingId=${encodeURIComponent(
            printingId,
          )}&variantId=${encodeURIComponent(variantId)}`,
          { signal: controller.signal },
        );
        const snapshot = (await response.json()) as MarketSnapshot;

        setMarketSnapshot(snapshot);
      } catch (error) {
        if (!controller.signal.aborted) {
          setMarketSnapshot({
            printingId,
            variantId,
            prices: [],
            providerId: "scryfall-market",
            updatedAt: new Date().toISOString(),
            sourceLabel: "Scryfall Daily Market Estimate",
            errorMessage:
              error instanceof Error
                ? error.message
                : "Unknown market provider error.",
            priceMissing: true,
          });
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsMarketLoading(false);
        }
      }
    }

    loadMarketSnapshot();

    return () => controller.abort();
  }, [selectedCard, selectedVariant]);

  function handleSelectCard(identity: CardIdentity) {
    const firstPrinting = identity.printings[0];

    setSelectedCardId(identity.id);
    setSelectedPrintingId(firstPrinting.id);
    setSelectedVariantId(getPolicyVariant(firstPrinting, resolvedIntent)?.id ?? "");
    setPrintingQuery("");
    setActivePrintingFilters([]);
    setAskingPrice("");
    setMarketSnapshot(undefined);
  }

  function handleSelectPrinting(printingId: string) {
    const printing =
      constraintPrintingCandidates.find(
        (candidate) => candidate.printing.id === printingId,
      )?.printing ??
      printingResults.find((result) => result.item.id === printingId)?.item;

    setSelectedPrintingId(printingId);
    setSelectedVariantId(getPolicyVariant(printing, resolvedIntent)?.id ?? "");
    setMarketSnapshot(undefined);
  }

  function handleStrategyChange(nextStrategyId: string) {
    setStrategyId(nextStrategyId);
  }

  function resetWorkflow() {
    setQuery("");
    setSelectedCardId(cards[0]?.name.toLowerCase() ?? "");
    setSelectedPrintingId("");
    setSelectedVariantId("");
    setPrintingQuery("");
    setActivePrintingFilters([]);
    setAskingPrice("");
    setProviderResults([]);
    setResolvedIntent(undefined);
    setMarketSnapshot(undefined);
    setSearchFocusKey((value) => value + 1);
  }

  function togglePrintingFilter(filter: string) {
    setActivePrintingFilters((current) =>
      current.includes(filter)
        ? current.filter((item) => item !== filter)
        : [...current, filter],
    );
  }

  function movePrintingSelection(direction: 1 | -1) {
    if (filteredPrintingCandidates.length === 0) {
      return;
    }

    const currentIndex = Math.max(
      0,
      filteredPrintingCandidates.findIndex(
        (candidate) => candidate.printing.id === selectedPrintingId,
      ),
    );
    const nextIndex =
      (currentIndex + direction + filteredPrintingCandidates.length) %
      filteredPrintingCandidates.length;

    handleSelectPrinting(filteredPrintingCandidates[nextIndex].printing.id);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        resetWorkflow();
        return;
      }

      const target = event.target as HTMLElement | null;
      const isTypingTarget =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT";

      if (isTypingTarget) {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        movePrintingSelection(1);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        movePrintingSelection(-1);
        return;
      }

      if (event.key === "Enter" && selectedPrintingId) {
        event.preventDefault();
        handleSelectPrinting(selectedPrintingId);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className="space-y-6">
      <CardSearchPalette
        focusKey={searchFocusKey}
        interpretationSummary={
          query.trim() ? resolvedIntent?.resolutionExplanation : undefined
        }
        query={query}
        results={searchResults}
        selectedCardId={selectedIdentity?.id ?? ""}
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

      {selectedIdentity ? (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2" aria-label="Printing filters">
              {printingFilterChips.map((filter) => {
                const isActive = activePrintingFilters.includes(filter);

                return (
                  <button
                    key={filter}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => togglePrintingFilter(filter)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                      isActive
                        ? "border-cyan-400 bg-cyan-400 text-zinc-950"
                        : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
            <label className="block max-w-xs space-y-2">
              <span className="block text-xs font-medium text-zinc-400">
                Refine printings
              </span>
              <input
                type="search"
                value={printingQuery}
                onChange={(event) => setPrintingQuery(event.target.value)}
                placeholder="Set, number, style..."
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
              />
            </label>
            <PrintingResults
              candidates={filteredPrintingCandidates}
              highlightedPrintingId={selectedPrintingId}
              selectedPrintingId={selectedCard?.id ?? ""}
              onSelectPrinting={handleSelectPrinting}
            />
          </div>

          {selectedCard ? (
            <PurchasePanel
              askingPrice={askingPrice}
              card={selectedCard}
              availableVariants={availableVariants}
              isMarketLoading={isMarketLoading}
              marketPrice={marketPrice}
              marketSnapshot={activeMarketSnapshot}
              selectedStrategy={selectedStrategy}
              selectedStrategyProfile={selectedProfile}
              onAskingPriceChange={setAskingPrice}
              onVariantChange={(variantId) => {
                setSelectedVariantId(variantId);
                setMarketSnapshot(undefined);
              }}
              selectedVariant={selectedVariant ?? null}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
