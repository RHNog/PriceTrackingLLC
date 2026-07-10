import assert from "node:assert/strict";
import test from "node:test";
import {
  clearCardImageCache,
  invalidateCardImage,
  resolveCardImage,
} from "../components/cards/CardImageCache.ts";

test.beforeEach(() => clearCardImageCache());

test("prefers repository artwork and reports reuse as cached", () => {
  const candidates = [
    { source: "Provider" as const, urls: { small: "provider-small" } },
    { source: "Repository" as const, urls: { small: "repository-small" } },
  ];

  assert.deepEqual(resolveCardImage("mox-opal", "thumbnail", candidates), {
    source: "Repository",
    sourceDetail: "Repository",
    url: "repository-small",
  });
  assert.deepEqual(resolveCardImage("mox-opal", "thumbnail", candidates), {
    source: "Cached",
    sourceDetail: "Repository",
    url: "repository-small",
  });
});

test("falls back between sizes without another provider abstraction", () => {
  assert.equal(
    resolveCardImage("elsa", "thumbnail", [
      { source: "Replay", urls: { large: "replay-large" } },
    ]).url,
    "replay-large",
  );
});

test("returns placeholder and supports explicit invalidation", () => {
  assert.deepEqual(resolveCardImage("missing", "card", []), {
    source: "Placeholder",
  });

  resolveCardImage("bolt", "thumbnail", [
    { source: "Provider", urls: { small: "old" } },
  ]);
  invalidateCardImage("bolt");
  assert.equal(
    resolveCardImage("bolt", "thumbnail", [
      { source: "Provider", urls: { small: "new" } },
    ]).url,
    "new",
  );
});
