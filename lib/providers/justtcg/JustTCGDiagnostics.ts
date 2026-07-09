import type { ProviderDiagnostics } from "@/lib/providers/sdk/ProviderDiagnostics";
import type { ProviderResultStatus } from "@/lib/providers/sdk/ProviderResult";
import type { JustTCGNormalizedResponse } from "@/lib/providers/justtcg/JustTCGNormalizer";

export type JustTCGAuthenticationStatus =
  | "CONFIGURED"
  | "MISSING_API_KEY"
  | "AUTHENTICATED"
  | "FAILED";

export type JustTCGConnectionStatus =
  | "READY"
  | "CONNECTED"
  | "FAILED"
  | "NOT_CONFIGURED";

export type JustTCGInspectionResult = {
  authenticationStatus: JustTCGAuthenticationStatus;
  connectionStatus: JustTCGConnectionStatus;
  diagnostics: ProviderDiagnostics;
  normalized: JustTCGNormalizedResponse | null;
  providerResultStatus: ProviderResultStatus;
  rawSdkResponse: unknown;
};

export function getJustTCGAuthenticationStatus(): JustTCGAuthenticationStatus {
  return process.env.JUSTTCG_API_KEY ? "CONFIGURED" : "MISSING_API_KEY";
}

export function createJustTCGConnectionStatus(input: {
  errorMessage?: string;
  normalized: JustTCGNormalizedResponse | null;
}) {
  if (!process.env.JUSTTCG_API_KEY) {
    return {
      authenticationStatus: "MISSING_API_KEY" as const,
      connectionStatus: "NOT_CONFIGURED" as const,
    };
  }

  if (input.errorMessage) {
    return {
      authenticationStatus: "FAILED" as const,
      connectionStatus: "FAILED" as const,
    };
  }

  if (input.normalized?.cards.length) {
    return {
      authenticationStatus: "AUTHENTICATED" as const,
      connectionStatus: "CONNECTED" as const,
    };
  }

  return {
    authenticationStatus: "CONFIGURED" as const,
    connectionStatus: "READY" as const,
  };
}
