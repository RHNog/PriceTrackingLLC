import assert from "node:assert/strict";
import test from "node:test";
import { JustTCGProvider } from "@/lib/providers/justtcg/JustTCGProvider";
import {
  loadReplayFixture,
  validateReplayFixture,
} from "@/lib/providers/replay/ReplayLoader";
import { createReplayFixtureLocation } from "@/lib/providers/replay/ReplayRegistry";
import type {
  JustTCGNormalizedResponse,
  JustTCGRawCardResponse,
} from "@/lib/providers/justtcg/JustTCGNormalizer";

const replayCards = [
  "Mox Opal",
  "Chrome Mox",
  "Lightning Bolt",
  "Black Lotus",
  "Collected Company",
  "Urza's Saga",
];

async function withProviderEnv<T>(
  env: Record<string, string>,
  operation: () => T | Promise<T>,
) {
  const previous = Object.fromEntries(
    Object.keys(env).map((key) => [key, process.env[key]]),
  );

  for (const [key, value] of Object.entries(env)) {
    process.env[key] = value;
  }

  try {
    return await operation();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
}

function createLiveProviderFromFixture(raw: JustTCGRawCardResponse) {
  return new JustTCGProvider(() => ({
    v1: {
      cards: {
        get: async () => raw,
      },
    },
  }) as never);
}

test("Replay fixtures validate for certified JustTCG cards", () => {
  for (const cardName of replayCards) {
    const location = createReplayFixtureLocation({
      asset: cardName,
      game: "Magic: The Gathering",
      provider: "justtcg",
    });
    const loaded = loadReplayFixture<
      JustTCGRawCardResponse,
      JustTCGNormalizedResponse
    >(location);

    assert.doesNotThrow(() => validateReplayFixture(loaded.fixture, location));
    assert.equal(loaded.fixture.metadata.provider, "justtcg");
    assert.equal(loaded.fixture.metadata.schemaVersion, 1);
    assert.equal(loaded.fixture.metadata.sdkVersion, "justtcg-js@0.2.1");
    assert.ok(loaded.fixture.metadata.recordedAt);
    assert.ok(loaded.fixture.raw.data.length > 0);
    assert.ok(loaded.fixture.normalized);
  }
});

test("Replay mode returns a fixture without instantiating the SDK or using network", async () => {
  await withProviderEnv({
    JUSTTCG_API_KEY: "fixture-key",
    PROVIDER_MODE: "REPLAY",
  }, async () => {
    let sdkInstantiated = false;
    const provider = new JustTCGProvider(() => {
      sdkInstantiated = true;
      throw new Error("SDK should not be instantiated in replay mode.");
    });

    const result = await provider.executeKnownCard({
      cardName: "Mox Opal",
      game: "Magic: The Gathering",
    });
    const replayDiagnostics = provider.getReplayDiagnostics();

    assert.equal(result.status, "SUCCESS");
    assert.equal(result.data?.cards[0]?.name, "Mox Opal");
    assert.equal(sdkInstantiated, false);
    assert.equal(replayDiagnostics?.mode, "REPLAY");
    assert.equal(replayDiagnostics?.fixtureLoaded, true);
    assert.equal(replayDiagnostics?.liveRequestSkipped, true);
    assert.equal(replayDiagnostics?.quotaSaved, true);
  });
});

test("AUTO mode replays when a fixture exists and preserves provider behavior", async () => {
  await withProviderEnv({
    JUSTTCG_API_KEY: "fixture-key",
    PROVIDER_MODE: "AUTO",
  }, async () => {
    const replayProvider = new JustTCGProvider(() => {
      throw new Error("AUTO should not use live SDK when fixture exists.");
    });
    const snapshot = await replayProvider.getMarketSnapshot({
      cardName: "Chrome Mox",
      game: "Magic: The Gathering",
      printingId: "chrome-mox-printing",
      variantId: "chrome-mox-printing:normal",
    });
    const replayDiagnostics = replayProvider.getReplayDiagnostics();

    assert.equal(snapshot.providerId, "justtcg");
    assert.equal(snapshot.priceMissing, false);
    assert.equal(snapshot.prices[0]?.price, 68.44);
    assert.equal(replayDiagnostics?.mode, "AUTO");
    assert.equal(replayDiagnostics?.fixtureLoaded, true);
    assert.equal(replayDiagnostics?.liveRequestSkipped, true);
  });
});

test("Replay and live providers fed the same observation produce matching market values", async () => {
  await withProviderEnv({
    JUSTTCG_API_KEY: "fixture-key",
    PROVIDER_MODE: "REPLAY",
  }, async () => {
    const replayProvider = new JustTCGProvider(() => {
      throw new Error("Replay should not instantiate SDK.");
    });
    const replaySnapshot = await replayProvider.getMarketSnapshot({
      cardName: "Lightning Bolt",
      game: "Magic: The Gathering",
      printingId: "lightning-bolt-printing",
      variantId: "lightning-bolt-printing:normal",
    });
    const fixture = loadReplayFixture<
      JustTCGRawCardResponse,
      JustTCGNormalizedResponse
    >(
      createReplayFixtureLocation({
        asset: "Lightning Bolt",
        game: "Magic: The Gathering",
        provider: "justtcg",
      }),
    );

    await withProviderEnv({
      JUSTTCG_API_KEY: "fixture-key",
      PROVIDER_MODE: "LIVE",
    }, async () => {
      const liveProvider = createLiveProviderFromFixture(fixture.fixture.raw);
      const liveSnapshot = await liveProvider.getMarketSnapshot({
        cardName: "Lightning Bolt",
        game: "Magic: The Gathering",
        printingId: "lightning-bolt-printing",
        variantId: "lightning-bolt-printing:normal",
      });

      assert.equal(replaySnapshot.priceMissing, liveSnapshot.priceMissing);
      assert.equal(replaySnapshot.prices[0]?.price, liveSnapshot.prices[0]?.price);
      assert.equal(
        replaySnapshot.identityEvidence?.canonicalName,
        liveSnapshot.identityEvidence?.canonicalName,
      );
      assert.deepEqual(
        (replaySnapshot.rawObservations ?? []).map((observation) => ({
          providerField: observation.providerField,
          rawValue: observation.rawValue,
          unit: observation.unit ?? null,
        })),
        (liveSnapshot.rawObservations ?? []).map((observation) => ({
          providerField: observation.providerField,
          rawValue: observation.rawValue,
          unit: observation.unit ?? null,
        })),
      );
    });
  });
});
