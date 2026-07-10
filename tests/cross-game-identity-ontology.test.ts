import assert from "node:assert/strict";
import test from "node:test";
import { CanonicalCardIdentityAdapter } from "../lib/engines/identity/IdentityProviderAdapter.ts";
import { IdentityMappingRepository } from "../lib/engines/identity/IdentityMappingRepository.ts";
import { migrateIdentityRecord } from "../lib/engines/identity/IdentityMigration.ts";
import { mapTCGplayerSku } from "../lib/providers/market/TCGplayerIdentityAdapter.ts";
import { normalizeLorcastCard } from "../lib/providers/lorcast/LorcastNormalizer.ts";
import { adaptScryfallCard } from "../lib/providers/identity/adapters/ScryfallAdapter.ts";
import { OwnershipRepository } from "../lib/inventory/OwnershipRepository.ts";

test("maps Mulan Enchanted to printing design without inventing physical finish", () => {
  const card = normalizeLorcastCard({
    collector_number: "207",
    id: "lorcast-mulan-enchanted",
    image_uris: { digital: { normal: "https://cards.lorcast.io/mulan.avif" } },
    lang: "en",
    name: "Mulan",
    rarity: "Enchanted",
    set: { code: "1", id: "set-1", name: "The First Chapter" },
    text: "Whenever this character quests, your other characters get +1 strength.",
    type: ["Character"],
    version: "Imperial Soldier",
  });
  assert.ok(card);
  assert.deepEqual(card.printingDesignFacets?.map((facet) => facet.value), ["Enchanted"]);
  assert.equal(card.physicalFinish?.value, "Provider Does Not Supply");
  assert.equal(card.physicalFinish?.evidence.state, "Provider Does Not Supply");
  assert.notEqual(card.physicalFinish?.value, "Cold Foil");
});

test("maps Scryfall oracle, print, finish, and market aliases to separate layers", () => {
  const card = adaptScryfallCard({
    collector_number: "179",
    finishes: ["nonfoil", "foil"],
    id: "scryfall-print-id",
    image_uris: { normal: "https://cards.scryfall.io/mox.jpg" },
    lang: "en",
    name: "Mox Opal",
    oracle_id: "oracle-mox-opal",
    oracle_text: "Metalcraft — Add one mana of any color.",
    rarity: "mythic",
    set: "som",
    set_name: "Scars of Mirrodin",
    tcgplayer_id: 12345,
    type_line: "Legendary Artifact",
  });
  assert.ok(card);
  assert.equal(card.gameplayIdentity?.aliases[0]?.namespace, "oracle");
  assert.equal(card.physicalVariants?.length, 2);
  assert.deepEqual(card.physicalVariants?.map((variant) => variant.physicalFinish.value), ["Normal", "Foil"]);
  assert.equal(card.marketIdentities?.[0]?.providerProductId, "12345");
});

test("canonical adapter migrates legacy cards without removing compatibility fields", () => {
  const compatibilityIdentity = {
    game: "Magic" as const,
    id: "mox-opal",
    name: "Mox Opal",
    printings: [{
      finish: "Nonfoil",
      game: "Magic" as const,
      id: "mox-opal-som",
      imageUrl: "https://example.test/mox.jpg",
      name: "Mox Opal",
      number: "179",
      rarity: "Mythic",
      set: "Scars of Mirrodin",
    }],
  };
  const migrated = migrateIdentityRecord(compatibilityIdentity);
  const canonical = new CanonicalCardIdentityAdapter("Fixture", "fixture")
    .normalizeIdentity(compatibilityIdentity, 90);
  assert.equal(migrated.sourceSchema, "legacy-card-identity");
  assert.equal(canonical.printings[0].id, "mox-opal-som");
  assert.equal(canonical.ontologyVersion, "PHR-ARCH-007");
  assert.equal(canonical.printingIdentities.length, 1);
});

test("TCGplayer product and SKU remain market identity rather than printing identity", () => {
  const mapping = mapTCGplayerSku({
    finishName: "Foil",
    physicalVariantIdentityId: "physical:printing-1:foil",
    product: { categoryId: 1, groupId: 2, name: "Mox Opal", productId: 100 },
    sku: { conditionId: 1, languageId: 1, printingId: 2, productId: 100, skuId: 200 },
  });
  assert.equal(mapping.marketIdentity.providerProductId, "100");
  assert.equal(mapping.marketIdentity.providerSkuId, "200");
  assert.equal(mapping.marketIdentity.providerSegmentation?.providerPrintingId, "2");
  assert.equal(mapping.physicalFinish.value, "Foil");
});

test("ownership relates an owner to an inventory copy, not canonical identity", () => {
  const repository = new OwnershipRepository();
  repository.addInventoryInstance({
    condition: "NM",
    inventoryInstanceId: "copy-1",
    physicalVariantIdentityId: "physical-1",
  });
  repository.relateOwnership({
    inventoryInstanceId: "copy-1",
    ownerId: "owner-1",
    ownershipRelationshipId: "ownership-1",
    startedAt: "2026-07-10T00:00:00.000Z",
    status: "Owned",
  });
  assert.equal(repository.listOwnedBy("owner-1")[0].condition, "NM");
});

test("mapping repository resolves only validated typed aliases", () => {
  const repository = new IdentityMappingRepository();
  const alias = {
    entityType: "PrintingIdentity" as const,
    namespace: "print",
    providerId: "lorcast",
    value: "card-1",
  };
  repository.register({
    canonicalEntityId: "printing:lorcast:card-1",
    canonicalEntityType: "PrintingIdentity",
    confidence: 100,
    evidence: ["Set and collector number match."],
    providerAlias: alias,
    status: "Validated",
    validFrom: "2026-07-10T00:00:00.000Z",
  });
  assert.equal(repository.resolve(alias)?.canonicalEntityId, "printing:lorcast:card-1");
});
