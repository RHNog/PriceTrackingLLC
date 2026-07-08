import type { ProviderDiagnostics } from "@/lib/providers/sdk/ProviderDiagnostics";

export type ProviderResultStatus =
  | "SUCCESS"
  | "PARTIAL"
  | "WAITING_FOR_INTEGRATION"
  | "FAILED";

export interface ProviderResult<TData> {
  data: TData | null;
  diagnostics: ProviderDiagnostics;
  errorMessage?: string;
  status: ProviderResultStatus;
}
