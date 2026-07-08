import type { EvaluationSnapshot } from "@/types/EvaluationSnapshot";

export type SnapshotValidationResult = {
  errors: string[];
  valid: boolean;
};

function isReadyNumber(value: number) {
  return Number.isFinite(value);
}

export function validateEvaluationSnapshot(
  snapshot: EvaluationSnapshot,
): SnapshotValidationResult {
  const errors: string[] = [];

  if (!snapshot.id) {
    errors.push("Snapshot id is required.");
  }

  if (!snapshot.timestamp) {
    errors.push("Snapshot timestamp is required.");
  }

  if (!snapshot.asset.assetContextId || snapshot.asset.assetContextGeneration < 1) {
    errors.push("Asset Context is incomplete.");
  }

  if (
    !snapshot.asset.identity.id ||
    !snapshot.asset.printing.id ||
    !snapshot.asset.variant.id
  ) {
    errors.push("Asset Snapshot is missing identity, printing, or variant id.");
  }

  if (!snapshot.market.marketSnapshotId || !isReadyNumber(snapshot.market.price)) {
    errors.push("Market Snapshot is incomplete.");
  }

  if (
    !snapshot.offerLadder.offerLadderId ||
    !isReadyNumber(snapshot.offerLadder.openingOffer) ||
    !isReadyNumber(snapshot.offerLadder.targetOffer) ||
    !isReadyNumber(snapshot.offerLadder.maximumBuyPrice)
  ) {
    errors.push("Offer Ladder Snapshot is incomplete.");
  }

  if (
    snapshot.offerLadder.openingOffer > snapshot.offerLadder.targetOffer ||
    snapshot.offerLadder.targetOffer > snapshot.offerLadder.maximumBuyPrice
  ) {
    errors.push("Offer Ladder Snapshot violates ladder ordering.");
  }

  if (!snapshot.decision.action || !isReadyNumber(snapshot.decision.confidence)) {
    errors.push("Decision Snapshot is incomplete.");
  }

  return {
    errors,
    valid: errors.length === 0,
  };
}
