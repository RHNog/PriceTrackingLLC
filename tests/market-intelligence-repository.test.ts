import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { MarketIntelligenceRepository } from "@/lib/market/MarketIntelligenceRepository";
import { MarketRefreshScheduler } from "@/lib/market/MarketRefreshScheduler";
import type { MarketSnapshot } from "@/types/marketSnapshot";

function createStoragePath() {
  return path.join(
    os.tmpdir(),
    `market-intelligence-repository-${Date.now()}-${Math.random()}.json`,
  );
}

function createProviderSnapshot(price: number): MarketSnapshot {
  const updatedAt = new Date().toISOString();

  return {
    printingId: "mox-opal-printing",
    variantId: "mox-opal-printing:nonfoil",
    prices: [
      {
        id: "provider-market-price",
        cardId: "mox-opal-printing",
        printingId: "mox-opal-printing",
        variantId: "mox-opal-printing:nonfoil",
        providerId: "tcgplayer",
        source: "TCGplayer Market Intelligence",
        currency: "USD",
        finish: "Nonfoil",
        price,
        priceType: "market_estimate",
        updatedAt,
        confidence: 88,
      },
    ],
    providerId: "tcgplayer",
    updatedAt,
    sourceLabel: "TCGplayer Market Intelligence",
    marketIntelligence: {
      apiStatus: "LIVE",
      demandMomentum: 72,
      directLow: null,
      evidenceCoverage: 88,
      healthStatus: "HEALTHY",
      inventoryHealth: 20,
      lastSynchronizedAt: updatedAt,
      latencyMs: 7,
      liquidity: 74,
      listingCount: 20,
      lowestListing: price - 2,
      marketConfidence: 88,
      marketPrice: price,
      marketStability: 90,
      priceHistory: [],
      providerId: "tcgplayer",
      providerName: "TCGplayer",
      recentSalesCount: 4,
      salesVelocity: 72,
      spread: 2,
      trend: "Stable",
      volatility: 10,
    },
    rawObservations: [
      {
        observedAt: updatedAt,
        providerField: "variant.price",
        providerName: "TCGplayer",
        rawValue: price,
        unit: "USD",
      },
      {
        observedAt: updatedAt,
        providerField: "variant.priceHistory[0].p",
        providerName: "TCGplayer",
        rawValue: price - 1,
        unit: "USD",
      },
    ],
    priceMissing: false,
  };
}

function createScryfallSnapshot(price: number): MarketSnapshot {
  const updatedAt = new Date().toISOString();

  return {
    printingId: "mox-opal-printing",
    variantId: "mox-opal-printing:nonfoil",
    prices: [
      {
        id: "scryfall-market-price",
        cardId: "mox-opal-printing",
        printingId: "mox-opal-printing",
        variantId: "mox-opal-printing:nonfoil",
        providerId: "scryfall-market",
        source: "Scryfall Daily Market Estimate",
        currency: "USD",
        finish: "Nonfoil",
        price,
        priceType: "market_estimate",
        updatedAt,
        confidence: 70,
      },
    ],
    providerId: "scryfall-market",
    updatedAt,
    sourceLabel: "Scryfall Daily Market Estimate",
    priceMissing: false,
  };
}

test("Market Intelligence Repository prevents repeated provider calls while fields are fresh", async () => {
  const storagePath = createStoragePath();
  const repository = new MarketIntelligenceRepository(storagePath);
  let providerCalls = 0;
  const provider = {
    async getMarketSnapshot() {
      providerCalls += 1;
      return createProviderSnapshot(100 + providerCalls);
    },
  };
  const scheduler = new MarketRefreshScheduler(
    repository,
    provider,
    provider,
    provider,
  );
  const context = {
    cardIdentity: "Mox Opal",
    condition: "NM",
    finish: "Nonfoil",
    game: "Magic",
    printingId: "mox-opal-printing",
    variantId: "mox-opal-printing:nonfoil",
  };
  const first = await scheduler.getSnapshot(context);
  const second = await scheduler.getSnapshot(context);

  assert.equal(first.source, "Provider");
  assert.equal(second.source, "Repository");
  assert.equal(providerCalls, 1);
  assert.equal(second.repositorySnapshot.marketPrice, 101);
  assert.equal(repository.getStatistics().apiCallsSaved, 1);

  fs.rmSync(storagePath, { force: true });
});

test("Market Intelligence Repository refreshes only expired fields", async () => {
  const storagePath = createStoragePath();
  const repository = new MarketIntelligenceRepository(storagePath);
  let providerCalls = 0;
  const provider = {
    async getMarketSnapshot() {
      providerCalls += 1;
      return createProviderSnapshot(120);
    },
  };
  const scheduler = new MarketRefreshScheduler(
    repository,
    provider,
    provider,
    provider,
  );
  const context = {
    cardIdentity: "Mox Opal",
    condition: "NM",
    finish: "Nonfoil",
    game: "Magic",
    printingId: "mox-opal-printing",
    variantId: "mox-opal-printing:nonfoil",
  };

  await scheduler.getSnapshot(context);

  const cached = repository.getSnapshot(context);
  assert.ok(cached);
  cached.metadata.fieldMetadata.lowestListing.expiresAt = new Date(0).toISOString();

  const refreshed = await scheduler.getSnapshot(context);

  assert.equal(providerCalls, 2);
  assert.deepEqual(refreshed.fieldsRefreshed, ["lowestListing"]);
  assert.equal(
    refreshed.repositorySnapshot.metadata.fieldMetadata.marketPrice.lastRefresh,
    cached.metadata.fieldMetadata.marketPrice.lastRefresh,
  );
  assert.notEqual(
    refreshed.repositorySnapshot.metadata.fieldMetadata.lowestListing.lastRefresh,
    new Date(0).toISOString(),
  );

  fs.rmSync(storagePath, { force: true });
});

test("Market refresh skips providers that cannot answer requested evidence domains", async () => {
  const storagePath = createStoragePath();
  const repository = new MarketIntelligenceRepository(storagePath);
  let justTcgCalls = 0;
  let tcgplayerCalls = 0;
  let scryfallCalls = 0;
  const justTcgProvider = {
    async getMarketSnapshot() {
      justTcgCalls += 1;
      return createProviderSnapshot(100);
    },
  };
  const tcgplayerProvider = {
    async getMarketSnapshot() {
      tcgplayerCalls += 1;
      return createProviderSnapshot(98);
    },
  };
  const scryfallProvider = {
    async getMarketSnapshot() {
      scryfallCalls += 1;
      return createProviderSnapshot(97);
    },
  };
  const scheduler = new MarketRefreshScheduler(
    repository,
    justTcgProvider,
    tcgplayerProvider,
    scryfallProvider,
  );
  const context = {
    cardIdentity: "Mox Opal",
    condition: "NM",
    finish: "Nonfoil",
    game: "Magic",
    printingId: "mox-opal-printing",
    variantId: "mox-opal-printing:nonfoil",
  };

  await scheduler.refreshFields(context, ["lowestListing"]);

  assert.equal(justTcgCalls, 0);
  assert.equal(tcgplayerCalls, 1);
  assert.equal(scryfallCalls, 0);

  fs.rmSync(storagePath, { force: true });
});

test("Fresh Scryfall snapshot with missing Variant Valuation still calls JustTCG", async () => {
  const storagePath = createStoragePath();
  const repository = new MarketIntelligenceRepository(storagePath);
  let justTcgCalls = 0;
  let tcgplayerCalls = 0;
  let scryfallCalls = 0;
  const justTcgProvider = {
    async getMarketSnapshot() {
      justTcgCalls += 1;
      return createProviderSnapshot(125);
    },
  };
  const tcgplayerProvider = {
    async getMarketSnapshot() {
      tcgplayerCalls += 1;
      return createProviderSnapshot(124);
    },
  };
  const scryfallProvider = {
    async getMarketSnapshot() {
      scryfallCalls += 1;
      return createScryfallSnapshot(90);
    },
  };
  const scheduler = new MarketRefreshScheduler(
    repository,
    justTcgProvider,
    tcgplayerProvider,
    scryfallProvider,
  );
  const context = {
    cardIdentity: "Mox Opal",
    condition: "NM",
    finish: "Nonfoil",
    game: "Magic",
    printingId: "mox-opal-printing",
    variantId: "mox-opal-printing:nonfoil",
  };

  repository.upsertSnapshot({
    context,
    refresh: {
      evidence: [],
      fields: ["marketPrice"],
      providerId: "scryfall-market",
      refreshedAt: new Date().toISOString(),
      refreshTimeMs: 4,
      values: {},
    },
  });
  await scheduler.refreshFields(context, ["marketPrice"]);

  assert.equal(justTcgCalls, 1);
  assert.equal(tcgplayerCalls, 0);
  assert.equal(scryfallCalls, 0);

  fs.rmSync(storagePath, { force: true });
});
