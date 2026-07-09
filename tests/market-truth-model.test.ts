import assert from "node:assert/strict";
import test from "node:test";
import { marketTruthEngine } from "@/lib/market/MarketTruthEngine";
import { classifyProviderPrice } from "@/lib/market/ProviderPricingClassifier";
import type { MarketSnapshotRequestContext } from "@/lib/market/MarketIntelligenceRepository";
import type { MarketSnapshot } from "@/types/marketSnapshot";

const knownCards = [
  "Mox Opal",
  "Chrome Mox",
  "Black Lotus",
  "Lightning Bolt",
  "Collected Company",
  "Urza's Saga",
];

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function createContext(cardName: string): MarketSnapshotRequestContext {
  const slug = slugify(cardName);

  return {
    cardIdentity: cardName,
    collectorNumber: "123",
    condition: "NM",
    finish: "Nonfoil",
    game: "Magic",
    language: "English",
    printingId: `${slug}-printing`,
    variantId: `${slug}-printing:nonfoil`,
  };
}

function createSnapshot(context: MarketSnapshotRequestContext): MarketSnapshot {
  const updatedAt = "2026-07-09T00:00:00.000Z";

  return {
    printingId: context.printingId,
    variantId: context.variantId,
    prices: [
      {
        id: `provider:${context.printingId}:market`,
        cardId: context.printingId,
        printingId: context.printingId,
        variantId: context.variantId,
        providerId: "tcgplayer",
        source: "TCGplayer Market Price",
        currency: "USD",
        finish: "Normal",
        price: 100,
        priceType: "market_estimate",
        updatedAt,
        confidence: 91,
      },
      {
        id: `provider:${context.printingId}:lowest`,
        cardId: context.printingId,
        printingId: context.printingId,
        variantId: context.variantId,
        providerId: "tcgplayer",
        source: "TCGplayer Lowest Listing",
        currency: "USD",
        finish: "Normal",
        price: 96,
        priceType: "lowest_known",
        updatedAt,
        confidence: 86,
      },
    ],
    providerId: "tcgplayer",
    updatedAt,
    sourceLabel: "TCGplayer Market Intelligence",
    rawObservations: [
      {
        observedAt: updatedAt,
        providerField: "variant.price",
        providerName: "TCGplayer",
        rawValue: 100,
        unit: "USD",
      },
    ],
    identityEvidence: {
      canonicalName: context.cardIdentity,
      collectorNumber: context.collectorNumber,
      condition: "Near Mint",
      finish: "Normal",
      game: "Magic: The Gathering",
      language: context.language,
      productIdentifier: `${context.printingId}:sku`,
      providerTimestamp: updatedAt,
    },
    marketIntelligence: {
      apiStatus: "LIVE",
      demandMomentum: 65,
      directLow: null,
      evidenceCoverage: 90,
      healthStatus: "HEALTHY",
      inventoryHealth: 18,
      lastSynchronizedAt: updatedAt,
      latencyMs: 12,
      liquidity: 72,
      listingCount: 18,
      lowestListing: 96,
      marketConfidence: 91,
      marketPrice: 100,
      marketStability: 88,
      priceHistory: [],
      providerId: "tcgplayer",
      providerName: "TCGplayer",
      recentSalesCount: 4,
      salesVelocity: 65,
      spread: 4,
      trend: "Stable",
      volatility: 12,
    },
    priceMissing: false,
  };
}

test("Market Truth Model validates known card provider evidence", () => {
  knownCards.forEach((cardName) => {
    const context = createContext(cardName);
    const result = marketTruthEngine.evaluate({
      context,
      snapshot: createSnapshot(context),
    });

    assert.equal(result.report.valid, true);
    assert.deepEqual(result.report.rejectedFields, []);
    assert.ok(result.report.matchedPriceType.includes("Market Price"));
    assert.ok(result.report.matchedPriceType.includes("Lowest Listing"));
    assert.ok(result.evidence.length >= 8);
    assert.ok(result.evidence.every((evidence) => evidence.providerName));
    assert.ok(result.evidence.every((evidence) => evidence.retrievedAt));
    assert.ok(
      result.evidence.some((evidence) =>
        evidence.rawObservations?.some(
          (observation) => observation.providerField === "variant.price",
        ),
      ),
    );
    assert.ok(result.evidence.every((evidence) => evidence.confidence.coverage > 0));
    assert.ok(result.evidence.every((evidence) => evidence.confidence.confidence > 0));
  });
});

test("Market Truth Model rejects mismatched printing evidence", () => {
  const context = createContext("Mox Opal");
  const snapshot = {
    ...createSnapshot(context),
    printingId: "wrong-printing",
  };
  const result = marketTruthEngine.evaluate({ context, snapshot });

  assert.equal(result.report.valid, false);
  assert.ok(result.report.rejectedFields.includes("Printing"));
  assert.deepEqual(result.evidence, []);
});

test("Provider price classifier maps provider fields into business labels", () => {
  assert.equal(
    classifyProviderPrice({ priceType: "market_estimate", label: "Market" }),
    "Market Price",
  );
  assert.equal(
    classifyProviderPrice({ priceType: "lowest_known", label: "Lowest NM Listing" }),
    "Lowest NM Listing",
  );
  assert.equal(
    classifyProviderPrice({ priceType: "recent_sale", label: "Recent Sale" }),
    "Recent Sale",
  );
  assert.equal(classifyProviderPrice({ label: "Direct Low" }), "Direct Price");
  assert.equal(classifyProviderPrice({ label: "Suggested" }), "Suggested Price");
  assert.equal(classifyProviderPrice({ label: "Unmapped" }), "Unknown");
});
