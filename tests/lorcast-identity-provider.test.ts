import assert from "node:assert/strict";
import test from "node:test";
import { LorcastProvider } from "../lib/providers/lorcast/LorcastProvider.ts";
import { normalizeLorcastCard } from "../lib/providers/lorcast/LorcastNormalizer.ts";

const elsa = {
  collector_number: "42",
  id: "crd_elsa_42",
  image_uris: {
    digital: {
      large: "https://cards.lorcast.io/large.avif?1",
      normal: "https://cards.lorcast.io/normal.avif?1",
      small: "https://cards.lorcast.io/small.avif?1",
    },
  },
  ink: "Amethyst",
  lang: "en",
  name: "Elsa",
  prices: { usd: "2.00", usd_foil: "20.00" },
  rarity: "legendary",
  set: { code: "1", id: "set_1", name: "The First Chapter" },
  tcgplayer_id: 507512,
  type: ["Character"],
  version: "Spirit of Winter",
};

test("normalizes Lorcast identity and excludes prices", () => {
  const card = normalizeLorcastCard(elsa);
  assert.equal(card?.name, "Elsa");
  assert.equal(card?.version, "Spirit of Winter");
  assert.equal(card?.number, "42");
  assert.equal(card?.imageUrls?.normal, elsa.image_uris.digital.normal);
  assert.equal(card?.canonicalIdentity, "lorcana:elsa:spirit of winter");
  assert.equal(card?.tcgplayerId, 507512);
  assert.equal("prices" in (card ?? {}), false);
  assert.equal(JSON.stringify(card).includes("2.00"), false);
  assert.equal(card?.finish, "Unknown");
});

test("requests all prints once and caches identical searches", async () => {
  let requests = 0;
  const provider = new LorcastProvider({
    fetcher: (async (input: URL | RequestInfo) => {
      requests += 1;
      const url = String(input);
      assert.match(url, /unique=prints/);
      return new Response(JSON.stringify({ results: [elsa] }), {
        headers: { "content-type": "application/json" },
        status: 200,
      });
    }) as typeof fetch,
    now: () => 1000,
  });

  const first = await provider.searchCardsWithDiagnostics("Elsa");
  const second = await provider.searchCardsWithDiagnostics("  Elsa  ");
  assert.equal(requests, 1);
  assert.equal(first.cacheStatus, "MISS");
  assert.equal(second.cacheStatus, "HIT");
  assert.equal(second.cards[0].id, "crd_elsa_42");
});

test("classifies malformed, rate-limited, offline, and network failures", async () => {
  const malformed = await new LorcastProvider().searchCardsWithDiagnostics("");
  assert.equal(malformed.errorKind, "MALFORMED_QUERY");

  for (const [status, expected] of [[429, "RATE_LIMITED"], [503, "PROVIDER_OFFLINE"]] as const) {
    const result = await new LorcastProvider({
      fetcher: (async () => new Response("", { status })) as typeof fetch,
      now: () => 1000,
    }).searchCardsWithDiagnostics("Elsa");
    assert.equal(result.errorKind, expected);
  }

  const network = await new LorcastProvider({
    fetcher: (async () => { throw new Error("network down"); }) as typeof fetch,
    now: () => 1000,
  }).searchCardsWithDiagnostics("Elsa");
  assert.equal(network.errorKind, "NETWORK_FAILURE");
});
