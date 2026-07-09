import assert from "node:assert/strict";
import test from "node:test";
import {
  defaultVendorEligibilityEngine,
  filterIdentityResultsForVendorWorkflow,
} from "@/lib/engines/eligibility/AssetEligibilityEngine";
import type { Card } from "@/types/card";
import type { CardIdentity } from "@/types/cardIdentity";
import type { SearchResult } from "@/types/searchResult";

function createPrinting(input: Partial<Card> & Pick<Card, "id" | "name" | "set">): Card {
  return {
    game: "Magic",
    number: "1",
    rarity: "Rare",
    finish: "Nonfoil",
    imageUrl: "",
    sourceGames: ["paper"],
    ...input,
  };
}

test("Default Vendor eligibility hides unsupported digital and non-card assets", () => {
  const hiddenAssets = [
    createPrinting({
      id: "mox-opal-magic-online",
      name: "Mox Opal",
      set: "Magic Online Promos",
      sourceGames: ["mtgo"],
    }),
    createPrinting({
      id: "island-art-series",
      name: "Island Art Series",
      set: "Modern Horizons 2 Art Series",
      productFamily: "Art Series",
    }),
    createPrinting({
      id: "innistrad-checklist",
      name: "Checklist Card",
      set: "Innistrad",
      typeLine: "Checklist",
    }),
  ];

  for (const asset of hiddenAssets) {
    const result = defaultVendorEligibilityEngine.evaluate(asset);

    assert.equal(result.eligible, false, `${asset.id} should be hidden.`);
    assert.equal(result.workflow, "Vendor Workspace");
  }
});

test("Default Vendor eligibility keeps supported physical and premium printings visible", () => {
  const visibleAssets = [
    createPrinting({
      id: "mox-opal-som",
      name: "Mox Opal",
      set: "Scars of Mirrodin",
    }),
    createPrinting({
      id: "sol-ring-masterpiece",
      name: "Sol Ring",
      set: "Kaladesh Inventions",
      treatment: "Masterpiece",
    }),
    createPrinting({
      id: "mox-opal-judge",
      name: "Mox Opal",
      set: "Judge Gift Cards",
      promoTypes: ["judge_gift"],
    }),
    createPrinting({
      id: "urzas-saga-secret-lair",
      name: "Urza's Saga",
      set: "Secret Lair Drop",
      productFamily: "Secret Lair",
    }),
  ];

  for (const asset of visibleAssets) {
    const result = defaultVendorEligibilityEngine.evaluate(asset);

    assert.equal(result.eligible, true, `${asset.id} should be visible.`);
    assert.equal(result.workflow, "Vendor Workspace");
  }
});

test("Vendor workflow filtering removes only ineligible printings", () => {
  const identity: SearchResult<CardIdentity> = {
    item: {
      id: "mox-opal",
      name: "Mox Opal",
      game: "Magic",
      printings: [
        createPrinting({
          id: "mox-opal-som",
          name: "Mox Opal",
          set: "Scars of Mirrodin",
        }),
        createPrinting({
          id: "mox-opal-magic-online",
          name: "Mox Opal",
          set: "Magic Online Promos",
          sourceGames: ["mtgo"],
        }),
      ],
    },
    matchedTerms: [],
    score: 1,
  };
  const filtered = filterIdentityResultsForVendorWorkflow([identity]);

  assert.equal(filtered.results.length, 1);
  assert.deepEqual(
    filtered.results[0].item.printings.map((printing) => printing.id),
    ["mox-opal-som"],
  );
  assert.equal(filtered.diagnostics[0].printings.length, 2);
  assert.equal(filtered.diagnostics[0].printings[1].eligible, false);
});
