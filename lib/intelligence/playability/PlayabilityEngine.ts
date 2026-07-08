import type { Card } from "@/types/card";
import type {
  PlayabilityBanStatus,
  PlayabilityFormat,
  PlayabilityIndicator,
} from "@/lib/intelligence/playability/PlayabilityIndicator";
import type { PlayabilityProfile, PlayabilityTier } from "@/lib/intelligence/playability/PlayabilityProfile";
import type {
  PlayabilityProvider,
  PlayabilityProviderContext,
} from "@/lib/intelligence/playability/PlayabilityProvider";
import {
  playabilityFormats,
  playabilityRegistry,
} from "@/lib/intelligence/playability/PlayabilityRegistry";

const scryfallLegalitiesByFormat: Partial<Record<PlayabilityFormat, string>> = {
  Commander: "commander",
  Modern: "modern",
  Legacy: "legacy",
  Vintage: "vintage",
  Pioneer: "pioneer",
  Standard: "standard",
  Pauper: "pauper",
  Explorer: "explorer",
};

function clampScore(score: number) {
  return Math.min(100, Math.max(0, Math.round(score)));
}

function scoreFromStatus(status: PlayabilityBanStatus) {
  if (status === "Legal") {
    return 70;
  }

  if (status === "Restricted") {
    return 35;
  }

  if (status === "Banned") {
    return 5;
  }

  return 0;
}

function getTier(score: number): PlayabilityTier {
  if (score >= 80) {
    return "Excellent";
  }

  if (score >= 65) {
    return "High";
  }

  if (score >= 40) {
    return "Medium";
  }

  return "Low";
}

function normalizeScryfallLegality(value?: string): PlayabilityBanStatus {
  if (value === "legal") {
    return "Legal";
  }

  if (value === "restricted") {
    return "Restricted";
  }

  if (value === "banned") {
    return "Banned";
  }

  return "Unknown";
}

function createWaitingIndicator(
  context: PlayabilityProviderContext,
): PlayabilityIndicator {
  const timestamp = new Date().toISOString();

  return {
    format: context.format,
    score: 0,
    confidence: 0,
    trend: "Unknown",
    availability: "WAITING_FOR_PROVIDER",
    dataSource: "Future Provider",
    status: "Unknown",
    lastUpdated: timestamp,
    metaStability: "Unknown",
    deckPenetration: {
      percentage: null,
      sampleSize: null,
      confidence: 0,
      status: "WAITING_FOR_PROVIDER",
    },
    explanation: `${context.format} play demand is waiting for a provider.`,
  };
}

export class ScryfallPlayabilityProvider implements PlayabilityProvider {
  readonly id = "scryfall-playability";
  readonly name = "Scryfall Playability Provider";
  readonly supportedFormats = playabilityFormats.filter(
    (format) => format !== "Overall",
  );

  getFormatIndicator(
    context: PlayabilityProviderContext,
  ): PlayabilityIndicator | null {
    const legalityKey = scryfallLegalitiesByFormat[context.format];

    if (!legalityKey) {
      return null;
    }

    const legalities = context.card.legalities;

    if (!legalities) {
      return createWaitingIndicator(context);
    }

    const status = normalizeScryfallLegality(legalities[legalityKey]);
    const score = scoreFromStatus(status);
    const timestamp = new Date().toISOString();

    return {
      format: context.format,
      score,
      confidence: status === "Unknown" ? 20 : 65,
      trend: "Unknown",
      availability: "LIVE",
      dataSource: "Scryfall",
      status,
      lastUpdated: timestamp,
      metaStability: "Unknown",
      deckPenetration: {
        percentage: null,
        sampleSize: null,
        confidence: 0,
        status: "PLACEHOLDER",
      },
      explanation: `${context.format} status is ${status.toLowerCase()} from Scryfall legalities. Deck penetration and metagame movement are reserved for future providers.`,
    };
  }
}

playabilityRegistry.register(new ScryfallPlayabilityProvider());

function createOverallIndicator(
  card: Card,
  formatIndicators: PlayabilityIndicator[],
): PlayabilityIndicator {
  const scoredIndicators = formatIndicators.filter(
    (indicator) => indicator.availability === "LIVE",
  );
  const legalFormats = scoredIndicators.filter(
    (indicator) => indicator.status === "Legal" || indicator.status === "Restricted",
  );
  const score =
    scoredIndicators.length > 0
      ? clampScore(
          scoredIndicators.reduce((sum, indicator) => sum + indicator.score, 0) /
            scoredIndicators.length,
        )
      : card.game === "Magic"
        ? 45
        : 0;
  const confidence =
    scoredIndicators.length > 0
      ? clampScore(
          scoredIndicators.reduce(
            (sum, indicator) => sum + indicator.confidence,
            0,
          ) / scoredIndicators.length,
        )
      : 20;
  const dataSource = scoredIndicators.length > 0 ? "Scryfall" : "Placeholder";

  return {
    format: "Overall",
    score,
    confidence,
    trend: "Unknown",
    availability: scoredIndicators.length > 0 ? "LIVE" : "PLACEHOLDER",
    dataSource,
    status: legalFormats.length > 0 ? "Legal" : "Unknown",
    lastUpdated: new Date().toISOString(),
    metaStability: "Unknown",
    deckPenetration: {
      percentage: null,
      sampleSize: null,
      confidence: 0,
      status: "PLACEHOLDER",
    },
    explanation:
      legalFormats.length > 0
        ? `Legal or restricted in ${legalFormats.length} tracked format${legalFormats.length === 1 ? "" : "s"}. Metagame and deck penetration providers can raise confidence later.`
        : "Playability uses placeholder metadata until legalities or format providers are available.",
  };
}

function averageIndicators(
  format: PlayabilityFormat,
  indicators: PlayabilityIndicator[],
  explanation: string,
) {
  const score = clampScore(
    indicators.reduce((sum, indicator) => sum + indicator.score, 0) /
      Math.max(1, indicators.length),
  );
  const confidence = clampScore(
    indicators.reduce((sum, indicator) => sum + indicator.confidence, 0) /
      Math.max(1, indicators.length),
  );

  return {
    ...indicators[0],
    format,
    score,
    confidence,
    explanation,
  };
}

export function createPlayabilityProfile(card: Card): PlayabilityProfile {
  const formatEntries = playabilityFormats
    .filter((format) => format !== "Overall")
    .map((format) => {
      const provider = playabilityRegistry.getProviderForFormat(format);
      const indicator =
        provider?.getFormatIndicator({ card, format }) ??
        createWaitingIndicator({ card, format });

      return [format, indicator] as const;
    });
  const formatIndicators = formatEntries.map(([, indicator]) => indicator);
  const overall = createOverallIndicator(card, formatIndicators);
  const formats = Object.fromEntries([
    ["Overall", overall],
    ...formatEntries,
  ]) as Record<PlayabilityFormat, PlayabilityIndicator>;
  const competitiveFormats = [
    formats.Modern,
    formats.Legacy,
    formats.Vintage,
    formats.Pioneer,
    formats.Standard,
    formats.Pauper,
    formats.Explorer,
  ];

  return {
    modelId: "playability-intelligence",
    modelName: "Playability Intelligence",
    version: "1.0.0",
    overall,
    formats,
    tier: getTier(overall.score),
    indicators: {
      overallPlayability: overall,
      commanderStrength: formats.Commander,
      competitiveStrength: averageIndicators(
        "Overall",
        competitiveFormats,
        "Competitive strength averages currently tracked constructed formats.",
      ),
      casualStrength: averageIndicators(
        "Overall",
        [formats.Commander, formats["Canadian Highlander"]],
        "Casual strength is prepared around Commander and Canadian Highlander demand.",
      ),
      banRisk: averageIndicators(
        "Overall",
        formatIndicators,
        "Ban risk is provider-ready; Scryfall legalities supply current status only.",
      ),
      formatDiversity: overall,
      metaStability: {
        ...overall,
        score: 0,
        confidence: 0,
        availability: "PLACEHOLDER",
        dataSource: "Placeholder",
        explanation: "Meta stability is prepared for future metagame providers.",
      },
      trend: {
        ...overall,
        score: 0,
        confidence: 0,
        availability: "PLACEHOLDER",
        dataSource: "Placeholder",
        explanation: "Trend is prepared for future usage and metagame providers.",
      },
    },
    explanation: `${card.name} has ${getTier(overall.score).toLowerCase()} playability based on current provider coverage. Playability measures demand only; strategies decide how to use it.`,
    providerRoadmap: ["EDHREC", "MTGGoldfish", "Melee", "MTGO", "Top8"],
    dependencyGraph: [
      "Playability Intelligence",
      "Playability Engine",
      "Playability Provider Registry",
      "Scryfall Legalities",
      "Future Format Providers",
      "Strategy",
      "Negotiation Ladder",
      "Decision Resolver",
    ],
    generatedAt: new Date().toISOString(),
  };
}
