import { JustTCG } from "justtcg-js";
import { JustTCGAdapter } from "@/lib/providers/justtcg/JustTCGAdapter";
import {
  createJustTCGConnectionStatus,
  type JustTCGInspectionResult,
} from "@/lib/providers/justtcg/JustTCGDiagnostics";
import {
  normalizeJustTCGContext,
  type JustTCGKnownCardContext,
  type JustTCGNormalizedResponse,
  type JustTCGRawCardResponse,
} from "@/lib/providers/justtcg/JustTCGNormalizer";
import { ProviderClient } from "@/lib/providers/sdk/ProviderClient";
import { createProviderDiagnostics } from "@/lib/providers/sdk/ProviderDiagnostics";
import type { ProviderResult } from "@/lib/providers/sdk/ProviderResult";
import type {
  MarketIntelligenceEvidence,
  MarketSnapshot,
  MarketTrend,
} from "@/types/marketSnapshot";
import type { MarketPrice } from "@/types/marketPrice";

type JustTCGSdkClient = InstanceType<typeof JustTCG>;

export class JustTCGProvider {
  readonly id = "justtcg";
  readonly name = "JustTCG";
  private readonly adapter = new JustTCGAdapter();

  constructor(private readonly clientFactory = () => new JustTCG()) {}

  createClient(): JustTCGSdkClient {
    return this.clientFactory();
  }

  async fetchKnownCard(
    context?: JustTCGKnownCardContext,
  ): Promise<JustTCGRawCardResponse> {
    const normalizedContext = normalizeJustTCGContext(context);
    const client = this.createClient();

    return client.v1.cards.get({
      game: normalizedContext.game,
      query: normalizedContext.cardName,
      limit: normalizedContext.limit,
      include_price_history: normalizedContext.includePriceHistory,
      priceHistoryDuration: normalizedContext.priceHistoryDuration,
      include_statistics: ["7d", "30d", "90d", "allTime"],
    });
  }

  async executeKnownCard(
    context?: JustTCGKnownCardContext,
  ): Promise<ProviderResult<JustTCGNormalizedResponse>> {
    const client = new ProviderClient<
      JustTCGRawCardResponse,
      JustTCGNormalizedResponse,
      JustTCGKnownCardContext
    >(this.adapter, undefined, {
      fetchRaw: (requestContext) => this.fetchKnownCard(requestContext),
    });

    return client.execute(normalizeJustTCGContext(context));
  }

  async getMarketSnapshot(input: {
    cardName: string;
    condition?: string;
    game?: string;
    printingId: string;
    variantId: string;
  }): Promise<MarketSnapshot> {
    const result = await this.executeKnownCard({
      cardName: input.cardName,
      game: normalizeGameName(input.game),
    });
    const normalized = result.data;
    const card = normalized?.cards.find(
      (item) => item.name.toLowerCase() === input.cardName.toLowerCase(),
    ) ?? normalized?.cards[0];
    const variant = card
      ? selectVariantForMarket(card.variants, input.variantId, input.condition)
      : undefined;

    if (!card || !variant || variant.currentPriceUsd === null) {
      return {
        printingId: input.printingId,
        variantId: input.variantId,
        prices: [],
        providerId: this.id,
        updatedAt: new Date().toISOString(),
        sourceLabel: "Variant Valuation",
        identityEvidence: createIdentityEvidence(card, variant),
        rawObservations: createRawObservations(card, variant),
        durationMs: result.diagnostics.durationMs,
        errorMessage:
          result.errorMessage ??
          "JustTCG market data is unavailable for the selected printing.",
        priceMissing: true,
      };
    }

    const evidence = createMarketEvidence({
      cardName: input.cardName,
      durationMs: result.diagnostics.durationMs,
      providerId: this.id,
      providerName: this.name,
      variant,
    });
    const prices = createMarketPrices({
      confidence: evidence.marketConfidence,
      marketPrice: variant.currentPriceUsd,
      printingId: input.printingId,
      source: "Variant Valuation",
      variantId: input.variantId,
    });

    return {
      printingId: input.printingId,
      variantId: input.variantId,
      prices,
      providerId: this.id,
      updatedAt: new Date().toISOString(),
      sourceLabel: "Variant Valuation",
      identityEvidence: createIdentityEvidence(card, variant),
      rawObservations: createRawObservations(card, variant),
      durationMs: result.diagnostics.durationMs,
      marketIntelligence: evidence,
      priceMissing: false,
    };
  }

  async inspectKnownCardForDevelopment(
    context?: JustTCGKnownCardContext,
  ): Promise<JustTCGInspectionResult> {
    if (process.env.NODE_ENV !== "development") {
      throw new Error("JustTCG inspection is only available in development.");
    }

    const startedAt = Date.now();

    try {
      const raw = await this.fetchKnownCard(context);
      const validationMessages = this.adapter.validate(raw);
      const normalized = this.adapter.normalize(raw, context);
      const diagnostics = createProviderDiagnostics({
        cacheStatus: "BYPASS",
        coverage: this.adapter.getCoverage(context),
        durationMs: Date.now() - startedAt,
        evidence: this.adapter.mapEvidence(normalized),
        health: {
          checkedAt: new Date().toISOString(),
          latencyMs: Date.now() - startedAt,
          message: "JustTCG SDK authenticated and returned a known-card response.",
          retryable: true,
          status: "HEALTHY",
        },
        metadata: this.adapter.metadata,
        normalized: true,
        validationMessages,
      });
      const providerResultStatus = validationMessages.length
        ? "PARTIAL" as const
        : "SUCCESS" as const;
      const status = createJustTCGConnectionStatus({ normalized });

      return {
        authenticationStatus: status.authenticationStatus,
        connectionStatus: status.connectionStatus,
        diagnostics,
        normalized,
        providerResultStatus,
        rawSdkResponse: raw,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown JustTCG error.";
      const diagnostics = createProviderDiagnostics({
        cacheStatus: "BYPASS",
        coverage: this.adapter.getCoverage(context),
        durationMs: Date.now() - startedAt,
        evidence: this.adapter.mapEvidence(null),
        health: {
          checkedAt: new Date().toISOString(),
          latencyMs: Date.now() - startedAt,
          message,
          retryable: true,
          status: "UNAVAILABLE",
        },
        metadata: this.adapter.metadata,
        validationMessages: [message],
      });
      const status = createJustTCGConnectionStatus({
        errorMessage: message,
        normalized: null,
      });

      return {
        authenticationStatus: status.authenticationStatus,
        connectionStatus: status.connectionStatus,
        diagnostics,
        normalized: null,
        providerResultStatus: "FAILED",
        rawSdkResponse: null,
      };
    }
  }
}

function createRawObservations(
  card: JustTCGNormalizedResponse["cards"][number] | undefined,
  variant: JustTCGNormalizedResponse["cards"][number]["variants"][number] | undefined,
) {
  return [
    ...(card?.rawObservations ?? []),
    ...(variant?.rawObservations ?? []),
  ];
}

function createIdentityEvidence(
  card: JustTCGNormalizedResponse["cards"][number] | undefined,
  variant: JustTCGNormalizedResponse["cards"][number]["variants"][number] | undefined,
) {
  return {
    canonicalName: card?.name ?? null,
    collectorNumber: card?.number ?? null,
    condition: variant?.condition ?? null,
    finish: variant?.printing ?? null,
    game: card?.game ?? null,
    language: variant?.language ?? null,
    productIdentifier:
      variant?.tcgplayerSkuId ??
      variant?.variantUuid ??
      variant?.variantId ??
      card?.identifiers.tcgplayerId ??
      card?.cardUuid ??
      null,
    providerTimestamp: variant?.lastUpdatedAt ?? (card ? new Date().toISOString() : null),
  };
}

function normalizeGameName(game?: string) {
  if (!game || game.toLowerCase() === "magic") {
    return "Magic: The Gathering";
  }

  return game;
}

function selectVariantForMarket(
  variants: JustTCGNormalizedResponse["cards"][number]["variants"],
  requestedVariantId: string,
  requestedCondition?: string,
) {
  const requested = requestedVariantId.toLowerCase();
  const wantsFoil = requested.includes("foil") && !requested.includes("nonfoil");
  const conditionRank = createConditionRank(requestedCondition);
  const finishMatches = variants.filter((variant) => {
    const printing = variant.printing.toLowerCase();

    return wantsFoil ? printing.includes("foil") : !printing.includes("foil");
  });
  const candidates = finishMatches.length > 0 ? finishMatches : variants;

  return [...candidates]
    .filter((variant) => variant.currentPriceUsd !== null)
    .sort((first, second) => {
      const firstCondition = conditionRank.indexOf(first.condition);
      const secondCondition = conditionRank.indexOf(second.condition);
      const normalizedFirst = firstCondition === -1 ? 99 : firstCondition;
      const normalizedSecond = secondCondition === -1 ? 99 : secondCondition;

      return normalizedFirst - normalizedSecond;
    })[0];
}

function createConditionRank(requestedCondition?: string) {
  const defaultRank = [
    "Near Mint",
    "Lightly Played",
    "Moderately Played",
    "Heavily Played",
    "Damaged",
  ];
  const requested = normalizeConditionName(requestedCondition);

  if (!requested) {
    return defaultRank;
  }

  return [
    requested,
    ...defaultRank.filter((condition) => condition !== requested),
  ];
}

function normalizeConditionName(condition?: string) {
  const normalized = condition?.toLowerCase().trim();

  if (!normalized) {
    return null;
  }

  if (["nm", "near mint", "near-mint"].includes(normalized)) {
    return "Near Mint";
  }

  if (["lp", "lightly played", "lightly-played"].includes(normalized)) {
    return "Lightly Played";
  }

  if (["mp", "moderately played", "moderately-played"].includes(normalized)) {
    return "Moderately Played";
  }

  if (["hp", "heavily played", "heavily-played"].includes(normalized)) {
    return "Heavily Played";
  }

  if (["dmg", "damaged"].includes(normalized)) {
    return "Damaged";
  }

  return condition ?? null;
}

function inferTrendFromHistory(
  priceHistory: JustTCGNormalizedResponse["cards"][number]["variants"][number]["priceHistory"],
): MarketTrend {
  if (priceHistory.length < 2) {
    return "Stable";
  }

  const first = priceHistory[0].priceUsd;
  const last = priceHistory.at(-1)?.priceUsd ?? first;
  const change = first > 0 ? ((last - first) / first) * 100 : 0;

  if (change > 2) {
    return "Increasing";
  }

  if (change < -2) {
    return "Declining";
  }

  return "Stable";
}

function calculateVolatilityFromHistory(
  priceHistory: JustTCGNormalizedResponse["cards"][number]["variants"][number]["priceHistory"],
) {
  if (priceHistory.length < 2) {
    return 0;
  }

  const values = priceHistory.map((point) => point.priceUsd);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;

  if (average <= 0) {
    return 0;
  }

  const variance =
    values.reduce((sum, value) => sum + (value - average) ** 2, 0) / values.length;

  return Math.sqrt(variance) / average;
}

function calculateMovementFromHistory(
  priceHistory: JustTCGNormalizedResponse["cards"][number]["variants"][number]["priceHistory"],
) {
  if (priceHistory.length < 2) {
    return 0;
  }

  const first = priceHistory[0].priceUsd;
  const last = priceHistory.at(-1)?.priceUsd ?? first;

  return first > 0 ? Math.abs(((last - first) / first) * 100) : 0;
}

function clampScore(score: number) {
  return Math.min(100, Math.max(0, Math.round(score)));
}

function createMarketEvidence(input: {
  cardName: string;
  durationMs: number;
  providerId: string;
  providerName: string;
  variant: JustTCGNormalizedResponse["cards"][number]["variants"][number];
}): MarketIntelligenceEvidence {
  const volatility = calculateVolatilityFromHistory(input.variant.priceHistory);
  const trend = inferTrendFromHistory(input.variant.priceHistory);
  const movement = calculateMovementFromHistory(input.variant.priceHistory);
  const historyCoverage = input.variant.priceHistory.length > 0 ? 30 : 0;
  const marketConfidence = clampScore(65 + historyCoverage + Math.min(5, movement));
  const stability = clampScore(100 - volatility * 1000);
  const momentum = trend === "Increasing" ? 78 : trend === "Stable" ? 62 : 38;

  return {
    apiStatus: "LIVE",
    demandMomentum: momentum,
    directLow: null,
    evidenceCoverage: input.variant.priceHistory.length > 0 ? 85 : 60,
    healthStatus: "HEALTHY",
    inventoryHealth: 50,
    lastSynchronizedAt: new Date().toISOString(),
    latencyMs: input.durationMs,
    liquidity: clampScore((marketConfidence + momentum) / 2),
    listingCount: 0,
    lowestListing: null,
    marketConfidence,
    marketPrice: input.variant.currentPriceUsd,
    marketStability: stability,
    priceHistory: input.variant.priceHistory.map((point) => ({
      date: point.date,
      price: point.priceUsd,
    })),
    providerId: input.providerId,
    providerName: input.providerName,
    recentSalesCount: 0,
    salesVelocity: 50,
    spread: 0,
    trend,
    volatility: clampScore(volatility * 1000),
  };
}

function createMarketPrices(input: {
  confidence: number;
  marketPrice: number;
  printingId: string;
  source: string;
  variantId: string;
}): MarketPrice[] {
  return [
    {
      id: `justtcg:${input.printingId}:${input.variantId}:market`,
      cardId: input.printingId,
      printingId: input.printingId,
      variantId: input.variantId,
      providerId: "justtcg",
      source: input.source,
      currency: "USD",
      finish: input.variantId.split(":").at(-1) ?? "Unknown",
      price: input.marketPrice,
      priceType: "market_estimate",
      updatedAt: new Date().toISOString(),
      confidence: input.confidence,
    },
  ];
}
