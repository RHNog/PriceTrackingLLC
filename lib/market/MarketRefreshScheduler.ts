import { JustTCGProvider } from "@/lib/providers/justtcg/JustTCGProvider";
import { TCGplayerIntelligenceProvider } from "@/lib/providers/market/TCGplayerIntelligenceProvider";
import { ScryfallMarketProvider } from "@/lib/providers/market/ScryfallMarketProvider";
import {
  marketIntelligenceRepository,
  type MarketSnapshotRequestContext,
  type MarketIntelligenceRepository,
} from "@/lib/market/MarketIntelligenceRepository";
import { marketTruthEngine } from "@/lib/market/MarketTruthEngine";
import type {
  MarketIntelligenceRepositorySnapshot,
  MarketSnapshotFieldValues,
} from "@/lib/market/MarketSnapshot";
import type { MarketSnapshotField } from "@/lib/market/MarketSnapshotMetadata";
import { marketSnapshotFields } from "@/lib/market/MarketRefreshPolicy";
import { canProviderAnswerAnyMarketField } from "@/lib/market/ontology/EvidenceResolver";
import type { MarketSnapshot } from "@/types/marketSnapshot";

export interface MarketSnapshotProviderClient {
  getMarketSnapshot(input: {
    cardName: string;
    condition?: string;
    game?: string;
    printingId: string;
    variantId: string;
  }): Promise<MarketSnapshot>;
}

export interface PrintingMarketSnapshotProviderClient {
  getMarketSnapshot(
    printingId: string,
    variantId: string,
  ): Promise<MarketSnapshot>;
}

export interface MarketRepositoryReadResult {
  fieldsRefreshed: MarketSnapshotField[];
  freshness: ReturnType<MarketIntelligenceRepository["getFreshness"]>;
  repositorySnapshot: MarketIntelligenceRepositorySnapshot;
  source: "Repository" | "Provider" | "RepositoryStale";
}

function mapProviderSnapshotToValues(
  snapshot: MarketSnapshot,
): MarketSnapshotFieldValues {
  const evidence = snapshot.marketIntelligence;

  return {
    listingCount: evidence?.listingCount ?? null,
    liquidity: evidence?.liquidity ?? null,
    lowestListing:
      evidence?.lowestListing ??
      snapshot.prices.find((price) => price.priceType === "lowest_known")?.price ??
      null,
    marketConfidence:
      evidence?.marketConfidence ??
      snapshot.prices.find((price) => price.priceType === "market_estimate")
        ?.confidence ??
      null,
    marketPrice:
      evidence?.marketPrice ??
      snapshot.prices.find((price) => price.priceType === "market_estimate")?.price ??
      null,
    providerId: snapshot.providerId,
    recentSales: evidence?.recentSalesCount ?? null,
    salesVelocity: evidence?.salesVelocity ?? null,
    spread: evidence?.spread ?? null,
    volatility: evidence?.volatility ?? null,
  };
}

function getProviderBackedFields(fields: MarketSnapshotField[]) {
  return fields.filter((field) =>
    [
      "cardMetadata",
      "printingMetadata",
      "marketPrice",
      "lowestListing",
      "listingCount",
      "recentSales",
      "spread",
      "liquidity",
      "salesVelocity",
      "volatility",
      "marketConfidence",
      "providerHealth",
      "providerCapabilities",
    ].includes(field),
  );
}

export class MarketRefreshScheduler {
  constructor(
    private readonly repository = marketIntelligenceRepository,
    private readonly justTcgProvider: MarketSnapshotProviderClient =
      new JustTCGProvider(),
    private readonly tcgplayerProvider: PrintingMarketSnapshotProviderClient =
      new TCGplayerIntelligenceProvider(),
    private readonly scryfallProvider: PrintingMarketSnapshotProviderClient =
      new ScryfallMarketProvider(),
  ) {}

  async getSnapshot(
    context: MarketSnapshotRequestContext,
  ): Promise<MarketRepositoryReadResult> {
    const snapshot = this.repository.getSnapshot(context);
    const freshness = this.repository.getFreshness(context, marketSnapshotFields);

    if (snapshot && freshness.state === "Fresh") {
      this.repository.recordHit();
      return {
        fieldsRefreshed: [],
        freshness,
        repositorySnapshot: snapshot,
        source: "Repository",
      };
    }

    if (snapshot && freshness.state === "Stale") {
      this.repository.recordHit();
      this.refreshFields(context, freshness.staleFields).catch(() => undefined);

      return {
        fieldsRefreshed: [],
        freshness,
        repositorySnapshot: snapshot,
        source: "RepositoryStale",
      };
    }

    this.repository.recordMiss();
    const fieldsToRefresh = snapshot
      ? [...freshness.missingFields, ...freshness.expiredFields]
      : marketSnapshotFields;
    const refreshed = await this.refreshFields(context, fieldsToRefresh);

    return {
      fieldsRefreshed: getProviderBackedFields(fieldsToRefresh),
      freshness: this.repository.getFreshness(context, marketSnapshotFields),
      repositorySnapshot: refreshed,
      source: "Provider",
    };
  }

  async refreshFields(
    context: MarketSnapshotRequestContext,
    fields: MarketSnapshotField[],
  ) {
    const fieldsToRefresh = getProviderBackedFields(fields);
    const startedAt = Date.now();
    const providerSnapshots = await this.fetchProviderSnapshots(
      context,
      fieldsToRefresh,
    );
    const validatedSnapshots = providerSnapshots
      .map((snapshot) => ({
        snapshot,
        validation: marketTruthEngine.evaluate({
          context,
          snapshot,
        }),
      }))
      .filter((result) => result.validation.report.valid);

    if (validatedSnapshots.length === 0) {
      throw new Error(
        "Provider response rejected: no valid market evidence was available.",
      );
    }

    const primarySnapshot = validatedSnapshots[0].snapshot;

    return this.repository.upsertSnapshot({
      context,
      refresh: {
        evidence: validatedSnapshots.flatMap((result) => result.validation.evidence),
        fields: fieldsToRefresh,
        providerId: primarySnapshot.providerId,
        refreshedAt: new Date().toISOString(),
        refreshTimeMs: Date.now() - startedAt,
        values: mapProviderSnapshotToValues(primarySnapshot),
      },
    });
  }

  private async fetchProviderSnapshots(
    context: MarketSnapshotRequestContext,
    fields: MarketSnapshotField[],
  ) {
    const snapshots: MarketSnapshot[] = [];
    const visitedProviders = new Set<object>();

    if (
      context.cardIdentity &&
      !visitedProviders.has(this.justTcgProvider) &&
      canProviderAnswerAnyMarketField({
        fields,
        providerIdOrName: "justtcg",
      })
    ) {
      visitedProviders.add(this.justTcgProvider);
      const justTcgSnapshot = await this.justTcgProvider.getMarketSnapshot({
        cardName: context.cardIdentity,
        condition: context.condition,
        game: context.game,
        printingId: context.printingId,
        variantId: context.variantId,
      });

      if (justTcgSnapshot.prices.length > 0 && !justTcgSnapshot.priceMissing) {
        snapshots.push(justTcgSnapshot);
      }
    }

    if (
      !visitedProviders.has(this.tcgplayerProvider) &&
      canProviderAnswerAnyMarketField({
        fields,
        providerIdOrName: "tcgplayer",
      })
    ) {
      visitedProviders.add(this.tcgplayerProvider);
      const tcgplayerSnapshot = await this.tcgplayerProvider.getMarketSnapshot(
        context.printingId,
        context.variantId,
      );

      if (tcgplayerSnapshot.prices.length > 0 && !tcgplayerSnapshot.priceMissing) {
        snapshots.push(tcgplayerSnapshot);
      }
    }

    if (
      !visitedProviders.has(this.scryfallProvider) &&
      canProviderAnswerAnyMarketField({
        fields,
        providerIdOrName: "scryfall-market",
      })
    ) {
      visitedProviders.add(this.scryfallProvider);
      const scryfallSnapshot = await this.scryfallProvider.getMarketSnapshot(
        context.printingId,
        context.variantId,
      );

      if (scryfallSnapshot.prices.length > 0 && !scryfallSnapshot.priceMissing) {
        snapshots.push(scryfallSnapshot);
      }
    }

    return snapshots;
  }
}

export const marketRefreshScheduler = new MarketRefreshScheduler();
