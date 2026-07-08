import assert from "node:assert/strict";
import test from "node:test";
import {
  createWorkflowCommand,
  type WorkflowCommand,
} from "@/lib/workflow/commands/WorkflowCommand";
import {
  initialVendorWorkflowSnapshot,
  processWorkflowCommand,
} from "@/lib/workflow/VendorWorkflowMachine";
import type { Card } from "@/types/card";
import type { CardIdentity } from "@/types/cardIdentity";

function createPrinting(id: string, name: string): Card {
  return {
    id,
    name,
    game: "Magic",
    set: "Test Set",
    number: "1",
    rarity: "Rare",
    finish: "Nonfoil",
    availableFinishes: ["Nonfoil"],
    finishVariants: [
      {
        id: `${id}-nonfoil`,
        printingId: id,
        finish: "Nonfoil",
        isAvailable: true,
        source: "test",
      },
    ],
    imageUrl: "",
  };
}

function createIdentity(
  id: string,
  name: string,
  printings: Card[],
): CardIdentity {
  return {
    id,
    name,
    game: "Magic",
    printings,
  };
}

const shallowGrave = createIdentity("shallow-grave", "Curse of Shallow Graves", [
  createPrinting("shallow-grave-printing", "Curse of Shallow Graves"),
]);
const chromeMox = createIdentity("chrome-mox", "Chrome Mox", [
  createPrinting("chrome-mox-mrd", "Chrome Mox"),
  createPrinting("chrome-mox-2xm", "Chrome Mox"),
]);
const moxOpal = createIdentity("mox-opal", "Mox Opal", [
  createPrinting("mox-opal-judge", "Mox Opal"),
]);

function runWorkflow(commands: WorkflowCommand[]) {
  return commands.reduce(
    (snapshot, command) => processWorkflowCommand(snapshot, command).workflow,
    initialVendorWorkflowSnapshot,
  );
}

test("Select Shallow Grave uses the single printing rule and reaches ready", () => {
  const snapshot = runWorkflow([
    createWorkflowCommand("SearchCards", { query: "shallow grave" }),
    createWorkflowCommand(
      "LoadSearchResults",
      { results: [shallowGrave] },
      "SearchEngine",
    ),
  ]);

  assert.equal(snapshot.state, "ReadyForEvaluation");
  assert.equal(snapshot.singlePrintingRuleActivated, true);
  assert.equal(snapshot.context.selectedIdentityId, "shallow-grave");
  assert.equal(snapshot.context.selectedPrintingId, "shallow-grave-printing");
  assert.equal(snapshot.context.selectedVariantId, "shallow-grave-printing-nonfoil");
  assert.equal(snapshot.assetContext.generation, 2);
  assert.equal(snapshot.assetContext.identityId, "shallow-grave");
  assert.equal(snapshot.assetContext.printingId, "shallow-grave-printing");
  assert.equal(snapshot.assetContext.variantId, "shallow-grave-printing-nonfoil");
  assert.equal(snapshot.lastCommand, "LoadSearchResults");
});

test("Select Chrome Mox with multiple printings waits for SelectPrinting", () => {
  const snapshot = runWorkflow([
    createWorkflowCommand("SearchCards", { query: "chrome mox" }),
    createWorkflowCommand(
      "LoadSearchResults",
      { results: [chromeMox] },
      "SearchEngine",
    ),
    createWorkflowCommand("SelectCard", {
      identity: chromeMox,
      identityCount: 1,
    }),
  ]);

  assert.equal(snapshot.state, "PrintingsLoaded");
  assert.equal(snapshot.printingCount, 2);
  assert.equal(snapshot.context.selectedIdentityId, "chrome-mox");
  assert.equal(snapshot.context.selectedPrintingId, "");
});

test("Select Chrome Mox then Double Masters printing reaches ready", () => {
  const snapshot = runWorkflow([
    createWorkflowCommand("SearchCards", { query: "chrome mox" }),
    createWorkflowCommand(
      "LoadSearchResults",
      { results: [chromeMox] },
      "SearchEngine",
    ),
    createWorkflowCommand("SelectCard", {
      identity: chromeMox,
      identityCount: 1,
    }),
    createWorkflowCommand("SelectPrinting", {
      identityCount: 1,
      printing: chromeMox.printings[1],
      printingCount: 2,
    }),
  ]);

  assert.equal(snapshot.state, "ReadyForEvaluation");
  assert.equal(snapshot.context.selectedPrintingId, "chrome-mox-2xm");
  assert.equal(snapshot.context.selectedVariantId, "chrome-mox-2xm-nonfoil");
});

test("switching from Chrome Mox to Mox Opal removes stale context", () => {
  const beforeSwitch = runWorkflow([
    createWorkflowCommand("SearchCards", { query: "chrome mox" }),
    createWorkflowCommand(
      "LoadSearchResults",
      { results: [chromeMox] },
      "SearchEngine",
    ),
    createWorkflowCommand("SelectCard", {
      identity: chromeMox,
      identityCount: 1,
    }),
    createWorkflowCommand("SelectPrinting", {
      identityCount: 1,
      printing: chromeMox.printings[0],
      printingCount: 2,
    }),
    createWorkflowCommand("EnterAskingPrice", { askingPrice: "42" }),
  ]);
  const afterSwitch = processWorkflowCommand(
    beforeSwitch,
    createWorkflowCommand("SelectCard", {
      identity: moxOpal,
      identityCount: 2,
    }),
  ).workflow;

  assert.equal(afterSwitch.context.selectedIdentityId, "mox-opal");
  assert.equal(afterSwitch.context.selectedPrintingId, "mox-opal-judge");
  assert.equal(afterSwitch.context.selectedVariantId, "mox-opal-judge-nonfoil");
  assert.equal(afterSwitch.assetContext.identityId, "mox-opal");
  assert.equal(afterSwitch.assetContext.printingId, "mox-opal-judge");
  assert.equal(afterSwitch.assetContext.variantId, "mox-opal-judge-nonfoil");
  assert.ok(afterSwitch.assetContext.generation > beforeSwitch.assetContext.generation);
  assert.equal(afterSwitch.context.askingPrice, "");
  assert.ok(afterSwitch.invalidatedObjects.includes("Decision"));
  assert.ok(afterSwitch.invalidatedObjects.includes("Offer Ladder"));
  assert.ok(afterSwitch.loadedObjects.includes("Card Intelligence"));
});

test("market snapshot from an old generation is rejected", () => {
  const chromeReady = runWorkflow([
    createWorkflowCommand("SearchCards", { query: "chrome mox" }),
    createWorkflowCommand(
      "LoadSearchResults",
      { results: [chromeMox] },
      "SearchEngine",
    ),
    createWorkflowCommand("SelectCard", {
      identity: chromeMox,
      identityCount: 1,
    }),
    createWorkflowCommand("SelectPrinting", {
      identityCount: 1,
      printing: chromeMox.printings[0],
      printingCount: 2,
    }),
  ]);
  const moxReady = processWorkflowCommand(
    chromeReady,
    createWorkflowCommand("SelectCard", {
      identity: moxOpal,
      identityCount: 2,
    }),
  ).workflow;
  const staleMarket = processWorkflowCommand(
    moxReady,
    createWorkflowCommand(
      "LoadMarketSnapshot",
      {
        assetContextGeneration: moxReady.assetContext.generation - 1,
        printingId: "chrome-mox-mrd",
        providerId: "test-market",
        updatedAt: "2026-01-01T00:00:00.000Z",
        variantId: "chrome-mox-mrd-nonfoil",
      },
      "MarketProvider",
    ),
  ).workflow;

  assert.equal(staleMarket.assetContext.identityId, "mox-opal");
  assert.equal(staleMarket.assetContext.marketSnapshotId, "");
  assert.equal(staleMarket.rejectedCommands.at(-1), "LoadMarketSnapshot");
  assert.equal(
    staleMarket.rejectionReason,
    "Market snapshot does not match the current Asset Context.",
  );
});

test("rapid card switching keeps one coherent asset context", () => {
  const snapshot = runWorkflow([
    createWorkflowCommand("SearchCards", { query: "mox" }),
    createWorkflowCommand(
      "LoadSearchResults",
      { results: [chromeMox, moxOpal] },
      "SearchEngine",
    ),
    createWorkflowCommand("SelectCard", {
      identity: chromeMox,
      identityCount: 2,
    }),
    createWorkflowCommand("SelectCard", {
      identity: moxOpal,
      identityCount: 2,
    }),
    createWorkflowCommand("SelectCard", {
      identity: shallowGrave,
      identityCount: 3,
    }),
  ]);

  assert.equal(snapshot.context.selectedIdentityId, "shallow-grave");
  assert.equal(snapshot.assetContext.identityId, "shallow-grave");
  assert.equal(snapshot.assetContext.printingId, "shallow-grave-printing");
  assert.equal(snapshot.assetContext.variantId, "shallow-grave-printing-nonfoil");
  assert.equal(snapshot.context.selectedPrintingId, snapshot.assetContext.printingId);
  assert.equal(snapshot.context.selectedVariantId, snapshot.assetContext.variantId);
});

test("condition changes create a new context generation and own refreshed market snapshots", () => {
  let snapshot = runWorkflow([
    createWorkflowCommand("SearchCards", { query: "chrome mox" }),
    createWorkflowCommand(
      "LoadSearchResults",
      { results: [chromeMox] },
      "SearchEngine",
    ),
    createWorkflowCommand("SelectCard", {
      identity: chromeMox,
      identityCount: 1,
    }),
    createWorkflowCommand("SelectPrinting", {
      identityCount: 1,
      printing: chromeMox.printings[0],
      printingCount: 2,
    }),
  ]);
  const conditions = ["NM", "LP", "MP", "HP", "DMG"] as const;

  for (const condition of conditions) {
    snapshot = processWorkflowCommand(
      snapshot,
      createWorkflowCommand("ChangeCondition", { condition }),
    ).workflow;
    const conditionGeneration = snapshot.assetContext.generation;

    snapshot = processWorkflowCommand(
      snapshot,
      createWorkflowCommand(
        "LoadMarketSnapshot",
        {
          assetContextGeneration: conditionGeneration,
          printingId: snapshot.assetContext.printingId,
          providerId: "test-market",
          updatedAt: `2026-01-01T00:00:0${conditions.indexOf(condition)}.000Z`,
          variantId: snapshot.assetContext.variantId,
        },
        "MarketProvider",
      ),
    ).workflow;

    assert.equal(snapshot.assetContext.condition, condition);
    assert.equal(snapshot.assetContext.generation, conditionGeneration);
    assert.ok(snapshot.assetContext.marketSnapshotId.includes("test-market"));
    assert.ok(snapshot.loadedObjects.includes("Offer Ladder"));
    assert.ok(snapshot.loadedObjects.includes("Decision"));
  }
});

test("repeated selection of the same card avoids unnecessary reload", () => {
  const ready = runWorkflow([
    createWorkflowCommand("SearchCards", { query: "mox opal" }),
    createWorkflowCommand(
      "LoadSearchResults",
      { results: [moxOpal] },
      "SearchEngine",
    ),
  ]);
  const repeated = processWorkflowCommand(
    ready,
    createWorkflowCommand("SelectCard", {
      identity: moxOpal,
      identityCount: 1,
    }),
  ).workflow;

  assert.equal(repeated.state, ready.state);
  assert.deepEqual(repeated.invalidatedObjects, []);
  assert.deepEqual(repeated.loadedObjects, []);
  assert.equal(repeated.context.selectedPrintingId, "mox-opal-judge");
});

test("reset command returns to idle", () => {
  const searching = processWorkflowCommand(
    initialVendorWorkflowSnapshot,
    createWorkflowCommand("SearchCards", { query: "chrome mox" }),
  ).workflow;
  const reset = processWorkflowCommand(
    searching,
    createWorkflowCommand("ResetWorkspace", {}),
  ).workflow;

  assert.equal(reset.state, "Idle");
});

test("no search results reaches error instead of a partial state", () => {
  const snapshot = runWorkflow([
    createWorkflowCommand("SearchCards", { query: "missing" }),
    createWorkflowCommand("LoadSearchResults", { results: [] }, "SearchEngine"),
  ]);

  assert.equal(snapshot.state, "Error");
  assert.equal(snapshot.errorMessage, "No card identities found.");
  assert.equal(snapshot.context.selectedIdentityId, "");
});
