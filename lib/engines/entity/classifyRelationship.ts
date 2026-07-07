import { calculateRelationshipWeight } from "@/lib/engines/entity/calculateRelationshipWeight";
import type { Card } from "@/types/card";
import type { EntityRelationshipType } from "@/types/entityRelationship";
import type { IdentityRelationship } from "@/types/identityRelationship";

type RelationshipMetadata = {
  component?: string;
  layout?: string;
  name?: string;
};

function getRelationshipType(metadata: RelationshipMetadata): EntityRelationshipType {
  if (metadata.component === "token") {
    return "TOKEN";
  }

  if (metadata.component === "combo_piece") {
    return "MELD";
  }

  switch (metadata.layout) {
    case "adventure":
      return "ADVENTURE";
    case "class":
    case "normal":
    case "saga":
      return "PRIMARY_CARD";
    case "emblem":
      return "EMBLEM";
    case "meld":
      return "MELD";
    case "modal_dfc":
      return "MODAL_DFC";
    case "plane":
      return "PLANE";
    case "scheme":
      return "SCHEME";
    case "split":
      return "SPLIT_CARD";
    case "token":
      return "TOKEN";
    case "transform":
      return "TRANSFORM";
    case "vanguard":
      return "VANGUARD";
    default:
      return metadata.name?.includes("//") ? "MODAL_DFC" : "UNKNOWN";
  }
}

export function classifyRelationship(
  metadataOrCard: RelationshipMetadata | Card,
): IdentityRelationship {
  if ("identityRelationship" in metadataOrCard && metadataOrCard.identityRelationship) {
    return metadataOrCard.identityRelationship;
  }

  const type = getRelationshipType(metadataOrCard);

  return {
    source: "provider",
    type,
    weight: calculateRelationshipWeight(type),
  };
}
