import fs from "node:fs";
import path from "node:path";
import type {
  MarketIntelligenceRepositorySnapshot,
  MarketSnapshotFieldValues,
  MarketSnapshotRefresh,
} from "@/lib/market/MarketSnapshot";
import type {
  MarketSnapshotField,
  MarketSnapshotFieldMetadata,
} from "@/lib/market/MarketSnapshotMetadata";
import { getSnapshotFreshness } from "@/lib/market/MarketFreshness";
import {
  getMarketRefreshPolicy,
  marketSnapshotFields,
} from "@/lib/market/MarketRefreshPolicy";
import { marketEvidenceLayer } from "@/lib/market/MarketEvidenceLayer";
import { calculateEvidenceCoverage } from "@/lib/market/EvidenceCoverage";
import {
  createEmptyMarketRepositoryStatistics,
  type MarketRepositoryStatistics,
} from "@/lib/market/MarketRepositoryStatistics";
import type { MarketRepositoryDiagnostics } from "@/lib/market/MarketRepositoryDiagnostics";
import { validateMarketSnapshot } from "@/lib/market/MarketSnapshotValidator";

export interface MarketSnapshotRequestContext {
  cardIdentity: string;
  collectorNumber?: string;
  condition?: string;
  finish?: string;
  game?: string;
  language?: string;
  printingId: string;
  variantId: string;
  gameplayIdentityId?: string;
  marketIdentityId?: string;
  physicalVariantIdentityId?: string;
  printingIdentityId?: string;
}

type StoredRepository = {
  refreshDurations: number[];
  snapshots: Record<string, MarketIntelligenceRepositorySnapshot>;
  statistics: MarketRepositoryStatistics;
};

const repositoryFileName = ".market-intelligence-repository.json";

function createEmptyStore(): StoredRepository {
  return {
    refreshDurations: [],
    snapshots: {},
    statistics: createEmptyMarketRepositoryStatistics(),
  };
}

function getRepositoryPath() {
  return path.join(process.cwd(), repositoryFileName);
}

export function createMarketSnapshotKey(input: {
  condition?: string;
  printingId: string;
  variantId: string;
}) {
  return [
    input.printingId,
    input.variantId,
    input.condition ?? "NM",
  ].join("::");
}

function createMissingFieldMetadata(
  field: MarketSnapshotField,
): MarketSnapshotFieldMetadata {
  const policy = getMarketRefreshPolicy(field);

  return {
    field,
    freshness: "Missing",
    lastRefresh: null,
    expiresAt: null,
    ttlMs: policy.ttlMs,
  };
}

function createFieldMetadata(input: {
  field: MarketSnapshotField;
  refreshedAt: string;
}) {
  const policy = getMarketRefreshPolicy(input.field);
  const expiresAt = new Date(
    new Date(input.refreshedAt).getTime() + policy.ttlMs,
  ).toISOString();

  return {
    field: input.field,
    freshness: "Fresh" as const,
    lastRefresh: input.refreshedAt,
    expiresAt,
    ttlMs: policy.ttlMs,
  };
}

function createFieldMetadataRecord() {
  return Object.fromEntries(
    marketSnapshotFields.map((field) => [field, createMissingFieldMetadata(field)]),
  ) as MarketIntelligenceRepositorySnapshot["metadata"]["fieldMetadata"];
}

function getRepositoryExpiresAt(
  fieldMetadata: MarketIntelligenceRepositorySnapshot["metadata"]["fieldMetadata"],
) {
  const expirations = Object.values(fieldMetadata)
    .map((metadata) => metadata.expiresAt)
    .filter((value): value is string => Boolean(value));

  return expirations.length
    ? new Date(
        Math.max(...expirations.map((value) => new Date(value).getTime())),
      ).toISOString()
    : new Date(0).toISOString();
}

function applyFieldValues(
  snapshot: MarketIntelligenceRepositorySnapshot,
  values: MarketSnapshotFieldValues,
  fields: MarketSnapshotField[],
) {
  const next = { ...snapshot };

  fields.forEach((field) => {
    if (field === "marketPrice" && "marketPrice" in values) {
      next.marketPrice = values.marketPrice ?? null;
    }

    if (field === "lowestListing" && "lowestListing" in values) {
      next.lowestListing = values.lowestListing ?? null;
    }

    if (field === "listingCount" && "listingCount" in values) {
      next.listingCount = values.listingCount ?? null;
    }

    if (field === "recentSales" && "recentSales" in values) {
      next.recentSales = values.recentSales ?? null;
    }

    if (field === "spread" && "spread" in values) {
      next.spread = values.spread ?? null;
    }

    if (field === "liquidity" && "liquidity" in values) {
      next.liquidity = values.liquidity ?? null;
    }

    if (field === "salesVelocity" && "salesVelocity" in values) {
      next.salesVelocity = values.salesVelocity ?? null;
    }

    if (field === "volatility" && "volatility" in values) {
      next.volatility = values.volatility ?? null;
    }

    if (field === "marketConfidence" && "marketConfidence" in values) {
      next.marketConfidence = values.marketConfidence ?? null;
    }
  });

  return next;
}

export class MarketIntelligenceRepository {
  private store: StoredRepository;

  constructor(private readonly storagePath = getRepositoryPath()) {
    this.store = this.load();
  }

  getSnapshot(context: MarketSnapshotRequestContext) {
    const key = createMarketSnapshotKey(context);

    return this.store.snapshots[key] ?? null;
  }

  recordHit() {
    this.store.statistics.cacheHits += 1;
    this.store.statistics.apiCallsSaved += 1;
    this.persist();
  }

  recordMiss() {
    this.store.statistics.cacheMisses += 1;
    this.persist();
  }

  getFreshness(context: MarketSnapshotRequestContext, fields = marketSnapshotFields) {
    return getSnapshotFreshness(this.getSnapshot(context), fields);
  }

  upsertSnapshot(input: {
    context: MarketSnapshotRequestContext;
    refresh: MarketSnapshotRefresh;
  }) {
    const now = input.refresh.refreshedAt;
    const key = createMarketSnapshotKey(input.context);
    const existing = this.store.snapshots[key];
    const fieldMetadata = existing?.metadata.fieldMetadata ?? createFieldMetadataRecord();
    const updatedFieldMetadata = {
      ...fieldMetadata,
    };

    input.refresh.fields.forEach((field) => {
      updatedFieldMetadata[field] = createFieldMetadata({
        field,
        refreshedAt: now,
      });
    });

    const base: MarketIntelligenceRepositorySnapshot = existing ?? {
      evidence: [],
      evidenceCoverage: {},
      evidenceSelections: {},
      identity: {
        cardIdentity: input.context.cardIdentity,
        condition: input.context.condition ?? "NM",
        finish: input.context.finish ?? "Unknown",
        printingId: input.context.printingId,
        variantId: input.context.variantId,
      },
      listingCount: null,
      liquidity: null,
      lowestListing: null,
      marketConfidence: null,
      marketPrice: null,
      providerId: input.refresh.providerId,
      recentSales: null,
      salesVelocity: null,
      spread: null,
      volatility: null,
      metadata: {
        createdAt: now,
        expiresAt: now,
        fieldMetadata: updatedFieldMetadata,
        lastRefresh: now,
        provider: input.refresh.providerId,
        snapshotVersion: "1.0.0",
        updatedAt: now,
      },
    };
    const layeredEvidence = marketEvidenceLayer.apply({
      existingEvidence: base.evidence ?? [],
      incomingEvidence: input.refresh.evidence,
      fields: marketSnapshotFields,
      now: new Date(now),
    });
    const next = applyFieldValues(
      {
        ...base,
        evidence: layeredEvidence.evidenceStack,
        evidenceCoverage: layeredEvidence.coverage,
        evidenceSelections: layeredEvidence.selections,
        providerId: input.refresh.providerId,
        metadata: {
          ...base.metadata,
          fieldMetadata: updatedFieldMetadata,
          lastRefresh: now,
          provider: input.refresh.providerId,
          updatedAt: now,
        },
      },
      layeredEvidence.selectedValues,
      marketSnapshotFields,
    );

    next.metadata.expiresAt = getRepositoryExpiresAt(next.metadata.fieldMetadata);

    const validationMessages = validateMarketSnapshot(next);

    if (validationMessages.length > 0) {
      throw new Error(validationMessages.join(" "));
    }

    this.store.snapshots[key] = next;
    this.store.statistics.providerCalls += 1;
    this.store.statistics.repositorySize = Object.keys(this.store.snapshots).length;
    this.store.refreshDurations = [
      ...this.store.refreshDurations.slice(-19),
      input.refresh.refreshTimeMs,
    ];
    this.store.statistics.averageRefreshTimeMs =
      this.store.refreshDurations.reduce((sum, value) => sum + value, 0) /
      this.store.refreshDurations.length;
    this.store.statistics.averageSnapshotAgeMs = this.calculateAverageSnapshotAge();
    this.persist();

    return next;
  }

  getStatistics(): MarketRepositoryStatistics {
    this.store.statistics.repositorySize = Object.keys(this.store.snapshots).length;
    this.store.statistics.averageSnapshotAgeMs = this.calculateAverageSnapshotAge();

    return this.store.statistics;
  }

  getDiagnostics(): MarketRepositoryDiagnostics {
    const snapshots = Object.values(this.store.snapshots);
    const statistics = this.getStatistics();
    const providerUsage: Record<string, number> = {};

    snapshots.forEach((snapshot) => {
      providerUsage[snapshot.providerId] = (providerUsage[snapshot.providerId] ?? 0) + 1;
    });

    const updatedTimes = snapshots.map((snapshot) =>
      new Date(snapshot.metadata.updatedAt).getTime(),
    );
    const cacheHitRate =
      statistics.cacheHits + statistics.cacheMisses > 0
        ? statistics.cacheHits / (statistics.cacheHits + statistics.cacheMisses)
        : 0;

    return {
      averageFreshness: this.calculateAverageFreshness(),
      cacheHitRate,
      evidenceCoverage: calculateEvidenceCoverage(
        snapshots.flatMap((snapshot) => snapshot.evidence ?? []),
      ),
      estimatedApiCostSaved: statistics.apiCallsSaved,
      health: snapshots.length ? "Healthy" : "Empty",
      newestSnapshot: updatedTimes.length
        ? new Date(Math.max(...updatedTimes)).toISOString()
        : null,
      oldestSnapshot: updatedTimes.length
        ? new Date(Math.min(...updatedTimes)).toISOString()
        : null,
      providerUsage,
      statistics,
    };
  }

  private calculateAverageSnapshotAge() {
    const snapshots = Object.values(this.store.snapshots);

    if (snapshots.length === 0) {
      return 0;
    }

    const now = Date.now();

    return snapshots.reduce(
      (sum, snapshot) =>
        sum + Math.max(0, now - new Date(snapshot.metadata.updatedAt).getTime()),
      0,
    ) / snapshots.length;
  }

  private calculateAverageFreshness() {
    const snapshots = Object.values(this.store.snapshots);

    if (snapshots.length === 0) {
      return 0;
    }

    const freshFields = snapshots.reduce((sum, snapshot) => {
      const freshness = getSnapshotFreshness(snapshot, marketSnapshotFields);

      return sum + freshness.freshFields.length;
    }, 0);

    return freshFields / (snapshots.length * marketSnapshotFields.length);
  }

  private load(): StoredRepository {
    try {
      if (!fs.existsSync(this.storagePath)) {
        return createEmptyStore();
      }

      return JSON.parse(fs.readFileSync(this.storagePath, "utf8")) as StoredRepository;
    } catch {
      return createEmptyStore();
    }
  }

  private persist() {
    fs.writeFileSync(this.storagePath, JSON.stringify(this.store, null, 2));
  }
}

export const marketIntelligenceRepository = new MarketIntelligenceRepository();
