import type { KnowledgeEdge } from "@/lib/knowledge/KnowledgeEdge";
import type { KnowledgeNode, KnowledgeNodeKind } from "@/lib/knowledge/KnowledgeNode";
import type {
  KnowledgeQuery,
  KnowledgeRelationshipSummary,
} from "@/lib/knowledge/KnowledgeQuery";
import { matchesKnowledgeQuery } from "@/lib/knowledge/KnowledgeQuery";

export class AssetKnowledgeGraph {
  readonly assetId: string;
  private readonly nodeMap = new Map<string, KnowledgeNode>();
  private readonly edgeList: KnowledgeEdge[] = [];

  constructor(asset: KnowledgeNode) {
    this.assetId = asset.id;
    this.addNode(asset);
  }

  addNode(node: KnowledgeNode) {
    this.nodeMap.set(node.id, node);
  }

  addEdge(edge: KnowledgeEdge) {
    this.edgeList.push(edge);
  }

  get nodes() {
    return Array.from(this.nodeMap.values());
  }

  get edges() {
    return [...this.edgeList];
  }

  query(query: KnowledgeQuery): KnowledgeRelationshipSummary[] {
    return this.edgeList
      .filter((edge) => matchesKnowledgeQuery(edge, query))
      .map((edge) => {
        const target = this.nodeMap.get(edge.targetId);

        return {
          confidence: edge.confidence,
          evidence: edge.evidence,
          kind: edge.targetKind,
          label: target?.label ?? edge.targetId,
          relationship: edge.relationship,
        };
      });
  }

  labelsByKind(kind: KnowledgeNodeKind) {
    return this.query({ kinds: [kind] }).map((relationship) => relationship.label);
  }
}
