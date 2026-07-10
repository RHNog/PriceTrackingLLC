import type { LorcastErrorKind } from "@/lib/providers/lorcast/LorcastTypes";

export type LorcastDiagnostics = {
  cacheAgeMs: number | null;
  cacheStatus: "HIT" | "MISS";
  durationMs: number;
  errorKind?: LorcastErrorKind;
  errorMessage?: string;
  httpStatus?: number;
  normalizedCount: number;
  providerId: "lorcast";
  query: string;
  requestUrl?: string;
  unique: "prints";
};
