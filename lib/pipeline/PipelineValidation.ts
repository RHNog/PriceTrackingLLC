import type { PipelineStageStatus } from "@/lib/pipeline/PipelineStage";

export function validateRequiredNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value);
}

export function validateRequiredString(value: unknown) {
  return typeof value === "string" && value.length > 0;
}

export function statusFromMissingFields(
  missingFields: string[],
): PipelineStageStatus {
  return missingFields.length > 0 ? "UNAVAILABLE" : "READY";
}
