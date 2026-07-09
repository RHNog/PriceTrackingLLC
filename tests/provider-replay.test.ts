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

const SCARS_MOX_OPAL_PRINTING_ID = "6be9b1d5-9ab8-4adb-ba54-2c0117e842fa";
const MODERN_MASTERS_2015_MOX_OPAL_PRINTING_ID =
  "modern-masters-2015-mox-opal";

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

test("Replay fixtures validate by full market identity", () => {
  const location = createReplayFixtureLocation({
    game: "Magic: The Gathering",
    identity: {
      assetIdentity: "Mox Opal",
      collectorNumber: "179",
      condition: "Near Mint",
      finish: "Normal",
      language: "English",
      printing: SCARS_MOX_OPAL_PRINTING_ID,
      providerProductIdentifier: SCARS_MOX_OPAL_PRINTING_ID,
      providerVariantIdentifier: `${SCARS_MOX_OPAL_PRINTING_ID}:nonfoil`,
    },
    provider: "justtcg",
  });
  const loaded = loadReplayFixture<
    JustTCGRawCardResponse,
    JustTCGNormalizedResponse
  >(location);

  assert.doesNotThrow(() => validateReplayFixture(loaded.fixture, location));
  assert.equal(loaded.fixture.metadata.provider, "justtcg");
  assert.equal(loaded.fixture.metadata.identity.collectorNumber, "179");
  assert.equal(loaded.fixture.metadata.identity.finishKey, "normal");
  assert.equal(loaded.fixture.metadata.identity.conditionKey, "nm");
  assert.equal(loaded.fixture.metadata.identity.languageKey, "english");
  assert.equal(loaded.fixture.metadata.schemaVersion, 1);
  assert.equal(loaded.fixture.metadata.sdkVersion, "justtcg-js@0.2.1");
  assert.ok(loaded.fixture.metadata.recordedAt);
  assert.ok(loaded.fixture.raw.data.length > 0);
  assert.ok(loaded.fixture.normalized);
});

test("Replay mode returns an exact Mox Opal fixture without instantiating the SDK", async () => {
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
      collectorNumber: "179",
      condition: "Near Mint",
      finish: "Normal",
      game: "Magic: The Gathering",
      language: "English",
      printing: SCARS_MOX_OPAL_PRINTING_ID,
      printingId: SCARS_MOX_OPAL_PRINTING_ID,
      providerProductIdentifier: SCARS_MOX_OPAL_PRINTING_ID,
      providerVariantIdentifier: `${SCARS_MOX_OPAL_PRINTING_ID}:nonfoil`,
      variantId: `${SCARS_MOX_OPAL_PRINTING_ID}:nonfoil`,
    });
    const replayDiagnostics = provider.getReplayDiagnostics();

    assert.equal(result.status, "SUCCESS");
    assert.equal(result.data?.cards[0]?.name, "Mox Opal");
    assert.equal(sdkInstantiated, false);
    assert.equal(replayDiagnostics?.mode, "REPLAY");
    assert.equal(replayDiagnostics?.fixtureLoaded, true);
    assert.equal(replayDiagnostics?.identityExactMatch, true);
    assert.equal(replayDiagnostics?.liveRequestSkipped, true);
    assert.equal(replayDiagnostics?.quotaSaved, true);
  });
});

test("Replay mode reports a missing printing without live fallback", async () => {
  await withProviderEnv({
    JUSTTCG_API_KEY: "fixture-key",
    PROVIDER_MODE: "REPLAY",
  }, async () => {
    let sdkInstantiated = false;
    const provider = new JustTCGProvider(() => {
      sdkInstantiated = true;
      throw new Error("Replay miss should not fall back to the live SDK.");
    });
    const result = await provider.executeKnownCard({
      cardName: "Mox Opal",
      collectorNumber: "47",
      condition: "Near Mint",
      finish: "Normal",
      game: "Magic: The Gathering",
      language: "English",
      printing: MODERN_MASTERS_2015_MOX_OPAL_PRINTING_ID,
      printingId: MODERN_MASTERS_2015_MOX_OPAL_PRINTING_ID,
      providerProductIdentifier: MODERN_MASTERS_2015_MOX_OPAL_PRINTING_ID,
      providerVariantIdentifier: `${MODERN_MASTERS_2015_MOX_OPAL_PRINTING_ID}:nonfoil`,
      variantId: `${MODERN_MASTERS_2015_MOX_OPAL_PRINTING_ID}:nonfoil`,
    });
    const replayDiagnostics = provider.getReplayDiagnostics();

    assert.equal(result.status, "FAILED");
    assert.equal(sdkInstantiated, false);
    assert.equal(replayDiagnostics?.fixtureLoaded, false);
    assert.equal(replayDiagnostics?.identityExactMatch, false);
    assert.deepEqual(replayDiagnostics?.missingIdentityComponents, ["Printing"]);
    assert.match(result.errorMessage ?? "", /Replay observation missing/);
  });
});

test("Replay lookup selects finish, condition, and language fixtures exactly", async () => {
  await withProviderEnv({
    JUSTTCG_API_KEY: "fixture-key",
    PROVIDER_MODE: "REPLAY",
  }, async () => {
    const provider = new JustTCGProvider(() => {
      throw new Error("Replay should not instantiate SDK for exact fixture hits.");
    });

    const foilSnapshot = await provider.getMarketSnapshot({
      cardName: "Mox Opal",
      collectorNumber: "179",
      condition: "Near Mint",
      finish: "Foil",
      game: "Magic: The Gathering",
      language: "English",
      printing: SCARS_MOX_OPAL_PRINTING_ID,
      printingId: SCARS_MOX_OPAL_PRINTING_ID,
      variantId: `${SCARS_MOX_OPAL_PRINTING_ID}:foil`,
    });
    const lpSnapshot = await provider.getMarketSnapshot({
      cardName: "Mox Opal",
      collectorNumber: "179",
      condition: "Lightly Played",
      finish: "Normal",
      game: "Magic: The Gathering",
      language: "English",
      printing: SCARS_MOX_OPAL_PRINTING_ID,
      printingId: SCARS_MOX_OPAL_PRINTING_ID,
      variantId: `${SCARS_MOX_OPAL_PRINTING_ID}:nonfoil`,
    });
    const japaneseResult = await provider.executeKnownCard({
      cardName: "Mox Opal",
      collectorNumber: "179",
      condition: "Near Mint",
      finish: "Normal",
      game: "Magic: The Gathering",
      language: "Japanese",
      printing: SCARS_MOX_OPAL_PRINTING_ID,
      printingId: SCARS_MOX_OPAL_PRINTING_ID,
      providerProductIdentifier: SCARS_MOX_OPAL_PRINTING_ID,
      providerVariantIdentifier: `${SCARS_MOX_OPAL_PRINTING_ID}:nonfoil`,
      variantId: `${SCARS_MOX_OPAL_PRINTING_ID}:nonfoil`,
    });

    assert.equal(foilSnapshot.priceMissing, false);
    assert.equal(foilSnapshot.prices[0]?.price, 450.55);
    assert.equal(foilSnapshot.prices[0]?.finish, "Foil");
    assert.equal(lpSnapshot.priceMissing, false);
    assert.equal(lpSnapshot.prices[0]?.price, 80.33);
    assert.equal(lpSnapshot.prices[0]?.condition, "Lightly Played");
    assert.equal(japaneseResult.status, "SUCCESS");
    assert.equal(japaneseResult.data?.cards[0]?.variants[0]?.language, "Japanese");
  });
});
