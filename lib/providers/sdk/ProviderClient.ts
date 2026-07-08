import type { ProviderAdapter } from "@/lib/providers/sdk/ProviderAdapter";
import type { ProviderCache } from "@/lib/providers/sdk/ProviderCache";
import { createProviderDiagnostics } from "@/lib/providers/sdk/ProviderDiagnostics";
import type { ProviderResult } from "@/lib/providers/sdk/ProviderResult";

export interface ProviderClientHooks<TRaw, TContext> {
  fetchRaw?: (context: TContext) => Promise<TRaw>;
  getCacheKey?: (context: TContext) => string;
  retry?: (operation: () => Promise<TRaw>) => Promise<TRaw>;
}

export class ProviderClient<TRaw, TNormalized, TContext = unknown> {
  constructor(
    private readonly adapter: ProviderAdapter<TRaw, TNormalized, TContext>,
    private readonly cache?: ProviderCache<TRaw>,
    private readonly hooks: ProviderClientHooks<TRaw, TContext> = {},
  ) {}

  async execute(context: TContext): Promise<ProviderResult<TNormalized>> {
    const startedAt = Date.now();
    const cacheKey = this.hooks.getCacheKey?.(context);
    const cached = cacheKey ? this.cache?.get(cacheKey) : null;

    if (cached) {
      const normalized = this.adapter.normalize(cached.value, context);

      return {
        data: normalized,
        diagnostics: createProviderDiagnostics({
          cacheStatus: "HIT",
          coverage: this.adapter.getCoverage(context),
          durationMs: Date.now() - startedAt,
          evidence: this.adapter.mapEvidence(normalized),
          health: this.adapter.getHealth(),
          metadata: this.adapter.metadata,
          normalized: true,
        }),
        status: "SUCCESS",
      };
    }

    if (!this.hooks.fetchRaw) {
      return this.adapter.createWaitingResult(context);
    }

    try {
      const operation = () => this.hooks.fetchRaw?.(context) as Promise<TRaw>;
      const raw = this.hooks.retry
        ? await this.hooks.retry(operation)
        : await operation();
      const validationMessages = this.adapter.validate?.(raw, context) ?? [];

      if (cacheKey) {
        this.cache?.set(cacheKey, raw, 5 * 60 * 1000);
      }

      const normalized = this.adapter.normalize(raw, context);

      return {
        data: normalized,
        diagnostics: createProviderDiagnostics({
          cacheStatus: cacheKey ? "MISS" : "BYPASS",
          coverage: this.adapter.getCoverage(context),
          durationMs: Date.now() - startedAt,
          evidence: this.adapter.mapEvidence(normalized),
          health: this.adapter.getHealth(),
          metadata: this.adapter.metadata,
          normalized: true,
          validationMessages,
        }),
        status: validationMessages.length > 0 ? "PARTIAL" : "SUCCESS",
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown provider error.";

      return {
        data: null,
        diagnostics: createProviderDiagnostics({
          cacheStatus: cacheKey ? "MISS" : "BYPASS",
          coverage: this.adapter.getCoverage(context),
          durationMs: Date.now() - startedAt,
          evidence: this.adapter.mapEvidence(null),
          health: this.adapter.getHealth(),
          metadata: this.adapter.metadata,
          validationMessages: [message],
        }),
        errorMessage: message,
        status: "FAILED",
      };
    }
  }
}
