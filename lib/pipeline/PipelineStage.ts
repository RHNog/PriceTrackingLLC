export type PipelineStageName =
  | "Asset"
  | "Market"
  | "Business"
  | "Cost Profile"
  | "Offer Policy"
  | "Strategy"
  | "Offer Ladder"
  | "Decision";

export type PipelineStageStatus =
  | "READY"
  | "UNAVAILABLE"
  | "INVALID"
  | "SKIPPED";

export interface PipelineStage {
  name: PipelineStageName;
  receivedInputs: Record<string, unknown>;
  calculatedOutputs: Record<string, unknown>;
  validationStatus: PipelineStageStatus;
  fallbacksUsed: string[];
  missingFields: string[];
  executionTimeMs: number;
  reason?: string;
}

