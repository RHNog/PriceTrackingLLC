import type { AssetContext } from "@/types/AssetContext";

export type VendorWorkflowState =
  | "Idle"
  | "Searching"
  | "CandidatesFound"
  | "IdentityHighlighted"
  | "IdentitySelected"
  | "PrintingsLoaded"
  | "PrintingSelected"
  | "VariantResolved"
  | "ConditionResolved"
  | "ReadyForEvaluation"
  | "Evaluating"
  | "EvaluationComplete"
  | "Error";

export type WorkflowOwnedObject =
  | "Identity"
  | "Printing"
  | "Variant"
  | "Condition"
  | "Market Context"
  | "Market Estimate"
  | "Card Intelligence"
  | "Offer Ladder"
  | "Decision"
  | "Evaluation";

export interface VendorWorkflowContext {
  askingPrice: string;
  highlightedIdentityId: string;
  marketContextId: string;
  selectedCondition: string;
  selectedIdentityId: string;
  selectedPrintingId: string;
  selectedStrategyId: string;
  selectedVariantId: string;
}

export interface VendorWorkflowSnapshot {
  assetContext: AssetContext;
  state: VendorWorkflowState;
  previousState?: VendorWorkflowState;
  nextState?: VendorWorkflowState;
  commandLog: string[];
  context: VendorWorkflowContext;
  identityCount: number;
  printingCount: number;
  autoSelectionReason?: string;
  errorMessage?: string;
  invalidatedObjects: WorkflowOwnedObject[];
  loadedObjects: WorkflowOwnedObject[];
  lastCommand: string;
  rejectedCommands: string[];
  rejectionReason?: string;
  singlePrintingRuleActivated: boolean;
  executionStartedAt: string;
  executionDurationMs: number;
}
