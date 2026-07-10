import assert from "node:assert/strict";
import test from "node:test";
import {
  createVendorSelectionUrl,
  getWorkflowActionLabel,
} from "../components/search/CommandPaletteRouter.ts";

const selection = {
  condition: "NM" as const,
  identityId: "mulan",
  printing: {
    finish: "Multiple",
    game: "Lorcana" as const,
    id: "mulan-1",
    imageUrl: "",
    name: "Mulan",
    number: "118",
    rarity: "Rare",
    set: "The First Chapter",
  },
  query: "Mulan",
  variant: {
    finish: "Cold Foil",
    id: "mulan-1:cold-foil",
    isAvailable: true,
    printingId: "mulan-1",
    source: "Identity",
  },
};

test("uses workflow-specific action labels", () => {
  assert.equal(getWorkflowActionLabel("MarketWatch"), "Add to Watchlist");
  assert.equal(getWorkflowActionLabel("VendorWorkspace"), "Open Purchase Evaluation");
  assert.equal(getWorkflowActionLabel("General"), "Open Vendor Workspace");
});

test("routes a completed asset selection without market-provider fields", () => {
  const url = createVendorSelectionUrl(selection);
  assert.match(url, /^\/vendor\?/);
  assert.match(url, /search=Mulan/);
  assert.match(url, /printingId=mulan-1/);
  assert.match(url, /variantId=mulan-1%3Acold-foil/);
  assert.match(url, /condition=NM/);
  assert.doesNotMatch(url, /price|provider|market/i);
});
