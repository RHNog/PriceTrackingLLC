import type { PipelineStage, PipelineStageStatus } from "@/lib/pipeline/PipelineStage";

export interface PipelineReport {
  status: PipelineStageStatus;
  firstInvalidStage?: PipelineStage;
  stages: PipelineStage[];
}

