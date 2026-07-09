import assert from "node:assert/strict";
import test from "node:test";
import { ProviderClient } from "@/lib/providers/sdk/ProviderClient";
import { MemoryProviderCache } from "@/lib/providers/sdk/ProviderCache";
import {
  getProviderSdkSnapshot,
  providerRegistry,
} from "@/lib/providers/sdk/ProviderRegistry";

const requiredProviders = [
  "justtcg",
  "edhrec",
  "psa",
  "bgs",
  "cgc",
  "cardmarket",
  "tcgplayer",
  "melee",
  "mtgo",
  "ligamagic",
  "ebay",
];

test("Provider SDK registers planned future providers", () => {
  const metadata = providerRegistry.getMetadata();
  const ids = metadata.map((provider) => provider.id);

  for (const providerId of requiredProviders) {
    assert.ok(ids.includes(providerId));
  }

  assert.equal(
    metadata.find((provider) => provider.id === "tcgplayer")?.lifecycleStatus,
    "ACTIVE",
  );
  assert.equal(
    metadata.find((provider) => provider.id === "justtcg")?.lifecycleStatus,
    "ACTIVE",
  );
  assert.ok(
    metadata
      .filter(
        (provider) =>
          !["justtcg", "tcgplayer"].includes(provider.id),
      )
      .every((provider) => provider.lifecycleStatus === "PLANNED"),
  );
  assert.ok(metadata.every((provider) => provider.supportedInputs.length > 0));
  assert.ok(metadata.every((provider) => provider.supportedOutputs.length > 0));
});

test("Provider SDK generates health, coverage, and evidence contribution", () => {
  const snapshot = getProviderSdkSnapshot();

  assert.equal(snapshot.metadata.length, requiredProviders.length);
  assert.equal(snapshot.health.length, requiredProviders.length);
  assert.equal(snapshot.coverage.length, requiredProviders.length);
  assert.ok(snapshot.evidence.length >= requiredProviders.length);
  assert.ok(
    snapshot.health.some((health) => health.status === "HEALTHY"),
  );
  assert.ok(
    snapshot.health.some(
      (health) => health.status === "WAITING_FOR_INTEGRATION",
    ),
  );
  assert.ok(snapshot.coverage.some((coverage) => coverage.gaps.length === 0));
  assert.ok(snapshot.coverage.some((coverage) => coverage.gaps.length > 0));
  assert.ok(
    snapshot.evidence.every((evidence) =>
      ["UNAVAILABLE", "WAITING_FOR_PROVIDER"].includes(evidence.status),
    ),
  );
});

test("ProviderClient owns normalization, caching, diagnostics, and validation lifecycle", async () => {
  const adapter = {
    metadata: {
      id: "test-provider",
      name: "Test Provider",
      domain: "market" as const,
      lifecycleStatus: "ACTIVE" as const,
      description: "Test SDK provider.",
      supportedInputs: ["query"],
      supportedOutputs: ["normalized"],
      evidenceTypes: ["Marketplace Depth"],
      version: "1.0.0",
    },
    getCoverage: () => ({
      confidence: 80,
      coverageAreas: ["Test"],
      gaps: [],
      lastMeasuredAt: "2026-07-08T00:00:00.000Z",
      scope: "market",
    }),
    getHealth: () => ({
      checkedAt: "2026-07-08T00:00:00.000Z",
      latencyMs: 1,
      message: "Healthy",
      retryable: true,
      status: "HEALTHY" as const,
    }),
    mapEvidence: () => [
      {
        confidenceContribution: 80,
        evidenceType: "Marketplace Depth",
        explanation: "Mapped test evidence.",
        mappedIndicatorIds: ["liquidity"],
        source: "Test Provider",
        status: "AVAILABLE" as const,
      },
    ],
    normalize: (raw: { value: number }) => ({ normalizedValue: raw.value }),
    validate: (raw: { value: number }) => (raw.value > 0 ? [] : ["Invalid value"]),
    createWaitingResult: () => {
      throw new Error("Unexpected waiting result.");
    },
  };
  let fetchCount = 0;
  const client = new ProviderClient(
    adapter,
    new MemoryProviderCache<{ value: number }>(),
    {
      fetchRaw: async () => {
        fetchCount += 1;
        return { value: 7 };
      },
      getCacheKey: () => "test-cache-key",
    },
  );
  const first = await client.execute({});
  const second = await client.execute({});

  assert.equal(first.status, "SUCCESS");
  assert.equal(first.data?.normalizedValue, 7);
  assert.equal(first.diagnostics.cacheStatus, "MISS");
  assert.equal(second.status, "SUCCESS");
  assert.equal(second.diagnostics.cacheStatus, "HIT");
  assert.equal(fetchCount, 1);
});
