import type { Card } from "@/types/card";
import type { KnowledgeEdge, KnowledgeRelationshipType } from "@/lib/knowledge/KnowledgeEdge";
import type { KnowledgeNode, KnowledgeNodeKind } from "@/lib/knowledge/KnowledgeNode";

export interface RegisteredRelationship {
  confidence: number;
  evidence: string;
  kind: KnowledgeNodeKind;
  label: string;
  relationship: KnowledgeRelationshipType;
}

const formatRelationships: RegisteredRelationship[] = [
  "Commander",
  "Modern",
  "Legacy",
  "Vintage",
  "Pioneer",
  "Standard",
  "Pauper",
  "Explorer",
].map((format) => ({
  confidence: 95,
  evidence: "Configured format relationship.",
  kind: "Format" as const,
  label: format,
  relationship: "has_format_context" as const,
}));

const relationshipsByCardName: Record<string, RegisteredRelationship[]> = {
  "black lotus": [
    role("Fast Mana"),
    role("Combo Piece"),
    role("Collector Card"),
    archetype("Vintage Power"),
    strategy("Explosive Mana"),
    family("Power Nine"),
    reservedList(),
  ],
  "collected company": [
    role("Engine"),
    role("Value Card"),
    role("Combo Piece"),
    archetype("Creature Toolbox"),
    strategy("Instant-Speed Creature Selection"),
    theme("Creature Decks"),
  ],
  counterspell: [
    role("Counterspell"),
    role("Protection"),
    role("Utility"),
    mechanic("Permission"),
    strategy("Stack Interaction"),
    colorIdentity("Blue"),
  ],
  "mox opal": [
    role("Fast Mana"),
    role("Combo Piece"),
    role("Artifact Synergy"),
    role("Competitive Staple"),
    role("Collector Card"),
    archetype("Artifact Combo"),
    archetype("Artifact Aggro"),
    strategy("Zero-Mana Acceleration"),
    theme("Artifacts"),
    mechanic("Metalcraft"),
    family("Mox"),
  ],
  "sol ring": [
    role("Fast Mana"),
    role("Commander Staple"),
    role("Ramp"),
    role("Collector Card"),
    archetype("Commander Staples"),
    strategy("Mana Acceleration"),
    theme("Artifacts"),
  ],
};

function relationship(
  label: string,
  kind: KnowledgeNodeKind,
  relationshipType: KnowledgeRelationshipType,
): RegisteredRelationship {
  return {
    confidence: 82,
    evidence: "Configured asset relationship.",
    kind,
    label,
    relationship: relationshipType,
  };
}

function role(label: string) {
  return relationship(label, "Role", "has_role");
}

function mechanic(label: string) {
  return relationship(label, "Mechanic", "has_mechanic");
}

function theme(label: string) {
  return relationship(label, "Theme", "has_theme");
}

function archetype(label: string) {
  return relationship(label, "Archetype", "has_archetype");
}

function strategy(label: string) {
  return relationship(label, "Strategy", "has_strategy");
}

function colorIdentity(label: string) {
  return relationship(label, "Color Identity", "has_color_identity");
}

function family(label: string) {
  return relationship(label, "Family", "belongs_to_family");
}

function reservedList() {
  return relationship("Reserved List", "Reserved List", "has_reserved_list_status");
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export class RelationshipRegistry {
  getRelationships(card: Card): RegisteredRelationship[] {
    const key = card.name.toLowerCase();

    return [
      ...formatRelationships,
      ...(relationshipsByCardName[key] ?? []),
      ...this.getMetadataRelationships(card),
    ];
  }

  createNode(relationshipEntry: RegisteredRelationship): KnowledgeNode {
    return {
      id: `${relationshipEntry.kind}:${slug(relationshipEntry.label)}`,
      kind: relationshipEntry.kind,
      label: relationshipEntry.label,
    };
  }

  createEdge(
    assetNode: KnowledgeNode,
    targetNode: KnowledgeNode,
    relationshipEntry: RegisteredRelationship,
  ): KnowledgeEdge {
    return {
      confidence: relationshipEntry.confidence,
      evidence: relationshipEntry.evidence,
      relationship: relationshipEntry.relationship,
      sourceId: assetNode.id,
      sourceKind: assetNode.kind,
      targetId: targetNode.id,
      targetKind: targetNode.kind,
    };
  }

  private getMetadataRelationships(card: Card): RegisteredRelationship[] {
    const metadata = [
      card.productFamily,
      card.treatment,
      card.set,
      card.rarity,
      ...(card.promoTypes ?? []),
      ...(card.frameEffects ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const relationships: RegisteredRelationship[] = [];

    if (metadata.includes("serialized")) {
      relationships.push(relationship("Serialized", "Premium Printing", "has_premium_printing"));
    }

    if (metadata.includes("masterpiece") || metadata.includes("invention")) {
      relationships.push(relationship("Masterpiece", "Premium Printing", "has_premium_printing"));
    }

    if (metadata.includes("judge")) {
      relationships.push(relationship("Judge Promo", "Premium Printing", "has_premium_printing"));
    }

    if (metadata.includes("textless")) {
      relationships.push(relationship("Textless", "Premium Printing", "has_premium_printing"));
    }

    if (metadata.includes("universes beyond")) {
      relationships.push(
        relationship("Universes Beyond", "Universes Beyond", "has_universes_beyond_status"),
      );
    }

    return relationships;
  }
}

export const relationshipRegistry = new RelationshipRegistry();
