import type { ProviderCoverage } from "@/lib/providers/sdk/ProviderCoverage";
import type { ProviderEvidence } from "@/lib/providers/sdk/ProviderEvidence";
import type { ProviderHealth } from "@/lib/providers/sdk/ProviderHealth";
import type { ProviderMetadata } from "@/lib/providers/sdk/ProviderMetadata";
import type { ProviderResult } from "@/lib/providers/sdk/ProviderResult";

export interface ProviderAdapter<TRaw, TNormalized, TContext = unknown> {
  readonly metadata: ProviderMetadata;
  getCoverage(context?: TContext): ProviderCoverage;
  getHealth(): ProviderHealth;
  mapEvidence(normalized: TNormalized | null): ProviderEvidence[];
  normalize(raw: TRaw, context?: TContext): TNormalized;
  validate?(raw: TRaw, context?: TContext): string[];
  createWaitingResult(context?: TContext): ProviderResult<TNormalized>;
}
