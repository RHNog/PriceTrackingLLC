import assert from "node:assert/strict";
import test from "node:test";
import { createCardProfile } from "@/lib/engines/cardIntelligence/CardIntelligenceEngine";
import { createConditionMarketSnapshot } from "@/lib/engines/market/createConditionMarketSnapshot";
import { evaluateEvidenceSufficiency } from "@/lib/intelligence/framework/EvidenceSufficiencyEngine";
import type { EvidenceRequirement } from "@/lib/intelligence/framework/EvidenceRequirement";
import type { Indicator } from "@/lib/intelligence/framework/Indicator";
import { findConditionProfile } from "@/types/conditionProfile";
import { defaultMarketContext } from "@/types/MarketContext";
import type { Card } from "@/types/card";
import type { MarketPrice } from "@/types/marketPrice";
import type { PrintingVariant } from "@/types/printingVariant";

const testCard: Card = {
  id: "evidence-chrome-mox",
  name: "Chrome Mox",
  game: "Magic",
  set: "Mirrodin",
  number: "152",
  rarity: "Rare",
  finish: "Nonfoil",
  imageUrl: "https://example.com/chrome-mox.jpg",
  legalities: {
    commander: "legal",
    legacy: "legal",
    modern: "banned",
    vintage: "restricted",
  },
};

const testVariant: PrintingVariant = {
  id: "evidence-chrome-mox:nonfoil",
  printingId: testCard.id,
  finish: "Nonfoil",
  isAvailable: true,
  source: "Test",
};

const marketPrice: MarketPrice = {
  id: "evidence-market",
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

test("Playability without EDHREC returns Unknown evidence state", () => {
  const profile = createProfile();
  const playability = profile.intelligenceModels.find(
    (model) => model.id === "playability-intelligence",
  );

  assert.ok(playability);
  assert.equal(playability.evidenceReport.status, "INSUFFICIENT");
  assert.ok(playability.confidence < 30);
  assert.ok(
    playability.evidenceReport.missingEvidence.some(
      (requirement) => requirement.id === "demand-provider",
    ),
  );
});

test("Certification without PSA population data returns Unknown evidence state", () => {
  const profile = createProfile();
  const certification = profile.intelligenceModels.find(
    (model) => model.id === "certification-intelligence",
  );

  assert.ok(certification);
  assert.equal(certification.evidenceReport.status, "INSUFFICIENT");
  assert.ok(certification.confidence < 30);
  assert.ok(
    certification.evidenceReport.missingEvidence.some(
      (requirement) => requirement.id === "population",
    ),
  );
});

test("Collector with sufficient evidence generates normally", () => {
  const profile = createProfile();
  const collector = profile.intelligenceModels.find(
    (model) => model.id === "collector-intelligence",
  );

  assert.ok(collector);
  assert.notEqual(collector.evidenceReport.status, "INSUFFICIENT");
  assert.ok(collector.confidence > 0);
});

test("Playability with sufficient mocked demand provider evidence can grade normally", () => {
  const indicators: Indicator[] = [
    {
      id: "format-diversity",
      name: "Format Diversity",
      confidence: 80,
      contributingFactors: ["Modern", "Commander"],
      dataSources: ["Scryfall"],
      explanation: "Format availability is known.",
      futureDependencies: [],
      lastUpdated: "2026-07-08T00:00:00.000Z",
      score: 80,
      status: "LIVE",
      version: "1.0.0",
    },
    {
      id: "commander-strength",
      name: "Commander Strength",
      confidence: 82,
      contributingFactors: ["EDHREC"],
      dataSources: ["EDHREC"],
      explanation: "Commander demand is provider-backed.",
      futureDependencies: [],
      lastUpdated: "2026-07-08T00:00:00.000Z",
      score: 84,
      status: "LIVE",
      version: "1.0.0",
    },
  ];
  const requirements: EvidenceRequirement[] = [
    {
      id: "format-availability",
      label: "Format availability",
      type: "REQUIRED",
      indicatorIds: ["format-diversity"],
      acceptedDataSources: ["Scryfall"],
      minimumConfidence: 50,
    },
    {
      id: "demand-provider",
      label: "Provider-backed demand indicators",
      type: "REQUIRED",
      indicatorIds: ["commander-strength"],
      acceptedDataSources: ["EDHREC"],
      minimumConfidence: 70,
    },
  ];

  const report = evaluateEvidenceSufficiency({ indicators, requirements });

  assert.equal(report.status, "SUFFICIENT");
  assert.equal(report.missingEvidence.length, 0);
});
