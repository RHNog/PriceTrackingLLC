import assert from "node:assert/strict";
import test from "node:test";
import { createCardProfile } from "@/lib/engines/cardIntelligence/CardIntelligenceEngine";
import {
  createAssetIntelligenceModels,
  getRegisteredIntelligenceModels,
} from "@/lib/intelligence/framework/AssetIntelligenceFramework";
import { indicatorRegistry } from "@/lib/intelligence/framework/IndicatorRegistry";
import { createConditionMarketSnapshot } from "@/lib/engines/market/createConditionMarketSnapshot";
import { findConditionProfile } from "@/types/conditionProfile";
import { defaultMarketContext } from "@/types/MarketContext";
import type { Card } from "@/types/card";
import type { MarketPrice } from "@/types/marketPrice";
import type { PrintingVariant } from "@/types/printingVariant";

const testCard: Card = {
  id: "asset-test-card",
  name: "Chrome Mox",
  game: "Magic",
  set: "Mirrodin",
  setCode: "MRD",
  number: "152",
  rarity: "Rare",
  finish: "Nonfoil",
  imageUrl: "https://example.com/chrome-mox.jpg",
};

const testVariant: PrintingVariant = {
  id: "asset-test-card:nonfoil",
  printingId: testCard.id,
  finish: "Nonfoil",
  isAvailable: true,
  source: "Test",
};

const marketPrice: MarketPrice = {
  id: "asset-test-market",
  cardId: testCard.id,
  printingId: testCard.id,
  variantId: testVariant.id,
  providerId: "scryfall-market",
  source: "Test market estimate",
  currency: "USD",
  finish: "Nonfoil",
  price: 100,
  priceType: "market_estimate",
  updatedAt: "2026-07-08T00:00:00.000Z",
  confidence: 70,
};

function createProfile() {
  return createCardProfile({
    condition: findConditionProfile("NM"),
    marketContext: defaultMarketContext,
    marketContextSnapshot: createConditionMarketSnapshot(marketPrice, "NM"),
    printing: testCard,
    variant: testVariant,
  });
}

test("registers current and future intelligence models", () => {
  const modelIds = getRegisteredIntelligenceModels().map((model) => model.id);

  assert.ok(modelIds.includes("market-intelligence"));
  assert.ok(modelIds.includes("collector-intelligence"));
  assert.ok(modelIds.includes("investment-intelligence"));
  assert.ok(modelIds.includes("liquidity-intelligence"));
  assert.ok(modelIds.includes("reprint-risk"));
  assert.ok(modelIds.includes("market-confidence"));
  assert.ok(modelIds.includes("playability-intelligence"));
  assert.ok(modelIds.includes("grading-intelligence"));
  assert.ok(modelIds.includes("regional-intelligence"));
  assert.ok(modelIds.includes("behavior-intelligence"));
  assert.ok(modelIds.includes("historical-intelligence"));
  assert.ok(modelIds.includes("volatility-intelligence"));
  assert.ok(modelIds.includes("demand-intelligence"));
  assert.ok(modelIds.includes("scarcity-intelligence"));
});

test("registers indicator metadata with version, status, and sources", () => {
  assert.ok(indicatorRegistry.length > 0);
  assert.ok(indicatorRegistry.every((indicator) => indicator.version));
  assert.ok(indicatorRegistry.every((indicator) => indicator.status));
  assert.ok(
    indicatorRegistry.every(
      (indicator) =>
        indicator.dataSources.length > 0 ||
        indicator.futureDependencies.length > 0,
    ),
  );
});

test("creates intelligence models with confidence and dependency graph", () => {
  const profile = createProfile();
  const models = createAssetIntelligenceModels(profile);
  const collector = models.find((model) => model.id === "collector-intelligence");

  assert.ok(collector);
  assert.ok(collector.confidence >= 0);
  assert.ok(collector.dependencyGraph.includes("Scryfall"));
  assert.ok(collector.indicators.length > 0);
});

test("future placeholder models remain registered without provider data", () => {
  const profile = createProfile();
  const models = createAssetIntelligenceModels(profile);
  const regional = models.find((model) => model.id === "regional-intelligence");

  assert.equal(regional?.status, "WAITING_FOR_PROVIDER");
  assert.equal(regional?.health, "Missing Data");
  assert.ok(regional?.dependencyGraph.includes("Future Providers"));
});

test("card profile exposes framework outputs for Vendor Workspace compatibility", () => {
  const profile = createProfile();

  assert.ok(profile.intelligenceModels.length > 0);
  assert.ok(
    profile.intelligenceModels.some((model) =>
      model.indicators.some((indicator) => indicator.id === "collector-appeal"),
    ),
  );
});
