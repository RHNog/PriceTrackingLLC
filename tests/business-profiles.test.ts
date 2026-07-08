import assert from "node:assert/strict";
import test from "node:test";
import { defaultBusinessProfiles } from "@/lib/business/BusinessDefaults";
import { evaluatePurchase } from "@/lib/engines/evaluation/evaluatePurchase";
import { defaultMarketContext } from "@/types/MarketContext";
import type { Card } from "@/types/card";
import type { MarketPrice } from "@/types/marketPrice";
import type { PrintingVariant } from "@/types/printingVariant";
import type { StrategyProfile } from "@/types/strategyProfile";
import { seedStrategyProfiles } from "@/data/seedStrategies";

const testCard: Card = {
  id: "business-test-card",
  name: "Chrome Mox",
  game: "Magic",
  set: "Double Masters",
  setCode: "2XM",
  number: "234",
  rarity: "Mythic",
  finish: "Nonfoil",
  imageUrl: "https://example.com/chrome-mox.jpg",
};

const testVariant: PrintingVariant = {
  id: "business-test-card:nonfoil",
  printingId: testCard.id,
  finish: "Nonfoil",
  isAvailable: true,
  source: "Test",
};

const testMarketPrice: MarketPrice = {
  id: "business-test-market",
  cardId: testCard.id,
  printingId: testCard.id,
  variantId: testVariant.id,
  providerId: "scryfall-market",
  source: "Test market estimate",
  currency: "USD",
  finish: "Nonfoil",
  price: 302,
  priceType: "market_estimate",
  updatedAt: "2026-07-08T00:00:00.000Z",
  confidence: 80,
};

const strategyProfile = seedStrategyProfiles.find(
  (profile) => profile.id === "custom-profile",
) as StrategyProfile;

function getBusinessProfile(id: string) {
  const profile = defaultBusinessProfiles.find((item) => item.id === id);

  assert.ok(profile);

  return profile;
}

function evaluateWithBusinessProfile(businessProfileId: string) {
  return evaluatePurchase({
    businessProfile: getBusinessProfile(businessProfileId),
    card: testCard,
    condition: "NM",
    marketContext: defaultMarketContext,
    marketPrice: testMarketPrice,
    purchasePrice: 190,
    selectedVariant: testVariant,
    strategyProfile,
  });
}

test("same card and market can produce different business-aware outcomes", () => {
  const cashOnly = evaluateWithBusinessProfile("cash-only");
  const onlineMarketplace = evaluateWithBusinessProfile("online-marketplace");

  assert.equal(cashOnly.status, "READY");
  assert.equal(onlineMarketplace.status, "READY");
  assert.notEqual(
    cashOnly.negotiationLadder.maximumBuyPrice,
    onlineMarketplace.negotiationLadder.maximumBuyPrice,
  );
  assert.notEqual(cashOnly.estimatedProfit, onlineMarketplace.estimatedProfit);
  assert.notEqual(cashOnly.roi, onlineMarketplace.roi);
  assert.notEqual(cashOnly.decision.action, onlineMarketplace.decision.action);
  assert.equal(cashOnly.businessProfile.id, "cash-only");
  assert.equal(onlineMarketplace.businessProfile.id, "online-marketplace");
});

test("switching Business Profile regenerates evaluation without changing the card", () => {
  const primeTime = evaluateWithBusinessProfile("prime-time-retail");
  const convention = evaluateWithBusinessProfile("convention-buying");

  assert.equal(primeTime.status, "READY");
  assert.equal(convention.status, "READY");
  assert.equal(primeTime.selectedPrinting.id, convention.selectedPrinting.id);
  assert.equal(primeTime.selectedVariant.id, convention.selectedVariant.id);
  assert.notEqual(
    primeTime.negotiationLadder.maximumBuyPrice,
    convention.negotiationLadder.maximumBuyPrice,
  );
  assert.ok(
    primeTime.negotiationLadder.explanation.some((line) =>
      line.includes(primeTime.businessProfile.name),
    ),
  );
  assert.ok(
    convention.negotiationLadder.explanation.some((line) =>
      line.includes(convention.businessProfile.name),
    ),
  );
});

