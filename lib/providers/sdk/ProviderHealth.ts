export type ProviderHealthStatus =
  | "HEALTHY"
  | "DEGRADED"
  | "WAITING_FOR_INTEGRATION"
  | "UNAVAILABLE";

export interface ProviderHealth {
  checkedAt: string;
  latencyMs: number | null;
  message: string;
  retryable: boolean;
  status: ProviderHealthStatus;
}

export function createWaitingProviderHealth(message: string): ProviderHealth {
  return {
    checkedAt: new Date().toISOString(),
    latencyMs: null,
    message,
    retryable: false,
    status: "WAITING_FOR_INTEGRATION",
  };
}
