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
