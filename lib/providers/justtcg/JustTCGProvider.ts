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
import type { MarketSnapshot } from "@/types/marketSnapshot";
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
    const rawObservations = createRawObservations(normalized);
    const prices = card
      ? createVariantValuationPrices({
          card,
          printingId: input.printingId,
        })
      : [];

    if (!card || prices.length === 0) {
      return {
        printingId: input.printingId,
        variantId: input.variantId,
        prices: [],
        providerId: this.id,
        updatedAt: new Date().toISOString(),
        sourceLabel: "Variant Valuation",
        identityEvidence: createIdentityEvidence(card),
        rawObservations,
        durationMs: result.diagnostics.durationMs,
        errorMessage:
          result.errorMessage ??
          "JustTCG variant valuation observations are unavailable for the selected asset.",
        priceMissing: true,
      };
    }

    return {
      printingId: input.printingId,
      variantId: input.variantId,
      prices,
      providerId: this.id,
      updatedAt: new Date().toISOString(),
      sourceLabel: "Variant Valuation",
      identityEvidence: createIdentityEvidence(card),
      rawObservations,
      durationMs: result.diagnostics.durationMs,
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
  normalized: JustTCGNormalizedResponse | null | undefined,
) {
  return [
    ...(normalized?.providerMetadata.rawObservations ?? []),
    ...(normalized?.cards.flatMap((card) => [
      ...card.rawObservations,
      ...card.variants.flatMap((variant) => variant.rawObservations),
    ]) ?? []),
  ];
}

function createIdentityEvidence(
  card: JustTCGNormalizedResponse["cards"][number] | undefined,
) {
  return {
    canonicalName: card?.name ?? null,
    collectorNumber: card?.number ?? null,
    condition: null,
    finish: null,
    game: card?.game ?? null,
    language: null,
    productIdentifier:
      card?.identifiers.tcgplayerId ??
      card?.cardUuid ??
      null,
    providerTimestamp: card ? new Date().toISOString() : null,
  };
}

function normalizeGameName(game?: string) {
  if (!game || game.toLowerCase() === "magic") {
    return "Magic: The Gathering";
  }

  return game;
}

function createVariantValuationPrices(input: {
  card: JustTCGNormalizedResponse["cards"][number];
  printingId: string;
}): MarketPrice[] {
  return input.card.variants
    .filter((variant) => variant.currentPriceUsd !== null)
    .map((variant) => ({
      id: `justtcg:${input.printingId}:${variant.variantId}:variant-valuation`,
      cardId: input.printingId,
      printingId: input.printingId,
      variantId: `${input.printingId}:${variant.variantId}`,
      providerId: "justtcg",
      source: "Variant Valuation",
      currency: "USD",
      finish: variant.printing,
      price: variant.currentPriceUsd ?? 0,
      priceType: "variant_valuation",
      updatedAt: variant.lastUpdatedAt ?? new Date().toISOString(),
      confidence: 0,
      condition: variant.condition,
      conditionSpecific: true,
    }));
}
