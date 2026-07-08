import type { CardProfile } from "@/lib/engines/cardIntelligence/models/CardProfile";
import { createIndicator } from "@/lib/intelligence/framework/IndicatorFactory";
import { indicatorRegistry } from "@/lib/intelligence/framework/IndicatorRegistry";
import type {
  IntelligenceModel,
  IntelligenceModelHealth,
} from "@/lib/intelligence/framework/IntelligenceModel";
import type { Indicator } from "@/lib/intelligence/framework/Indicator";
import type { IndicatorStatus } from "@/lib/intelligence/framework/IndicatorStatus";

type IntelligenceModelDefinition = {
  id: string;
  name: string;
  version: string;
  status: IndicatorStatus;
  indicatorIds: string[];
  inputs: string[];
  outputs: string[];
  supportingSources: string[];
  explanation: string;
  dependencyGraph: string[];
};

export const intelligenceModelRegistry: IntelligenceModelDefinition[] = [
  {
    id: "market-intelligence",
    name: "Market Intelligence",
    version: "1.0.0",
    status: "ESTIMATED",
    indicatorIds: ["market-confidence", "liquidity", "demand"],
    inputs: ["Market Context", "Condition Market Snapshot"],
    outputs: ["market confidence", "liquidity", "demand"],
    supportingSources: ["Scryfall Market Provider"],
    explanation: "Measures reliability and resale context around the current market estimate.",
    dependencyGraph: ["Market Intelligence", "Market Snapshot", "Market Provider", "Scryfall Market Provider"],
  },
  {
    id: "collector-intelligence",
    name: "Collector Intelligence",
    version: "1.0.0",
    status: "ESTIMATED",
    indicatorIds: ["collector-appeal", "scarcity"],
    inputs: ["Printing Data", "Variant", "Condition"],
    outputs: ["collector appeal", "scarcity"],
    supportingSources: ["Scryfall"],
    explanation:
      "Measures long-term collector desirability using scarcity, printing prestige, historical significance, grading data, and future collector indicators.",
    dependencyGraph: ["Collector Intelligence", "Printing Data", "Identity Provider", "Scryfall"],
  },
  {
    id: "investment-intelligence",
    name: "Investment Intelligence",
    version: "1.0.0",
    status: "ESTIMATED",
    indicatorIds: ["investment-potential", "collector-appeal", "market-confidence"],
    inputs: ["Card Profile", "Market Context", "Strategy"],
    outputs: ["investment potential"],
    supportingSources: ["Scryfall", "Scryfall Market Provider"],
    explanation: "Measures long-term asset potential without deciding whether to buy.",
    dependencyGraph: ["Investment Intelligence", "Card Profile", "Signals", "Strategy"],
  },
  {
    id: "liquidity-intelligence",
    name: "Liquidity Intelligence",
    version: "1.0.0",
    status: "PLACEHOLDER",
    indicatorIds: ["liquidity"],
    inputs: ["Market Context"],
    outputs: ["liquidity"],
    supportingSources: ["Future marketplace providers"],
    explanation: "Measures how quickly an asset can be resold once live provider depth exists.",
    dependencyGraph: ["Liquidity Intelligence", "Marketplace Depth", "Future Providers"],
  },
  {
    id: "reprint-risk",
    name: "Reprint Risk",
    version: "1.0.0",
    status: "PLACEHOLDER",
    indicatorIds: ["reprint-risk"],
    inputs: ["Card Metadata", "Product Family"],
    outputs: ["reprint risk"],
    supportingSources: ["Scryfall"],
    explanation: "Measures possible future supply pressure without making a purchase decision.",
    dependencyGraph: ["Reprint Risk", "Card Metadata", "Scryfall"],
  },
  {
    id: "market-confidence",
    name: "Market Confidence",
    version: "1.0.0",
    status: "ESTIMATED",
    indicatorIds: ["market-confidence"],
    inputs: ["Normalized Market Price"],
    outputs: ["market confidence"],
    supportingSources: ["Scryfall Market Provider"],
    explanation: "Measures confidence in the current normalized market estimate.",
    dependencyGraph: ["Market Confidence", "Market Snapshot", "Scryfall Market Provider"],
  },
  {
    id: "playability-intelligence",
    name: "Playability Intelligence",
    version: "1.0.0",
    status: "LIVE",
    indicatorIds: [
      "playability",
      "commander-strength",
      "competitive-strength",
      "casual-strength",
      "ban-risk",
      "format-diversity",
      "meta-stability",
      "playability-trend",
    ],
    inputs: ["Scryfall Legalities", "Card Metadata", "Future Format Providers"],
    outputs: ["overall playability", "format indicators", "ban status", "trend readiness"],
    supportingSources: ["Scryfall", "Future format providers"],
    explanation:
      "Measures play demand and format availability without deciding buy, pass, or negotiation behavior.",
    dependencyGraph: [
      "Playability Intelligence",
      "Playability Engine",
      "Playability Provider Registry",
      "Scryfall Playability Provider",
      "Future Providers",
      "Strategy",
      "Negotiation Ladder",
      "Decision Resolver",
    ],
  },
  {
    id: "grading-intelligence",
    name: "Grading Intelligence",
    version: "1.0.0",
    status: "ESTIMATED",
    indicatorIds: ["grading"],
    inputs: ["Condition", "Collector Profile"],
    outputs: ["grading potential"],
    supportingSources: ["Condition Profile"],
    explanation: "Measures grading potential and prepares for PSA, CGC, and BGS providers.",
    dependencyGraph: ["Grading Intelligence", "Condition", "Future Grading Providers"],
  },
  {
    id: "regional-intelligence",
    name: "Regional Intelligence",
    version: "1.0.0",
    status: "WAITING_FOR_PROVIDER",
    indicatorIds: ["regional"],
    inputs: ["Market Context"],
    outputs: ["regional valuation"],
    supportingSources: ["Future regional providers"],
    explanation: "Future model for regional valuation, shipping, tax, import cost, and demand.",
    dependencyGraph: ["Regional Intelligence", "Market Context", "Future Providers"],
  },
  {
    id: "behavior-intelligence",
    name: "Behavior Intelligence",
    version: "1.0.0",
    status: "WAITING_FOR_PROVIDER",
    indicatorIds: ["behavior"],
    inputs: ["User Behavior"],
    outputs: ["behavior pattern"],
    supportingSources: ["Future user history"],
    explanation: "Future model for buyer-specific execution behavior.",
    dependencyGraph: ["Behavior Intelligence", "User History", "Future Storage"],
  },
  {
    id: "historical-intelligence",
    name: "Historical Intelligence",
    version: "1.0.0",
    status: "WAITING_FOR_PROVIDER",
    indicatorIds: ["historical"],
    inputs: ["Historical Prices"],
    outputs: ["historical stability"],
    supportingSources: ["Future historical storage"],
    explanation: "Future model for price history, drawdowns, and trend stability.",
    dependencyGraph: ["Historical Intelligence", "Historical Storage", "Future Providers"],
  },
  {
    id: "volatility-intelligence",
    name: "Volatility Intelligence",
    version: "1.0.0",
    status: "WAITING_FOR_PROVIDER",
    indicatorIds: ["volatility"],
    inputs: ["Historical Prices"],
    outputs: ["volatility"],
    supportingSources: ["Future historical storage"],
    explanation: "Future model for short-term price movement risk.",
    dependencyGraph: ["Volatility Intelligence", "Historical Storage", "Future Providers"],
  },
  {
    id: "demand-intelligence",
    name: "Demand Intelligence",
    version: "1.0.0",
    status: "PLACEHOLDER",
    indicatorIds: ["demand"],
    inputs: ["Market Context", "Game Knowledge"],
    outputs: ["demand"],
    supportingSources: ["Future marketplace providers"],
    explanation: "Future model for marketplace demand and format popularity.",
    dependencyGraph: ["Demand Intelligence", "Market Context", "Future Providers"],
  },
  {
    id: "scarcity-intelligence",
    name: "Scarcity Intelligence",
    version: "1.0.0",
    status: "ESTIMATED",
    indicatorIds: ["scarcity"],
    inputs: ["Rarity", "Printing Data"],
    outputs: ["scarcity"],
    supportingSources: ["Scryfall"],
    explanation: "Measures relative scarcity from normalized printing metadata.",
    dependencyGraph: ["Scarcity Intelligence", "Printing Data", "Scryfall"],
  },
];

function averageConfidence(indicators: Indicator[]) {
  if (indicators.length === 0) {
    return 0;
  }

  const total = indicators.reduce(
    (sum, indicator) => sum + indicator.confidence,
    0,
  );

  return Math.round(total / indicators.length);
}

function getModelHealth(
  status: IndicatorStatus,
  indicators: Indicator[],
): IntelligenceModelHealth {
  if (status === "DISABLED") {
    return "Unavailable";
  }

  if (status === "WAITING_FOR_PROVIDER") {
    return "Missing Data";
  }

  if (status === "PLACEHOLDER") {
    return "Experimental";
  }

  if (indicators.some((indicator) => indicator.status === "PLACEHOLDER")) {
    return "Partial";
  }

  return "Healthy";
}

export function getRegisteredIntelligenceModels() {
  return intelligenceModelRegistry;
}

export function createAssetIntelligenceModels(
  cardProfile: Omit<CardProfile, "intelligenceModels">,
): IntelligenceModel[] {
  const indicators = indicatorRegistry.map((metadata) =>
    createIndicator({
      metadata,
      playabilityProfile: cardProfile.playabilityProfile,
      signals: cardProfile.signals,
    }),
  );

  return intelligenceModelRegistry.map((definition) => {
    const modelIndicators = indicators.filter((indicator) =>
      definition.indicatorIds.includes(indicator.id),
    );

    return {
      id: definition.id,
      name: definition.name,
      version: definition.version,
      status: definition.status,
      confidence: averageConfidence(modelIndicators),
      lastUpdated: new Date().toISOString(),
      inputs: definition.inputs,
      outputs: definition.outputs,
      indicators: modelIndicators,
      supportingSources: definition.supportingSources,
      health: getModelHealth(definition.status, modelIndicators),
      explanation: definition.explanation,
      dependencyGraph: definition.dependencyGraph,
    };
  });
}
