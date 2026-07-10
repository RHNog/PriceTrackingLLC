import type { InventoryInstance, OwnershipRelationship } from "@/types/identityOntology";

export class OwnershipRepository {
  private readonly inventory = new Map<string, InventoryInstance>();
  private readonly ownership = new Map<string, OwnershipRelationship>();

  addInventoryInstance(instance: InventoryInstance) {
    this.inventory.set(instance.inventoryInstanceId, instance);
    return instance;
  }

  relateOwnership(relationship: OwnershipRelationship) {
    if (!this.inventory.has(relationship.inventoryInstanceId)) {
      throw new Error("Ownership requires an existing Inventory Instance.");
    }
    this.ownership.set(relationship.ownershipRelationshipId, relationship);
    return relationship;
  }

  getInventoryInstance(inventoryInstanceId: string) {
    return this.inventory.get(inventoryInstanceId);
  }

  listOwnedBy(ownerId: string) {
    return [...this.ownership.values()]
      .filter((relationship) => relationship.ownerId === ownerId && relationship.status === "Owned")
      .map((relationship) => this.inventory.get(relationship.inventoryInstanceId))
      .filter((instance): instance is InventoryInstance => Boolean(instance));
  }
}
