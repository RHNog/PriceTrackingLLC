import type { Card } from "@/types/card";
import type { IdentityProviderLifecycle } from "@/lib/engines/identity/IdentityProviderCapability";

export type IdentityOrchestrationStatus =
  | "OPERATIONAL"
  | "NO_MATCH"
  | "PROVIDER_PENDING"
  | "PROVIDER_NOT_CONFIGURED"
  | "PROVIDER_OFFLINE";

export type IdentityProviderDiagnostics = {
  canonicalIdentities: string[];
  fallbackProvider?: string;
  game: Card["game"] | "Unknown";
  lifecycle: IdentityProviderLifecycle;
  normalizationSource: string;
  providerConfidence: number;
  providerId?: string;
  providerSelected?: string;
  searchLatencyMs: number;
  selectionReason: string;
  status: IdentityOrchestrationStatus;
};
