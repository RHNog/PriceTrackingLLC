import type { ProviderAdapter } from "@/lib/providers/sdk/ProviderAdapter";
import { createProviderDiagnostics } from "@/lib/providers/sdk/ProviderDiagnostics";
import type { ProviderCoverage } from "@/lib/providers/sdk/ProviderCoverage";
import type { ProviderEvidence } from "@/lib/providers/sdk/ProviderEvidence";
import type { ProviderHealth } from "@/lib/providers/sdk/ProviderHealth";
import type { ProviderMetadata } from "@/lib/providers/sdk/ProviderMetadata";
import type { ProviderResult } from "@/lib/providers/sdk/ProviderResult";
import { justTCGMarketCapabilities } from "@/lib/market/ontology/CapabilityRegistry";
import {
  getJustTCGAuthenticationStatus,
} from "@/lib/providers/justtcg/JustTCGDiagnostics";
import {
  normalizeJustTCGCardResponse,
  type JustTCGKnownCardContext,
  type JustTCGNormalizedResponse,
  type JustTCGRawCardResponse,
} from "@/lib/providers/justtcg/JustTCGNormalizer";

export const justTCGMetadata: ProviderMetadata = {
  id: "justtcg",
  name: "JustTCG",
  domain: "market",
  lifecycleStatus: "ACTIVE",
  description:
    "Official SDK-backed live provider connection for trading card market data.",
  supportedInputs: ["Known Card", "Game", "Price History Request"],
  supportedOutputs: [
    "Card Market Data",
    "Variant Pricing",
    "Price History",
    "Price Statistics",
    "Provider Usage",
  ],
  evidenceTypes: [
    "Raw Card Observations",
    "Raw Variant Observations",
    "Variant Valuation Observations",
    "Price History Observations",
    "Provider Statistics Observations",
    "Provider Metadata Observations",
  ],
  version: "justtcg-js@0.2.1",
};

function hasApiKey() {
  return getJustTCGAuthenticationStatus() !== "MISSING_API_KEY";
}

export class JustTCGAdapter
  implements
    ProviderAdapter<
      JustTCGRawCardResponse,
      JustTCGNormalizedResponse,
      JustTCGKnownCardContext
    >
{
  readonly metadata = justTCGMetadata;
  readonly marketCapabilities = justTCGMarketCapabilities;

  getCoverage(context?: JustTCGKnownCardContext): ProviderCoverage {
    return {
      confidence: hasApiKey() ? 85 : 0,
      coverageAreas: [
        "Official SDK Authentication",
        "Known Card Retrieval",
        "Variant Prices",
        "Price History",
        "Price Statistics",
      ],
      gaps: hasApiKey()
        ? [
            "Connectivity sprint only",
            "No caching",
            "No retries",
            "No Assessment, Strategy, Negotiation, or Decision integration",
          ]
        : ["JUSTTCG_API_KEY is not configured."],
      lastMeasuredAt: new Date().toISOString(),
      scope: context?.game ?? "market",
    };
  }

  getHealth(): ProviderHealth {
    if (!hasApiKey()) {
      return {
        checkedAt: new Date().toISOString(),
        latencyMs: null,
        message: "JustTCG is not configured because JUSTTCG_API_KEY is missing.",
        retryable: false,
        status: "UNAVAILABLE",
      };
    }

    return {
      checkedAt: new Date().toISOString(),
      latencyMs: null,
      message: "JustTCG SDK is configured and ready for live provider requests.",
      retryable: true,
      status: "HEALTHY",
    };
  }

  mapEvidence(normalized: JustTCGNormalizedResponse | null): ProviderEvidence[] {
    const hasCards = Boolean(normalized?.cards.length);
    const confidence = hasCards ? 85 : 0;
    const status = hasCards ? "AVAILABLE" : "UNAVAILABLE";

    return this.metadata.evidenceTypes.map((evidenceType) => ({
      confidenceContribution: confidence,
      evidenceType,
      explanation: hasCards
        ? `${evidenceType} is mapped from normalized JustTCG SDK data.`
        : `${evidenceType} requires a successful JustTCG SDK response.`,
      mappedIndicatorIds: [],
      source: this.metadata.name,
      status,
    }));
  }

  normalize(
    raw: JustTCGRawCardResponse,
    context?: JustTCGKnownCardContext,
  ): JustTCGNormalizedResponse {
    return normalizeJustTCGCardResponse(raw, context);
  }

  validate(raw: JustTCGRawCardResponse): string[] {
    const messages: string[] = [];

    if (raw.error) {
      messages.push(raw.code ? `${raw.code}: ${raw.error}` : raw.error);
    }

    if (!raw.data.length) {
      messages.push("JustTCG returned no cards for the known-card request.");
    }

    if (!raw.data.some((card) => card.variants.length > 0)) {
      messages.push("JustTCG returned no variants for the known-card request.");
    }

    return messages;
  }

  createWaitingResult(
    context?: JustTCGKnownCardContext,
  ): ProviderResult<JustTCGNormalizedResponse> {
    return {
      data: null,
      diagnostics: createProviderDiagnostics({
        coverage: this.getCoverage(context),
        evidence: this.mapEvidence(null),
        health: this.getHealth(),
        metadata: this.metadata,
        normalized: false,
        validationMessages: hasApiKey()
          ? ["Live JustTCG request has not run in this registry snapshot."]
          : ["JUSTTCG_API_KEY is required for live JustTCG requests."],
      }),
      status: hasApiKey() ? "PARTIAL" : "FAILED",
    };
  }
}
