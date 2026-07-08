import type { Card } from "@/types/card";
import {
  playabilityCardDemandHints,
  playabilityFormatWeights,
} from "@/config/playability";
import { knowledgeGraphRegistry } from "@/lib/knowledge/KnowledgeGraphRegistry";
import type {
  PlayabilityBanStatus,
  PlayabilityDemandLevel,
  PlayabilityFormat,
  PlayabilityIndicator,
  PlayabilityRelevanceLevel,
} from "@/lib/intelligence/playability/PlayabilityIndicator";
import type { PlayabilityProfile, PlayabilityTier } from "@/lib/intelligence/playability/PlayabilityProfile";
import { PlaceholderPlayabilityProviderAdapter } from "@/lib/intelligence/playability/PlayabilityProviderAdapter";
import type {
  PlayabilityProvider,
  PlayabilityProviderContext,
} from "@/lib/intelligence/playability/PlayabilityProvider";
import type { PlayabilityRoleSignal } from "@/lib/intelligence/playability/PlayabilityRole";
import type { PlayabilityRole } from "@/lib/intelligence/playability/PlayabilityRole";
import {
  playabilityFormats,
  playabilityRegistry,
} from "@/lib/intelligence/playability/PlayabilityRegistry";

const placeholderProviderAdapter = new PlaceholderPlayabilityProviderAdapter();

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
    return 45;
  }

  if (status === "Restricted") {
    return 28;
  }

  if (status === "Banned") {
    return 0;
  }

  return 0;
}

function getLevel(score: number): PlayabilityDemandLevel {
  if (score >= 85) {
    return "Very High";
  }

  if (score >= 70) {
    return "High";
  }

  if (score >= 45) {
    return "Moderate";
  }

  if (score >= 20) {
    return "Low";
  }

  return "Very Low";
}

function getRelevanceLevel(score: number): PlayabilityRelevanceLevel {
  if (score >= 85) {
    return "Very High";
  }

  if (score >= 70) {
    return "High";
  }

  if (score >= 45) {
    return "Moderate";
  }

  if (score >= 20) {
    return "Low";
  }

  return "Very Low";
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

  if (value === "not_legal") {
    return "Not Legal";
  }

  return "Unknown";
}

function getDemandHint(card: Card) {
  return playabilityCardDemandHints[card.name.toLowerCase()];
}

function getFormatWeight(format: PlayabilityFormat) {
  if (format === "Overall") {
    return {
      casualWeight: 0,
      competitiveWeight: 0,
      demandWeight: 0,
    };
  }

  return playabilityFormatWeights[format];
}

function getImportance(format: PlayabilityFormat) {
  const weight = getFormatWeight(format);

  return clampScore(
    (weight.casualWeight + weight.competitiveWeight + weight.demandWeight) *
      33,
  );
}

function getFormatDemandScore(
  card: Card,
  format: PlayabilityFormat,
  status: PlayabilityBanStatus,
) {
  const weight = getFormatWeight(format);
  const hint = getDemandHint(card)?.formatHints[format];
  const statusScore = scoreFromStatus(status);

  if (status === "Not Legal" || status === "Banned" || status === "Unknown") {
    return clampScore(statusScore + (hint?.demandBonus ?? 0) * 0.25);
  }

  return clampScore(
    statusScore +
      weight.demandWeight * 25 +
      weight.casualWeight * 8 +
      weight.competitiveWeight * 8 +
      (hint?.demandBonus ?? 0),
  );
}

function getCompetitiveScore(
  card: Card,
  format: PlayabilityFormat,
  status: PlayabilityBanStatus,
) {
  const hint = getDemandHint(card)?.formatHints[format];
  const weight = getFormatWeight(format);
  const statusBase = status === "Legal" || status === "Restricted" ? 35 : 0;

  return clampScore(
    statusBase + weight.competitiveWeight * 45 + (hint?.competitiveRelevanceBonus ?? 0),
  );
}

function getCasualScore(
  card: Card,
  format: PlayabilityFormat,
  status: PlayabilityBanStatus,
) {
  const hint = getDemandHint(card)?.formatHints[format];
  const weight = getFormatWeight(format);
  const statusBase = status === "Legal" || status === "Restricted" ? 35 : 0;

  return clampScore(
    statusBase + weight.casualWeight * 45 + (hint?.casualRelevanceBonus ?? 0),
  );
}

function getIndicatorExplanation(
  card: Card,
  format: PlayabilityFormat,
  status: PlayabilityBanStatus,
  demandLevel: PlayabilityDemandLevel,
) {
  const hintSignals =
    getDemandHint(card)?.formatHints[format]?.keySignals?.join(", ");
  const signalText = hintSignals ? ` Key signals: ${hintSignals}.` : "";

  if (status === "Legal" || status === "Restricted") {
    return `${format} demand is ${demandLevel.toLowerCase()} because ${card.name} is ${status.toLowerCase()} and this format carries a configured demand weight.${signalText}`;
  }

  return `${format} demand is ${demandLevel.toLowerCase()} because ${card.name} is ${status.toLowerCase()} in this format.${signalText}`;
}

function createWaitingIndicator(
  context: PlayabilityProviderContext,
): PlayabilityIndicator {
  const timestamp = new Date().toISOString();

  return {
    format: context.format,
    score: 0,
    confidence: 0,
    importance: getImportance(context.format),
    demandLevel: "Very Low",
    competitiveRelevance: "Very Low",
    casualRelevance: "Very Low",
    trend: "Unknown",
    availability: "WAITING_FOR_PROVIDER",
    dataSource: "Future Provider",
    provider: "Future Provider",
    status: "Unknown",
    lastUpdated: timestamp,
    metaStability: "Unknown",
    deckPenetration: {
      percentage: null,
      sampleSize: null,
      confidence: 0,
      status: "WAITING_FOR_PROVIDER",
    },
    explanation: `${context.format} play demand will become clearer once a provider is connected.`,
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
    const score = getFormatDemandScore(context.card, context.format, status);
    const competitiveScore = getCompetitiveScore(
      context.card,
      context.format,
      status,
    );
    const casualScore = getCasualScore(context.card, context.format, status);
    const demandHint = getDemandHint(context.card);
    const formatHint = demandHint?.formatHints[context.format];
    const timestamp = new Date().toISOString();
    const demandLevel = getLevel(score);

    return {
      format: context.format,
      score,
      confidence:
        status === "Unknown" ? 20 : clampScore(55 + (demandHint?.confidenceBonus ?? 0)),
      importance: getImportance(context.format),
      demandLevel,
      competitiveRelevance: getRelevanceLevel(competitiveScore),
      casualRelevance: getRelevanceLevel(casualScore),
      trend: formatHint?.trend ?? "Stable",
      availability: "LIVE",
      dataSource: "Scryfall",
      provider: this.name,
      status,
      lastUpdated: timestamp,
      metaStability: formatHint?.trend === "Declining" ? "Volatile" : "Stable",
      deckPenetration: {
        percentage: null,
        sampleSize: null,
        confidence: 0,
        status: "WAITING_FOR_PROVIDER",
      },
      explanation: getIndicatorExplanation(
        context.card,
        context.format,
        status,
        demandLevel,
      ),
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
  const weightedDemand = scoredIndicators.reduce((sum, indicator) => {
    const weight = getFormatWeight(indicator.format).demandWeight;

    return sum + indicator.score * weight;
  }, 0);
  const totalWeight = scoredIndicators.reduce(
    (sum, indicator) => sum + getFormatWeight(indicator.format).demandWeight,
    0,
  );
  const score =
    scoredIndicators.length > 0
      ? clampScore(weightedDemand / Math.max(1, totalWeight))
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
  const dataSource = scoredIndicators.length > 0 ? "Scryfall" : "Future Provider";
  const strongestFormat = [...scoredIndicators].sort(
    (first, second) => second.score - first.score,
  )[0];

  return {
    format: "Overall",
    score,
    confidence,
    importance: 100,
    demandLevel: getLevel(score),
    competitiveRelevance: getRelevanceLevel(
      averageNumbers(scoredIndicators.map((indicator) => {
        return scoreFromLevel(indicator.competitiveRelevance);
      })),
    ),
    casualRelevance: getRelevanceLevel(
      averageNumbers(scoredIndicators.map((indicator) => {
        return scoreFromLevel(indicator.casualRelevance);
      })),
    ),
    trend: strongestFormat?.trend ?? "Unknown",
    availability: scoredIndicators.length > 0 ? "LIVE" : "WAITING_FOR_PROVIDER",
    dataSource,
    provider: scoredIndicators.length > 0 ? "Scryfall Playability Provider" : "Future Provider",
    status: legalFormats.length > 0 ? "Legal" : "Unknown",
    lastUpdated: new Date().toISOString(),
    metaStability: "Unknown",
    deckPenetration: {
      percentage: null,
      sampleSize: null,
      confidence: 0,
      status: "WAITING_FOR_PROVIDER",
    },
    explanation:
      legalFormats.length > 0
        ? `${card.name} has ${getLevel(score).toLowerCase()} play demand across ${legalFormats.length} playable format${legalFormats.length === 1 ? "" : "s"}, weighted by format relevance.`
        : "Play demand will become clearer once legalities or format providers are available.",
  };
}

function scoreFromLevel(level: PlayabilityRelevanceLevel) {
  return {
    High: 75,
    Low: 30,
    Moderate: 55,
    "Very High": 90,
    "Very Low": 10,
  }[level];
}

function averageNumbers(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return clampScore(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function averageIndicators(
  format: PlayabilityFormat,
  indicators: PlayabilityIndicator[],
  explanation: string,
) {
  const score = averageNumbers(indicators.map((indicator) => indicator.score));
  const confidence = clampScore(
    indicators.reduce((sum, indicator) => sum + indicator.confidence, 0) /
      Math.max(1, indicators.length),
  );

  return {
    ...indicators[0],
    format,
    score,
    confidence,
    demandLevel: getLevel(score),
    explanation,
  };
}

function getBusinessConclusion(card: Card, overall: PlayabilityIndicator) {
  return (
    getDemandHint(card)?.businessConclusion ??
    `${card.name} has ${overall.demandLevel.toLowerCase()} player demand based on weighted format availability. Its market relevance depends on continued play across the formats where it is currently usable.`
  );
}

function getConfidenceReason(card: Card, confidence: number) {
  if (confidence >= 70) {
    return "";
  }

  return (
    getDemandHint(card)?.confidenceReason ??
    "Dedicated deck adoption, tournament usage, and format demand providers have not yet been connected."
  );
}

function getKeySignals(
  card: Card,
  formats: Record<PlayabilityFormat, PlayabilityIndicator>,
  roles: PlayabilityRoleSignal[],
  semanticSignals: string[],
) {
  const legalFormats = Object.values(formats).filter(
    (indicator) =>
      indicator.format !== "Overall" &&
      (indicator.status === "Legal" || indicator.status === "Restricted"),
  );
  const broadFormatDiversity = legalFormats.length >= 4;
  const strongestSignals = legalFormats
    .flatMap((indicator) => {
      const signals = getDemandHint(card)?.formatHints[indicator.format]?.keySignals ?? [];

      return signals.length > 0
        ? signals
        : [`${indicator.format} ${indicator.demandLevel} Demand`];
    });

  return Array.from(
    new Set([
      ...(getDemandHint(card)?.keySignals ?? []),
      ...roles.map((role) => role.role),
      ...semanticSignals,
      ...(broadFormatDiversity ? ["Broad Format Diversity"] : []),
      ...strongestSignals,
      formats.Overall.trend === "Increasing" ? "Growing Interest" : "Stable Demand",
    ]),
  ).slice(0, 4);
}

function isPlayabilityRole(role: string): role is PlayabilityRole {
  return [
    "Artifact Synergy",
    "Fast Mana",
    "Commander Staple",
    "Combo Piece",
    "Competitive Staple",
    "Collector Card",
    "Tutor",
    "Removal",
    "Counterspell",
    "Finisher",
    "Engine",
    "Utility",
    "Value Card",
    "Ramp",
    "Protection",
    "Card Draw",
  ].includes(role);
}

function classifyRoles(card: Card): PlayabilityRoleSignal[] {
  const graph = knowledgeGraphRegistry.resolve(card);
  const graphRoles = graph.query({ relationships: ["has_role"] });

  if (graphRoles.length > 0) {
    return graphRoles.flatMap((relationship) => {
      if (!isPlayabilityRole(relationship.label)) {
        return [];
      }

      return [{
        confidence: relationship.confidence,
        explanation: `${card.name} is classified as ${relationship.label.toLowerCase()} from the Asset Knowledge Graph.`,
        role: relationship.label,
      }];
    });
  }

  const hintRoles = getDemandHint(card)?.roles ?? [];

  if (hintRoles.length > 0) {
    return hintRoles.map((role) => ({
      confidence: 70,
      explanation: `${card.name} is classified as ${role.toLowerCase()} from configured play pattern knowledge.`,
      role,
    }));
  }

  const name = card.name.toLowerCase();
  const roles: PlayabilityRoleSignal[] = [];

  if (name.includes("bolt")) {
    roles.push({
      confidence: 60,
      explanation: "Name and known function indicate efficient removal.",
      role: "Removal",
    });
  }

  if (name.includes("counter")) {
    roles.push({
      confidence: 60,
      explanation: "Name and known function indicate permission interaction.",
      role: "Counterspell",
    });
  }

  return roles.length > 0
    ? roles
    : [
        {
          confidence: 35,
          explanation: "Role classification is waiting for richer provider evidence.",
          role: "Utility",
        },
      ];
}

export function createPlayabilityProfile(card: Card): PlayabilityProfile {
  const knowledgeGraph = knowledgeGraphRegistry.resolve(card);
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
  const demandStabilityScore = clampScore(
    averageNumbers(formatIndicators.map((indicator) => indicator.score)) -
      (formatIndicators.some((indicator) => indicator.trend === "Declining") ? 15 : 0),
  );
  const metaDependencyScore = clampScore(
    averageNumbers(competitiveFormats.map((indicator) => indicator.score)) -
      averageNumbers([formats.Commander.score, formats["Canadian Highlander"].score]),
  );
  const futureDemandReadiness = averageIndicators(
    "Overall",
    formatIndicators,
    "Future demand readiness improves as Commander, metagame, and tournament providers are connected.",
  );
  const roleSignals = classifyRoles(card);
  const semanticSignals = [
    ...knowledgeGraph.labelsByKind("Archetype"),
    ...knowledgeGraph.labelsByKind("Theme"),
    ...knowledgeGraph.labelsByKind("Strategy"),
  ];
  const keySignals = getKeySignals(card, formats, roleSignals, semanticSignals);
  const normalizedProviderResponse = placeholderProviderAdapter.normalize({
    card,
    formatIndicators,
    keySignals,
    roles: roleSignals,
  });

  return {
    modelId: "playability-intelligence",
    modelName: "Playability Intelligence",
    version: "1.0.0",
    overall,
    formats,
    tier: getTier(overall.score),
    businessConclusion: getBusinessConclusion(card, overall),
    confidenceReason: getConfidenceReason(card, overall.confidence),
    demandDimensions: normalizedProviderResponse.demandDimensions,
    formatAnalysis: normalizedProviderResponse.formatAnalysis,
    keySignals,
    knowledgeGraph: {
      archetypes: knowledgeGraph.labelsByKind("Archetype"),
      edgeCount: knowledgeGraph.edges.length,
      formats: knowledgeGraph.labelsByKind("Format"),
      nodeCount: knowledgeGraph.nodes.length,
      roles: knowledgeGraph.labelsByKind("Role"),
      themes: knowledgeGraph.labelsByKind("Theme"),
    },
    providerAdapter: placeholderProviderAdapter.name,
    roleSignals,
    formatWeights: Object.fromEntries(
      Object.entries(playabilityFormatWeights).map(([format, weight]) => [
        format,
        weight.demandWeight,
      ]),
    ),
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
      demandStability: {
        ...overall,
        score: demandStabilityScore,
        demandLevel: getLevel(demandStabilityScore),
        explanation:
          demandStabilityScore >= 60
            ? "Demand appears stable across currently playable formats."
            : "Demand stability is limited until broader provider coverage is connected.",
      },
      metaDependency: {
        ...overall,
        score: Math.max(0, metaDependencyScore),
        demandLevel: getLevel(Math.max(0, metaDependencyScore)),
        explanation:
          metaDependencyScore >= 45
            ? "Demand has meaningful competitive format dependency."
            : "Demand is not primarily dependent on current tournament metagames.",
      },
      futureDemandReadiness: {
        ...futureDemandReadiness,
        score: clampScore(overall.score * 0.75),
        demandLevel: getLevel(overall.score * 0.75),
      },
      metaStability: {
        ...overall,
        score: demandStabilityScore,
        confidence: overall.confidence,
        availability: "LIVE",
        dataSource: "Scryfall",
        explanation: "Demand stability reflects current weighted format spread until dedicated metagame providers are connected.",
      },
      trend: {
        ...overall,
        score: clampScore(overall.score * 0.75),
        confidence: overall.confidence,
        availability: "LIVE",
        dataSource: "Scryfall",
        explanation: "Future demand readiness reflects current format demand and known provider gaps.",
      },
    },
    explanation: `${getBusinessConclusion(card, overall)} Playability measures player demand only; strategies decide how to use it.`,
    providerRoadmap: ["EDHREC", "MTGGoldfish", "Melee", "MTGO", "Tournament APIs"],
    dependencyGraph: [
      "Playability Intelligence",
      "Playability Engine",
      "Playability Provider Registry",
      "Asset Knowledge Graph",
      "Relationship Registry",
      "Playability Provider Adapter",
      "Card Role Model",
      "Demand Model",
      "Scryfall Legalities",
      "Future Format Providers",
      "Strategy",
      "Negotiation Ladder",
      "Decision Resolver",
    ],
    generatedAt: new Date().toISOString(),
  };
}
