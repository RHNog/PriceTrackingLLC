"use client";

import { useEffect, useMemo, useState } from "react";
import AtlasInspector from "@/features/vendor/components/AtlasInspector";
import CardSearchPalette from "@/features/vendor/components/CardSearchPalette";
import PrintingResults from "@/features/vendor/components/PrintingResults";
import PurchasePanel from "@/features/vendor/components/PurchasePanel";
import {
  defaultBusinessProfileId,
  defaultBusinessProfiles,
} from "@/lib/business/BusinessDefaults";
import { createCardProfile } from "@/lib/engines/cardIntelligence/CardIntelligenceEngine";
import { createConditionMarketSnapshot } from "@/lib/engines/market/createConditionMarketSnapshot";
import { inspectEvaluationPipeline } from "@/lib/pipeline/PipelineInspector";
import { createSystemReadinessReport } from "@/lib/validation/SystemReadinessEngine";
import { searchPrintings } from "@/lib/engines/search/searchPrintings";
import { createWorkflowCommand } from "@/lib/workflow/commands/WorkflowCommand";
import {
  createMarketSnapshotId,
  validateAssetContext,
} from "@/lib/workflow/AssetContextValidator";
import {
  initialVendorWorkflowSnapshot,
  processWorkflowCommand,
} from "@/lib/workflow/VendorWorkflowMachine";
import type { Card } from "@/types/card";
import type { CardIdentity } from "@/types/cardIdentity";
import type { CardConditionCode } from "@/types/conditionProfile";
import { findConditionProfile } from "@/types/conditionProfile";
import { defaultMarketContext } from "@/types/MarketContext";
import type { MarketSnapshot } from "@/types/marketSnapshot";
import type { PrintingMatchCandidate } from "@/types/printingResolution";
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

function findVariant(variants: PrintingVariant[], variantId: string) {
  return variants.find((variant) => variant.id === variantId);
}

function createPrintingCandidate(printing: Card): PrintingMatchCandidate {
  const finishVariants = printing.finishVariants ?? [];
  const printingFinishes = printing.availableFinishes ?? [];
  const availableFinishes =
    printingFinishes.length > 0
      ? printingFinishes
      : finishVariants.length > 0
        ? finishVariants.map((variant) => variant.finish)
        : [printing.finish];

  return {
    availableFinishes,
    confidence: 50,
    explanation: [
      {
        label: "Identity printing",
        passed: true,
        value: printing.set,
      },
    ],
    finishVariants,
    matchedConstraints: [],
    printing,
    relaxedConstraints: [],
    unmatchedConstraints: [],
  };
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
  const [printingQuery, setPrintingQuery] = useState("");
  const [activePrintingFilters, setActivePrintingFilters] = useState<string[]>([]);
  const [searchFocusKey, setSearchFocusKey] = useState(0);
  const [providerResults, setProviderResults] = useState<
    SearchResult<CardIdentity>[]
  >([]);
  const [resolvedIntent, setResolvedIntent] = useState<ResolvedIntent>();
  const [marketSnapshot, setMarketSnapshot] = useState<MarketSnapshot>();
  const [selectedBusinessProfileId, setSelectedBusinessProfileId] = useState(
    defaultBusinessProfileId,
  );
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const [isMarketLoading, setIsMarketLoading] = useState(false);
  const [workflow, setWorkflow] = useState({
    ...initialVendorWorkflowSnapshot,
    context: {
      ...initialVendorWorkflowSnapshot.context,
      selectedStrategyId: defaultStrategyId,
    },
  });
  const initialResults = useMemo(() => createInitialResults(cards), [cards]);
  const searchResults = query.trim() ? providerResults : initialResults;
  const workflowContext = workflow.context;
  const askingPrice = workflowContext.askingPrice;
  const highlightedCardId = workflowContext.highlightedIdentityId;
  const selectedCardId = workflowContext.selectedIdentityId;
  const selectedPrintingId = workflowContext.selectedPrintingId;
  const selectedVariantId = workflowContext.selectedVariantId;
  const selectedCondition = workflowContext.selectedCondition as CardConditionCode;
  const strategyId = workflowContext.selectedStrategyId;

  function dispatchCommand(
    command: Parameters<typeof processWorkflowCommand>[1],
  ) {
    setWorkflow((current) => processWorkflowCommand(current, command).workflow);
  }

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
      const results = payload.results ?? [];

      setResolvedIntent(payload.intent);
      setProviderResults(results);
      dispatchCommand(
        createWorkflowCommand(
          "LoadSearchResults",
          {
            resolvedIntent: payload.intent,
            results: results.map((result) => result.item),
          },
          "SearchEngine",
        ),
      );
    }

    runIdentitySearch().catch((error) => {
      if (!controller.signal.aborted) {
        console.error(error);
        setResolvedIntent(undefined);
        setProviderResults([]);
        dispatchCommand(
          createWorkflowCommand(
            "ReportWorkflowError",
            {
              errorMessage:
                error instanceof Error
                  ? error.message
                  : "Unable to search cards.",
            },
            "SearchEngine",
          ),
        );
      }
    });

    return () => controller.abort();
    // Workflow progression is intentionally command-driven inside the search callback.
  }, [query]);

  const selectedIdentity =
    searchResults.find((result) => result.item.id === selectedCardId)?.item;
  const printingResults = selectedIdentity
    ? searchPrintings(printingQuery, selectedIdentity.printings)
    : [];
  const constraintPrintingCandidates =
    resolvedIntent?.printingResolution?.printingCandidates ?? [];
  const identityPrintingCandidates =
    selectedIdentity?.printings.map(createPrintingCandidate) ?? [];
  const availablePrintingCandidates =
    constraintPrintingCandidates.length > 0
      ? constraintPrintingCandidates
      : identityPrintingCandidates;
  const filteredPrintingCandidates = availablePrintingCandidates.filter(
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
    )?.printing;
  const selectedCard =
    selectedConstraintPrinting ??
    printingResults.find((result) => result.item.id === selectedPrintingId)?.item;
  const availableVariants = getVariants(selectedCard);
  const selectedVariant =
    findVariant(availableVariants, selectedVariantId);
  const selectedStrategy = findById(strategies, strategyId) ?? strategies[0];
  const selectedProfile = selectedStrategy
    ? findById(strategyProfiles, selectedStrategy.profileId)
    : undefined;
  const selectedBusinessProfile =
    findById(defaultBusinessProfiles, selectedBusinessProfileId) ??
    defaultBusinessProfiles[0];
  const marketSnapshotId = marketSnapshot
    ? createMarketSnapshotId({
        printingId: marketSnapshot.printingId,
        providerId: marketSnapshot.providerId,
        updatedAt: marketSnapshot.updatedAt,
        variantId: marketSnapshot.variantId,
      })
    : "";
  const activeMarketSnapshot =
    marketSnapshot?.printingId === selectedCard?.id &&
    marketSnapshot?.variantId === selectedVariant?.id &&
    marketSnapshotId === workflow.assetContext.marketSnapshotId
      ? marketSnapshot
      : undefined;
  const marketPrice = activeMarketSnapshot?.prices[0];
  const assetValidation = validateAssetContext({
    assetContext: workflow.assetContext,
    identity: selectedIdentity,
    marketSnapshot: activeMarketSnapshot,
    printing: selectedCard,
    variant: selectedVariant,
  });
  const systemReadinessReport = createSystemReadinessReport({
    businessProfile: selectedBusinessProfile,
    marketPrice,
    strategyProfile: selectedProfile,
  });
  const pipelineCardProfile =
    selectedCard && selectedVariant && marketPrice
      ? createCardProfile({
          condition: findConditionProfile(selectedCondition),
          marketContext: defaultMarketContext,
          marketContextSnapshot: createConditionMarketSnapshot(
            marketPrice,
            selectedCondition,
          ),
          printing: selectedCard,
          variant: selectedVariant,
        })
      : undefined;
  const pipelineReport = inspectEvaluationPipeline({
    askingPrice: Number(askingPrice),
    businessProfile: selectedBusinessProfile,
    cardProfile: pipelineCardProfile,
    marketPrice,
    selectedVariant,
    strategyProfile: selectedProfile,
  });

  useEffect(() => {
    if (!selectedCard || !selectedVariant) {
      return;
    }

    const controller = new AbortController();
    const printingId = selectedCard.id;
    const variantId = selectedVariant.id;
    const assetContextGeneration = workflow.assetContext.generation;

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
        dispatchCommand(
          createWorkflowCommand(
            "LoadMarketSnapshot",
            {
              assetContextGeneration,
              printingId: snapshot.printingId,
              providerId: snapshot.providerId,
              updatedAt: snapshot.updatedAt,
              variantId: snapshot.variantId,
            },
            "MarketProvider",
          ),
        );
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
          dispatchCommand(
            createWorkflowCommand(
              "ReportWorkflowError",
              {
                errorMessage:
                  error instanceof Error
                    ? error.message
                    : "Unable to load market estimate.",
                identityCount: searchResults.length,
                printingCount: filteredPrintingCandidates.length,
              },
              "MarketProvider",
            ),
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsMarketLoading(false);
        }
      }
    }

    loadMarketSnapshot();

    return () => controller.abort();
    // Market loading is tied to Asset Context generation so condition changes refresh it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCard, selectedVariant, workflow.assetContext.generation]);

  useEffect(() => {
    function handleDeveloperShortcut(event: KeyboardEvent) {
      const isDeveloperShortcut =
        event.shiftKey &&
        event.key.toLowerCase() === "d" &&
        (event.metaKey || event.ctrlKey);

      if (!isDeveloperShortcut) {
        return;
      }

      event.preventDefault();
      setIsDeveloperMode((current) => !current);
    }

    window.addEventListener("keydown", handleDeveloperShortcut);

    return () => window.removeEventListener("keydown", handleDeveloperShortcut);
  }, []);

  function handleSelectCard(identity: CardIdentity) {
    setPrintingQuery("");
    setActivePrintingFilters([]);
    setMarketSnapshot(undefined);
    dispatchCommand(
      createWorkflowCommand("SelectCard", {
        identity,
        identityCount: searchResults.length,
        resolvedIntent,
      }),
    );
  }

  function handleSelectPrinting(printingId: string) {
    const printing =
      constraintPrintingCandidates.find(
        (candidate) => candidate.printing.id === printingId,
      )?.printing ??
      printingResults.find((result) => result.item.id === printingId)?.item;

    setMarketSnapshot(undefined);
    if (!printing) {
      dispatchCommand(
        createWorkflowCommand("ReportWorkflowError", {
          errorMessage: "Selected printing is no longer available.",
          identityCount: searchResults.length,
          printingCount: filteredPrintingCandidates.length,
        }),
      );
      return;
    }

    dispatchCommand(
      createWorkflowCommand("SelectPrinting", {
        identityCount: searchResults.length,
        printing,
        printingCount: filteredPrintingCandidates.length,
        resolvedIntent,
      }),
    );
  }

  function handleStrategyChange(nextStrategyId: string) {
    dispatchCommand(
      createWorkflowCommand("ChangeStrategy", { strategyId: nextStrategyId }),
    );
  }

  function handleBusinessProfileChange(nextBusinessProfileId: string) {
    setSelectedBusinessProfileId(nextBusinessProfileId);
  }

  function resetWorkflow() {
    setQuery("");
    setPrintingQuery("");
    setActivePrintingFilters([]);
    setProviderResults([]);
    setResolvedIntent(undefined);
    setMarketSnapshot(undefined);
    dispatchCommand(createWorkflowCommand("ResetWorkspace", {}));
    setSearchFocusKey((value) => value + 1);
  }

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery);
    setMarketSnapshot(undefined);

    if (!nextQuery.trim()) {
      dispatchCommand(createWorkflowCommand("ResetWorkspace", {}));
    } else {
      dispatchCommand(createWorkflowCommand("SearchCards", { query: nextQuery }));
    }
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

  function moveIdentityHighlight(direction: 1 | -1) {
    if (searchResults.length === 0) {
      return;
    }

    const currentIndex = Math.max(
      0,
      searchResults.findIndex((result) => result.item.id === highlightedCardId),
    );
    const nextIndex =
      (currentIndex + direction + searchResults.length) % searchResults.length;
    const identity = searchResults[nextIndex].item;

    dispatchCommand(
      createWorkflowCommand("HighlightCard", {
        identity,
        identityCount: searchResults.length,
      }),
    );
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

      if (isTypingTarget && target?.getAttribute("type") !== "search") {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (selectedCardId) {
          movePrintingSelection(1);
        } else {
          moveIdentityHighlight(1);
        }
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (selectedCardId) {
          movePrintingSelection(-1);
        } else {
          moveIdentityHighlight(-1);
        }
        return;
      }

      if (event.key === "Enter" && !selectedCardId && highlightedCardId) {
        event.preventDefault();
        const identity = searchResults.find(
          (result) => result.item.id === highlightedCardId,
        )?.item;

        if (identity) {
          handleSelectCard(identity);
        }
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
        highlightedCardId={highlightedCardId}
        interpretationSummary={
          query.trim() ? resolvedIntent?.resolutionExplanation : undefined
        }
        query={query}
        results={searchResults}
        selectedCardId={selectedCardId}
        onQueryChange={handleQueryChange}
        onSelectCard={handleSelectCard}
      />

      {isDeveloperMode && process.env.NODE_ENV === "development" ? (
        <AtlasInspector
          assetValidation={assetValidation}
          cardProfile={pipelineCardProfile}
          isMarketLoading={isMarketLoading}
          marketSnapshot={activeMarketSnapshot}
          query={query}
          pipelineReport={pipelineReport}
          resolvedIntent={resolvedIntent}
          selectedCondition={selectedCondition}
          systemReadinessReport={systemReadinessReport}
          workflow={workflow}
        />
      ) : null}

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

      <label className="block max-w-xs space-y-2">
        <span className="block text-sm font-medium text-zinc-300">
          Business Profile
        </span>
        <select
          value={selectedBusinessProfileId}
          onChange={(event) => handleBusinessProfileChange(event.target.value)}
          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
        >
          {defaultBusinessProfiles.map((businessProfile) => (
            <option key={businessProfile.id} value={businessProfile.id}>
              {businessProfile.name}
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
              assetContext={workflow.assetContext}
              card={selectedCard}
              availableVariants={availableVariants}
              isMarketLoading={isMarketLoading}
              marketPrice={marketPrice}
              marketSnapshot={activeMarketSnapshot}
              selectedCondition={
                selectedCondition
              }
              selectedBusinessProfile={selectedBusinessProfile}
              selectedStrategy={selectedStrategy}
              selectedStrategyProfile={selectedProfile}
              onAskingPriceChange={(price) =>
                dispatchCommand(
                  createWorkflowCommand("EnterAskingPrice", {
                    askingPrice: price,
                  }),
                )
              }
              onConditionChange={(condition) =>
                dispatchCommand(
                  createWorkflowCommand("ChangeCondition", { condition }),
                )
              }
              onVariantChange={(variantId) => {
                dispatchCommand(
                  createWorkflowCommand("SelectVariant", { variantId }),
                );
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
