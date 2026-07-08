import type { CardConditionCode } from "@/types/conditionProfile";

export type AssetContextValidationStatus = "Valid" | "Invalid" | "Incomplete";

export interface AssetContext {
  id: string;
  identityId: string;
  printingId: string;
  variantId: string;
  condition: CardConditionCode;
  marketContextId: string;
  strategyId: string;
  marketSnapshotId: string;
  cardProfileId: string;
  offerLadderId: string;
  decisionId: string;
  generation: number;
  updatedAt: string;
}
