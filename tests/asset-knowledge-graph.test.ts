import assert from "node:assert/strict";
import test from "node:test";
import { knowledgeGraphRegistry } from "@/lib/knowledge/KnowledgeGraphRegistry";
import type { Card } from "@/types/card";

function createMagicCard(name: string): Card {
  return {
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    game: "Magic",
    set: "Test Set",
    number: "1",
    rarity: "Rare",
    finish: "Nonfoil",
    imageUrl: "https://example.com/card.jpg",
  };
}

test("Asset Knowledge Graph generates requested card relationships", () => {
  const expectations = [
    {
      archetype: "Artifact Combo",
      name: "Mox Opal",
      roles: [
        "Fast Mana",
        "Combo Piece",
        "Artifact Synergy",
        "Competitive Staple",
        "Collector Card",
      ],
    },
    {
      archetype: "Commander Staples",
      name: "Sol Ring",
      roles: ["Fast Mana", "Commander Staple", "Ramp", "Collector Card"],
    },
    {
      archetype: "Creature Toolbox",
      name: "Collected Company",
      roles: ["Engine", "Value Card", "Combo Piece"],
    },
    {
      archetype: null,
      name: "Counterspell",
      roles: ["Counterspell", "Protection", "Utility"],
    },
    {
      archetype: "Vintage Power",
      name: "Black Lotus",
      roles: ["Fast Mana", "Combo Piece", "Collector Card"],
    },
  ];

  for (const expectation of expectations) {
    const graph = knowledgeGraphRegistry.resolve(createMagicCard(expectation.name));
    const roles = graph.labelsByKind("Role");
    const formats = graph.labelsByKind("Format");

    for (const role of expectation.roles) {
      assert.ok(roles.includes(role), `${expectation.name} should include ${role}`);
    }

    assert.ok(formats.includes("Commander"));
    assert.ok(formats.includes("Modern"));
    assert.ok(formats.includes("Legacy"));
    assert.ok(formats.includes("Vintage"));

    if (expectation.archetype) {
      assert.ok(graph.labelsByKind("Archetype").includes(expectation.archetype));
    }
  }
});
