import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { MarketIntelligenceEngine } from "@/lib/market/intelligence/MarketIntelligenceEngine";
import { MarketIntelligenceRepository } from "@/lib/market/MarketIntelligenceRepository";
import { marketTruthEngine } from "@/lib/market/MarketTruthEngine";
import { JustTCGProvider } from "@/lib/providers/justtcg/JustTCGProvider";
import type { MarketSnapshotRequestContext } from "@/lib/market/MarketIntelligenceRepository";

const replayCards = [
  "Mox Opal",
  "Chrome Mox",
  "Lightning Bolt",
  "Black Lotus",
  "Collected Company",
  "Urza's Saga",
];

async function withReplayEnv<T>(operation: () => Promise<T>) {
  const previousProviderMode = process.env.PROVIDER_MODE;
  const previousApiKey = process.env.JUSTTCG_API_KEY;

  process.env.PROVIDER_MODE = "REPLAY";
  process.env.JUSTTCG_API_KEY = "fixture-key";

  try {
    return await operation();
  } finally {
    if (previousProviderMode === undefined) {
      delete process.env.PROVIDER_MODE;
    } else {
      process.env.PROVIDER_MODE = previousProviderMode;
    }

    if (previousApiKey === undefined) {
      delete process.env.JUSTTCG_API_KEY;
    } else {
      process.env.JUSTTCG_API_KEY = previousApiKey;
    }
  }
}

function createStoragePath() {
  return path.join(
    os.tmpdir(),
    `market-intelligence-engine-${Date.now()}-${Math.random()}.json`,
  );
}

function createContext(cardName: string): MarketSnapshotRequestContext {
  const id = cardName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  return {
    cardIdentity: cardName,
    condition: "NM",
    finish: "Normal",
    game: "Magic: The Gathering",
    printingId: `${id}-printing`,
    variantId: `${id}-printing:normal`,
  };
}

async function createRepositorySnapshotFromReplay(cardName: string) {
  return withReplayEnv(async () => {
    const storagePath = createStoragePath();
    const repository = new MarketIntelligenceRepository(storagePath);
    const provider = new JustTCGProvider(() => {
      throw new Error("Live JustTCG SDK should not be instantiated in replay tests.");
    });
    const context = createContext(cardName);
    const providerSnapshot = await provider.getMarketSnapshot({
      cardName,
      game: "Magic: The Gathering",
      printingId: context.printingId,
      variantId: context.variantId,
    });
    const validation = marketTruthEngine.evaluate({
      context,
      snapshot: providerSnapshot,
    });

    assert.equal(validation.report.valid, true);

    const repositorySnapshot = repository.upsertSnapshot({
      context,
      refresh: {
        evidence: validation.evidence,
        fields: ["marketPrice", "marketConfidence"],
        providerId: providerSnapshot.providerId,
        refreshedAt: new Date().toISOString(),
        refreshTimeMs: 0,
        values: {
          marketConfidence: providerSnapshot.prices[0]?.confidence ?? null,
          marketPrice: providerSnapshot.prices[0]?.price ?? null,
          providerId: providerSnapshot.providerId,
        },
      },
    });
    const replayDiagnostics = provider.getReplayDiagnostics();

    fs.rmSync(storagePath, { force: true });

    return {
      repositorySnapshot,
      replayDiagnostics,
    };
  });
}

test("Market Intelligence Engine generates replay-only profiles for certified fixtures", async () => {
  const engine = new MarketIntelligenceEngine();

  for (const cardName of replayCards) {
    const { repositorySnapshot, replayDiagnostics } =
      await createRepositorySnapshotFromReplay(cardName);
    const profile = engine.analyzeRepositorySnapshot(repositorySnapshot);

    assert.equal(replayDiagnostics?.liveRequestSkipped, true, cardName);
    assert.equal(replayDiagnostics?.quotaSaved, true, cardName);
    assert.ok(profile.signals.length >= 2, cardName);
    assert.ok(profile.reasoning.length >= 3, cardName);
    assert.notEqual(profile.marketHealth, "Distressed", cardName);
    assert.notEqual(profile.confidence.label, "Very Low", cardName);
  }
});

test("Market Intelligence signals and reasoning differ by replayed observation", async () => {
  const engine = new MarketIntelligenceEngine();
  const profiles = new Map<string, ReturnType<MarketIntelligenceEngine["analyzeRepositorySnapshot"]>>();

  for (const cardName of replayCards) {
    const { repositorySnapshot } = await createRepositorySnapshotFromReplay(cardName);
    profiles.set(cardName, engine.analyzeRepositorySnapshot(repositorySnapshot));
  }

  const moxOpal = profiles.get("Mox Opal");
  const collectedCompany = profiles.get("Collected Company");
  const lightningBolt = profiles.get("Lightning Bolt");
  const blackLotus = profiles.get("Black Lotus");

  assert.ok(moxOpal);
  assert.ok(collectedCompany);
  assert.ok(lightningBolt);
  assert.ok(blackLotus);
  assert.ok(
    moxOpal.signals.some((signal) =>
      ["healthy-uptrend", "near-historical-high", "strong-momentum"].includes(signal.id),
    ),
  );
  assert.ok(
    collectedCompany.signals.some((signal) =>
      ["cooling-demand", "market-consolidation", "evidence-coverage-moderate"].includes(signal.id),
    ),
  );
  assert.notDeepEqual(
    moxOpal.signals.map((signal) => signal.id),
    collectedCompany.signals.map((signal) => signal.id),
  );
  assert.notEqual(
    lightningBolt.reasoning.join(" "),
    blackLotus.reasoning.join(" "),
  );
});
