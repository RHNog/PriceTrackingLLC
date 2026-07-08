import type { ProviderCoverage } from "@/lib/providers/sdk/ProviderCoverage";
import type { ProviderEvidence } from "@/lib/providers/sdk/ProviderEvidence";
import type { ProviderHealth } from "@/lib/providers/sdk/ProviderHealth";
import type { ProviderMetadata } from "@/lib/providers/sdk/ProviderMetadata";

export interface ProviderDiagnostics {
  cacheStatus: "HIT" | "MISS" | "BYPASS" | "UNAVAILABLE";
  coverage: ProviderCoverage;
  durationMs: number;
  evidence: ProviderEvidence[];
  health: ProviderHealth;
  metadata: ProviderMetadata;
  normalized: boolean;
  validationMessages: string[];
}

export function createProviderDiagnostics(input: {
  cacheStatus?: ProviderDiagnostics["cacheStatus"];
  coverage: ProviderCoverage;
  durationMs?: number;
  evidence: ProviderEvidence[];
  health: ProviderHealth;
  metadata: ProviderMetadata;
  normalized?: boolean;
  validationMessages?: string[];
}): ProviderDiagnostics {
  return {
    cacheStatus: input.cacheStatus ?? "UNAVAILABLE",
    coverage: input.coverage,
    durationMs: input.durationMs ?? 0,
    evidence: input.evidence,
    health: input.health,
    metadata: input.metadata,
    normalized: input.normalized ?? false,
    validationMessages: input.validationMessages ?? [],
  };
}
