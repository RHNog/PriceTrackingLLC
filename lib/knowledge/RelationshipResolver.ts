import type { Card } from "@/types/card";
import { AssetKnowledgeGraph } from "@/lib/knowledge/AssetKnowledgeGraph";
import { relationshipRegistry } from "@/lib/knowledge/RelationshipRegistry";
import type { KnowledgeNode } from "@/lib/knowledge/KnowledgeNode";

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export class RelationshipResolver {
  resolve(card: Card): AssetKnowledgeGraph {
    const assetNode: KnowledgeNode = {
      id: `Asset:${card.id || slug(card.name)}`,
      kind: "Asset",
      label: card.name,
    };
    const graph = new AssetKnowledgeGraph(assetNode);

    for (const relationship of relationshipRegistry.getRelationships(card)) {
      const targetNode = relationshipRegistry.createNode(relationship);

      graph.addNode(targetNode);
      graph.addEdge(
        relationshipRegistry.createEdge(assetNode, targetNode, relationship),
      );
    }

    return graph;
  }
}

export const relationshipResolver = new RelationshipResolver();
