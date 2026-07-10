import assert from "node:assert/strict";
import test from "node:test";
import { adaptIdentityPresentation } from "../lib/engines/identity/IdentityPresentationAdapter.ts";
import { createIdentityPresentationDiagnostics } from "../lib/engines/identity/IdentityPresentationDiagnostics.ts";
import { explicitEvidence, printingFacet, unavailablePhysicalFinish } from "../lib/engines/identity/IdentityOntology.ts";
import { normalizeLorcastCard } from "../lib/providers/lorcast/LorcastNormalizer.ts";
import { adaptScryfallCard } from "../lib/providers/identity/adapters/ScryfallAdapter.ts";

function explicitFinish(value: string) {
  return {
    evidence: explicitEvidence("fixture", "finish", `${value} explicitly supplied.`),
    value,
  };
}

test("translates canonical identity terms into collector vocabulary", () => {
  const presentation = adaptIdentityPresentation({
    cardName: "Example Card",
    collectorNumber: "42",
    language: "English",
    physicalFinish: explicitFinish("Foil"),
    printingDesignFacets: [printingFacet("Borderless", "fixture", "frame")],
    setName: "Example Set",
  });
  assert.equal(presentation.printing.label, "Set");
  assert.equal(presentation.printing.presentationValue, "Example Set #42");
  assert.equal(presentation.treatment.label, "Treatment");
  assert.equal(presentation.treatment.presentationValue, "Borderless");
  assert.equal(presentation.finish.label, "Printing");
  assert.equal(presentation.finish.presentationValue, "Foil");
  assert.equal(presentation.treatment.visible, true);
  assert.equal(presentation.finish.visible, true);
});

test("supports Retro Etched, Enchanted Cold Foil, and Illustration Rare Reverse Holo", () => {
  for (const [treatment, finish] of [
    ["Retro", "Etched"],
    ["Enchanted", "Cold Foil"],
    ["Illustration Rare", "Reverse Holo"],
    ["Showcase", "Foil"],
  ]) {
    const presentation = adaptIdentityPresentation({
      cardName: "Fixture",
      physicalFinish: explicitFinish(finish),
      printingDesignFacets: [printingFacet(treatment, "fixture", "design")],
    });
    assert.equal(presentation.treatment.presentationValue, treatment);
    assert.equal(presentation.finish.presentationValue, finish);
  }
});

test("Scryfall keeps design facets and manufacturing finishes separate", () => {
  const card = adaptScryfallCard({
    border_color: "borderless",
    collector_number: "1",
    finishes: ["foil"],
    frame_effects: ["showcase", "oldframe"],
    id: "fixture-print",
    lang: "en",
    name: "Fixture Card",
    promo_types: ["galaxyfoil"],
    set_name: "Fixture Set",
  });
  assert.ok(card);
  assert.deepEqual(
    card.printingDesignFacets?.map((facet) => facet.value),
    ["Borderless", "Showcase", "Retro"],
  );
  assert.deepEqual(
    card.physicalVariants?.map((variant) => variant.physicalFinish.value),
    ["Galaxy Foil"],
  );
  assert.equal(
    card.printingDesignFacets?.some((facet) => facet.value === "Galaxy Foil"),
    false,
  );
});

test("uses meaningful provider states before Unknown", () => {
  const unavailable = adaptIdentityPresentation({
    cardName: "Mulan",
    physicalFinish: unavailablePhysicalFinish("lorcast"),
  });
  assert.equal(unavailable.finish.presentationValue, "Provider Does Not Supply");
  assert.equal(unavailable.finish.visible, false);
  assert.equal(unavailable.treatment.visible, false);

  const pending = adaptIdentityPresentation({
    cardName: "Future Card",
    physicalFinish: {
      evidence: {
        confidence: 0,
        explanation: "Provider connection pending.",
        providerField: "none",
        providerId: "future",
        state: "Pending Support",
      },
      value: "Pending Support",
    },
  });
  assert.equal(pending.finish.presentationValue, "Pending Provider Support");
  assert.equal(pending.finish.visible, true);
});

test("Lorcast Enchanted remains Treatment and never maps Cold Foil", () => {
  const card = normalizeLorcastCard({
    collector_number: "229",
    id: "mulan-enchanted",
    lang: "en",
    name: "Mulan",
    rarity: "Enchanted",
    set: { code: "11", id: "winterspell", name: "Winterspell" },
    version: "Resourceful Recruit",
  });
  assert.ok(card);
  const presentation = adaptIdentityPresentation({
    cardName: card.name,
    collectorNumber: card.number,
    language: card.language,
    physicalFinish: card.physicalFinish,
    printingDesignFacets: card.printingDesignFacets,
    setName: card.set,
  });
  assert.equal(presentation.treatment.presentationValue, "Enchanted");
  assert.equal(presentation.finish.presentationValue, "Provider Does Not Supply");
  assert.equal(presentation.finish.visible, false);
  assert.equal(presentation.treatment.visible, true);
  assert.equal(presentation.treatment.presentationValue.includes("Cold Foil"), false);
});

test("developer diagnostics preserve canonical and presentation values", () => {
  const diagnostics = createIdentityPresentationDiagnostics(adaptIdentityPresentation({
    cardName: "Mox Opal",
    physicalFinish: explicitFinish("Etched"),
    printingDesignFacets: [printingFacet("Retro", "scryfall", "frame_effects")],
  }));
  assert.deepEqual(
    diagnostics.find((item) => item.presentationLabel === "Treatment"),
    {
      canonicalConcept: "PrintingDesignFacet",
      canonicalValue: "Retro",
      presentationLabel: "Treatment",
      presentationValue: "Retro",
      resolution: "Direct Translation",
      visible: true,
      visibilityReason: "Treatment distinguishes the published design.",
    },
  );
});

test("hides regular printing and standard treatment across supported games", () => {
  for (const game of ["Magic", "Lorcana", "Pokemon", "One Piece"]) {
    const presentation = adaptIdentityPresentation({
      cardName: `${game} Fixture`,
      physicalFinish: explicitFinish("Regular"),
      printingDesignFacets: [],
    });
    assert.equal(presentation.treatment.presentationValue, "Standard");
    assert.equal(presentation.treatment.visible, false);
    assert.equal(presentation.finish.presentationValue, "Regular");
    assert.equal(presentation.finish.visible, false);
  }
});

test("shows only Printing for Cold Foil without special treatment", () => {
  const presentation = adaptIdentityPresentation({
    cardName: "Cold Foil Fixture",
    physicalFinish: explicitFinish("Cold Foil"),
  });
  assert.equal(presentation.treatment.visible, false);
  assert.equal(presentation.finish.label, "Printing");
  assert.equal(presentation.finish.presentationValue, "Cold Foil");
  assert.equal(presentation.finish.visible, true);
});
