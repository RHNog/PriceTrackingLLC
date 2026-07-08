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

function createVariant(printingId: string, finish: string) {
  return {
    id: `${printingId}:${finish.toLowerCase()}`,
    printingId,
    finish,
    isAvailable: true,
    source: "Test",
  };
}

function createMultiFinishPrinting(overrides: Partial<Card> = {}) {
  const id = overrides.id ?? "secret-lair-countdown";

  return {
    id,
    name: "Urza's Saga",
    game: "Magic",
    set: "Secret Lair Countdown Kit",
    setCode: "SLD",
    number: "21",
    rarity: "Rare",
    finish: "Multiple",
    availableFinishes: ["Nonfoil", "Foil"],
    finishVariants: [
      createVariant(id, "Nonfoil"),
      createVariant(id, "Foil"),
    ],
    imageUrl: "https://example.com/secret-lair.jpg",
    productFamily: "Secret Lair Countdown Kit",
    promoTypes: ["secretlair"],
    ...overrides,
  } as Card;
}

test("keeps finish unresolved when a matching printing has multiple finishes", () => {
  const parsedQuery = parseQuery("urza's saga secret lair");
  const identity = {
    id: "urzas-saga",
    name: "Urza's Saga",
    game: "Magic",
  } as CardIdentity;

  const resolution = satisfyPrintingConstraints(
    identity,
    [createMultiFinishPrinting()],
    resolveConstraints(parsedQuery),
  );

  assert.equal(resolution.selectedPrinting?.id, "secret-lair-countdown");
  assert.equal(resolution.shouldAutoCommitPrinting, true);
  assert.equal(resolution.selectedVariant, null);
  assert.equal(resolution.shouldAutoCommitVariant, false);
  assert.deepEqual(
    resolution.availableVariants.map((variant) => variant.finish),
    ["Nonfoil", "Foil"],
  );
});

test("selects foil when a multi-finish printing satisfies a foil constraint", () => {
  const parsedQuery = parseQuery("urza's saga secret lair foil");
  const identity = {
    id: "urzas-saga",
    name: "Urza's Saga",
    game: "Magic",
  } as CardIdentity;

  const resolution = satisfyPrintingConstraints(
    identity,
    [createMultiFinishPrinting()],
    resolveConstraints(parsedQuery),
  );

  assert.equal(resolution.selectedPrinting?.id, "secret-lair-countdown");
  assert.equal(resolution.selectedVariant?.finish, "Foil");
  assert.equal(resolution.shouldAutoCommitVariant, true);
});

test("selects nonfoil when a multi-finish printing satisfies a nonfoil constraint", () => {
  const parsedQuery = parseQuery("urza's saga secret lair nonfoil");
  const identity = {
    id: "urzas-saga",
    name: "Urza's Saga",
    game: "Magic",
  } as CardIdentity;

  const resolution = satisfyPrintingConstraints(
    identity,
    [createMultiFinishPrinting()],
    resolveConstraints(parsedQuery),
  );

  assert.equal(resolution.selectedPrinting?.id, "secret-lair-countdown");
  assert.equal(resolution.selectedVariant?.finish, "Nonfoil");
  assert.equal(resolution.shouldAutoCommitVariant, true);
});

test("auto-selects a single available finish for unambiguous promo printings", () => {
  const parsedQuery = parseQuery("urza's saga store");
  const identity = {
    id: "urzas-saga",
    name: "Urza's Saga",
    game: "Magic",
  } as CardIdentity;
  const printing = {
    id: "store-championship",
    name: "Urza's Saga",
    game: "Magic",
    set: "Store Championship Promos",
    setCode: "SCH",
    number: "1",
    rarity: "Rare",
    finish: "Foil",
    availableFinishes: ["Foil"],
    finishVariants: [createVariant("store-championship", "Foil")],
    imageUrl: "https://example.com/store.jpg",
    productFamily: "Store Championship Promos",
    promoTypes: ["storechampionship"],
  } as Card;

  const resolution = satisfyPrintingConstraints(
    identity,
    [printing],
    resolveConstraints(parsedQuery),
  );

  assert.equal(resolution.selectedPrinting?.id, "store-championship");
  assert.equal(resolution.selectedVariant?.finish, "Foil");
  assert.equal(resolution.shouldAutoCommitVariant, true);
});

test("keeps judge promo finish unresolved until foil is requested", () => {
  const identity = {
    id: "lightning-bolt",
    name: "Lightning Bolt",
    game: "Magic",
  } as CardIdentity;
  const printing = createMultiFinishPrinting({
    id: "bolt-judge",
    name: "Lightning Bolt",
    set: "Judge Gift Cards",
    setCode: "JDG",
    number: "1",
    productFamily: "Judge Gift Cards",
    promoTypes: ["judge"],
  });

  const unresolved = satisfyPrintingConstraints(
    identity,
    [printing],
    resolveConstraints(parseQuery("bolt judge")),
  );
  const foil = satisfyPrintingConstraints(
    identity,
    [printing],
    resolveConstraints(parseQuery("bolt judge foil")),
  );

  assert.equal(unresolved.selectedPrinting?.id, "bolt-judge");
  assert.equal(unresolved.selectedVariant, null);
  assert.equal(unresolved.shouldAutoCommitVariant, false);
  assert.equal(foil.selectedVariant?.finish, "Foil");
  assert.equal(foil.shouldAutoCommitVariant, true);
});

test("selects only unambiguous finish variants for invocation printings", () => {
  const parsedQuery = parseQuery("counterspell invocation");
  const identity = {
    id: "counterspell",
    name: "Counterspell",
    game: "Magic",
  } as CardIdentity;
  const printing = {
    id: "counterspell-invocation",
    name: "Counterspell",
    game: "Magic",
    set: "Amonkhet Invocations",
    setCode: "MP2",
    number: "9",
    rarity: "Mythic Rare",
    finish: "Foil",
    availableFinishes: ["Foil"],
    finishVariants: [createVariant("counterspell-invocation", "Foil")],
    frame: "2015",
    imageUrl: "https://example.com/counterspell.jpg",
    productFamily: "Amonkhet Invocations",
    treatment: "Invocation",
  } as Card;

  const resolution = satisfyPrintingConstraints(
    identity,
    [printing],
    resolveConstraints(parsedQuery),
  );

  assert.equal(resolution.selectedPrinting?.id, "counterspell-invocation");
  assert.equal(resolution.selectedVariant?.finish, "Foil");
  assert.equal(resolution.shouldAutoCommitVariant, true);
});
