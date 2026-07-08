import assert from "node:assert/strict";
import test from "node:test";
import { resolveConstraints } from "@/lib/engines/intent/resolveConstraints";
import { satisfyPrintingConstraints } from "@/lib/engines/constraints/satisfyPrintingConstraints";
import { parseQuery } from "@/lib/engines/query/parseQuery";
import type { Card } from "@/types/card";
import type { CardIdentity } from "@/types/cardIdentity";

test("parses special guest vocabulary as a product constraint", () => {
  const parsedQuery = parseQuery("collected company guest");

  assert.equal(parsedQuery.product, "Special Guests");
  assert.equal(parsedQuery.knowledgeMatches[0]?.category, "product");

  const constraints = resolveConstraints(parsedQuery);
  assert.deepEqual(
    constraints.map((constraint) => ({ field: constraint.field, value: constraint.value })),
    [{ field: "product", value: "Special Guests" }],
  );
});

test("separates identity tokens from set constraints", () => {
  const parsedQuery = parseQuery("collected company tarkir");

  assert.equal(parsedQuery.cardName, "collected company");
  assert.equal(parsedQuery.set, "Tarkir");
  assert.deepEqual(parsedQuery.identityTokens, ["collected", "company"]);
  assert.deepEqual(parsedQuery.constraintTokens, ["tarkir"]);
});

test("does not auto-select a printing when no candidate matches the constraint", () => {
  const parsedQuery = parseQuery("collected company guest");
  const identity = {
    id: "test-identity",
    name: "Collected Company",
    game: "Magic",
  } as CardIdentity;
  const printings = [
    {
      id: "printing-1",
      name: "Collected Company",
      game: "Magic",
      set: "Core Set 2021",
      setCode: "m21",
      number: "1",
      rarity: "Rare",
      finish: "foil",
      imageUrl: "https://example.com/1.jpg",
    },
  ] as Card[];

  const resolution = satisfyPrintingConstraints(identity, printings, resolveConstraints(parsedQuery));

  assert.equal(resolution.shouldAutoCommit, false);
  assert.equal(resolution.selectedPrinting, undefined);
  assert.equal(resolution.selectedPrintingConfidence, 0);
  assert.equal(resolution.printingCandidates[0]?.confidence, 0);
});

test("parses textless variants as treatment constraints", () => {
  const queries = [
    "urza's saga textless",
    "urzas saga text less",
    "urza saga no text",
  ];

  queries.forEach((query) => {
    const parsedQuery = parseQuery(query);

    assert.equal(parsedQuery.treatment, "Textless");
    assert.equal(
      parsedQuery.knowledgeMatches.find((match) => match.canonical === "Textless")
        ?.category,
      "treatment",
    );
  });
});

test("prefers promotional Urza's Saga printings for textless constraints", () => {
  const parsedQuery = parseQuery("urza's saga textless");
  const identity = {
    id: "urzas-saga",
    name: "Urza's Saga",
    game: "Magic",
  } as CardIdentity;
  const printings = [
    {
      id: "regular",
      name: "Urza's Saga",
      game: "Magic",
      set: "Modern Horizons 2",
      setCode: "MH2",
      number: "259",
      rarity: "Rare",
      finish: "Nonfoil",
      imageUrl: "https://example.com/regular.jpg",
    },
    {
      id: "store-championship",
      name: "Urza's Saga",
      game: "Magic",
      set: "Store Championship Promos",
      setCode: "SCH",
      number: "1",
      rarity: "Rare",
      finish: "Foil",
      imageUrl: "https://example.com/promo.jpg",
      productFamily: "Store Championship Promos",
      promoTypes: ["storechampionship"],
    },
  ] as Card[];

  const resolution = satisfyPrintingConstraints(
    identity,
    printings,
    resolveConstraints(parsedQuery),
  );

  assert.equal(resolution.printingCandidates[0]?.printing.id, "store-championship");
});
