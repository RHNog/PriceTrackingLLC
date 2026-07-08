import type { CardProfile } from "@/lib/engines/cardIntelligence/models/CardProfile";
import { evaluateEvidenceSufficiency } from "@/lib/intelligence/framework/EvidenceSufficiencyEngine";
import type { EvidenceRequirement } from "@/lib/intelligence/framework/EvidenceRequirement";
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
  evidenceRequirements: EvidenceRequirement[];
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
    evidenceRequirements: [
      {
        id: "market-price",
        label: "Normalized market estimate",
        type: "REQUIRED",
        indicatorIds: ["market-confidence"],
        minimumConfidence: 40,
      },
      {
        id: "resale-depth",
        label: "Marketplace resale depth",
        type: "OPTIONAL",
        indicatorIds: ["liquidity", "demand"],
      },
    ],
  },
  {
    id: "collector-intelligence",
    name: "Collector Intelligence",
    version: "1.0.0",
    status: "ESTIMATED",
    indicatorIds: ["collector-appeal", "scarcity", "certification-grade"],
    inputs: ["Printing Data", "Variant", "Condition", "Certification Intelligence"],
    outputs: ["collector appeal", "scarcity"],
    supportingSources: ["Scryfall", "Certification Intelligence"],
    explanation:
      "Measures long-term collector desirability using scarcity, printing prestige, historical significance, grading data, and future collector indicators.",
    dependencyGraph: [
      "Collector Intelligence",
      "Certification Intelligence",
      "Printing Data",
      "Identity Provider",
      "Scryfall",
    ],
    evidenceRequirements: [
      {
        id: "collector-appeal",
        label: "Collector appeal",
        type: "REQUIRED",
        indicatorIds: ["collector-appeal"],
        minimumConfidence: 40,
      },
      {
        id: "scarcity",
        label: "Scarcity signal",
        type: "REQUIRED",
        indicatorIds: ["scarcity"],
        minimumConfidence: 40,
      },
      {
        id: "certification-grade",
        label: "Certification evidence",
        type: "OPTIONAL",
        indicatorIds: ["certification-grade"],
      },
    ],
  },
  {
    id: "certification-intelligence",
    name: "Certification Intelligence",
    version: "1.0.0",
    status: "PLACEHOLDER",
    indicatorIds: [
      "certification-grade",
      "population-scarcity",
      "gem-rate",
      "certification-premium",
      "population-trend",
      "collector-competition",
      "submission-saturation",
    ],
    inputs: ["Printing Data", "Variant", "Certification Provider Registry"],
    outputs: ["certification grade", "population characteristics", "premium", "trend"],
    supportingSources: ["Placeholder Certification Provider", "Future official providers"],
    explanation:
      "Measures collectible certification characteristics without deciding buy, pass, strategy, or negotiation behavior.",
    dependencyGraph: [
      "Certification Intelligence",
      "Certification Engine",
      "Certification Provider Registry",
      "Placeholder Certification Provider",
      "PSA",
      "BGS",
      "CGC",
      "TAG",
      "SGC",
      "ARS",
      "Collector Intelligence",
      "Strategy",
      "Negotiation Ladder",
      "Decision Resolver",
    ],
    evidenceRequirements: [
      {
        id: "population",
        label: "Population",
        type: "REQUIRED",
        indicatorIds: ["population-scarcity"],
        acceptedDataSources: ["PSA", "BGS", "CGC"],
        minimumConfidence: 60,
      },
      {
        id: "gem-rate",
        label: "Gem Rate",
        type: "REQUIRED",
        indicatorIds: ["gem-rate"],
        acceptedDataSources: ["PSA", "BGS", "CGC"],
        minimumConfidence: 60,
      },
      {
        id: "premium",
        label: "Certified Premium",
        type: "REQUIRED",
        indicatorIds: ["certification-premium"],
        acceptedDataSources: ["PSA", "BGS", "CGC"],
        minimumConfidence: 60,
      },
      {
        id: "provider-integrations",
        label: "PSA, BGS, and CGC providers",
        type: "FUTURE",
        futureProviders: ["PSA", "BGS", "CGC"],
      },
    ],
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
    evidenceRequirements: [
      {
        id: "investment-potential",
        label: "Investment potential",
        type: "REQUIRED",
        indicatorIds: ["investment-potential"],
        minimumConfidence: 40,
      },
      {
        id: "market-confidence",
        label: "Market confidence",
        type: "REQUIRED",
        indicatorIds: ["market-confidence"],
        minimumConfidence: 40,
      },
      {
        id: "collector-appeal",
        label: "Collector appeal",
        type: "OPTIONAL",
        indicatorIds: ["collector-appeal"],
      },
    ],
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
    evidenceRequirements: [
      {
        id: "marketplace-depth",
        label: "Marketplace depth",
        type: "REQUIRED",
        indicatorIds: ["liquidity"],
        acceptedDataSources: ["TCGplayer", "eBay", "Cardmarket", "LigaMagic"],
        minimumConfidence: 60,
      },
      {
        id: "future-liquidity-provider",
        label: "Live marketplace providers",
        type: "FUTURE",
        futureProviders: ["TCGplayer", "eBay", "Cardmarket", "LigaMagic"],
      },
    ],
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
    evidenceRequirements: [
      {
        id: "reprint-risk",
        label: "Reprint risk signal",
        type: "REQUIRED",
        indicatorIds: ["reprint-risk"],
        minimumConfidence: 20,
      },
    ],
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
    evidenceRequirements: [
      {
        id: "market-confidence",
        label: "Market confidence",
        type: "REQUIRED",
        indicatorIds: ["market-confidence"],
        minimumConfidence: 40,
      },
    ],
  },
  {
    id: "playability-intelligence",
    name: "Playability Intelligence",
    version: "1.0.0",
    status: "LIVE",
    indicatorIds: [
      "commander-strength",
      "competitive-strength",
      "casual-strength",
      "format-diversity",
      "demand-stability",
      "ban-risk",
      "meta-dependency",
      "future-demand-readiness",
    ],
    inputs: ["Scryfall Legalities", "Format Weights", "Card Metadata", "Future Format Providers"],
    outputs: ["player demand", "format relevance", "demand stability", "meta dependency"],
    supportingSources: ["Scryfall", "Configurable format weights", "Future demand providers"],
    explanation:
      "Measures why players care about an asset using weighted format demand, relevance, and provider-ready demand signals.",
    dependencyGraph: [
      "Playability Intelligence",
      "Playability Engine",
      "Playability Provider Registry",
      "Scryfall Playability Provider",
      "Format Weights",
      "Future Providers",
      "Strategy",
      "Negotiation Ladder",
      "Decision Resolver",
    ],
    evidenceRequirements: [
      {
        id: "format-availability",
        label: "Format availability",
        type: "REQUIRED",
        indicatorIds: ["format-diversity"],
        acceptedDataSources: ["Scryfall"],
        minimumConfidence: 50,
      },
      {
        id: "demand-provider",
        label: "Provider-backed demand indicators",
        type: "REQUIRED",
        indicatorIds: ["commander-strength", "competitive-strength", "casual-strength"],
        acceptedDataSources: ["EDHREC", "MTGGoldfish", "Melee", "MTGO", "Tournament APIs"],
        minimumConfidence: 70,
      },
      {
        id: "trend",
        label: "Trend",
        type: "OPTIONAL",
        indicatorIds: ["demand-stability", "meta-dependency"],
      },
      {
        id: "future-playability-providers",
        label: "EDHREC, MTGO, and Melee providers",
        type: "FUTURE",
        futureProviders: ["EDHREC", "MTGO", "Melee"],
      },
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
    evidenceRequirements: [
      {
        id: "condition",
        label: "Condition profile",
        type: "REQUIRED",
        indicatorIds: ["grading"],
        minimumConfidence: 40,
      },
    ],
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
    evidenceRequirements: [
      {
        id: "regional-provider",
        label: "Regional market provider",
        type: "REQUIRED",
        indicatorIds: ["regional"],
        minimumConfidence: 60,
      },
    ],
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
    evidenceRequirements: [
      {
        id: "behavior-history",
        label: "Behavior history",
        type: "REQUIRED",
        indicatorIds: ["behavior"],
        minimumConfidence: 60,
      },
    ],
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
    evidenceRequirements: [
      {
        id: "historical-prices",
        label: "Historical prices",
        type: "REQUIRED",
        indicatorIds: ["historical"],
        minimumConfidence: 60,
      },
    ],
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
    evidenceRequirements: [
      {
        id: "historical-prices",
        label: "Historical prices",
        type: "REQUIRED",
        indicatorIds: ["volatility"],
        minimumConfidence: 60,
      },
    ],
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
    evidenceRequirements: [
      {
        id: "demand-provider",
        label: "Marketplace demand provider",
        type: "REQUIRED",
        indicatorIds: ["demand"],
        minimumConfidence: 60,
      },
    ],
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
    evidenceRequirements: [
      {
        id: "scarcity",
        label: "Scarcity signal",
        type: "REQUIRED",
        indicatorIds: ["scarcity"],
        minimumConfidence: 40,
      },
    ],
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
      certificationProfile: cardProfile.certificationProfile,
      playabilityProfile: cardProfile.playabilityProfile,
      signals: cardProfile.signals,
    }),
  );

  return intelligenceModelRegistry.map((definition) => {
    const modelIndicators = indicators.filter((indicator) =>
      definition.indicatorIds.includes(indicator.id),
    );
    const evidenceReport = evaluateEvidenceSufficiency({
      indicators: modelIndicators,
      requirements: definition.evidenceRequirements,
    });
    const confidence = Math.max(
      0,
      averageConfidence(modelIndicators) + evidenceReport.confidenceAdjustment,
    );

    return {
      id: definition.id,
      name: definition.name,
      version: definition.version,
      status: definition.status,
      confidence,
      lastUpdated: new Date().toISOString(),
      inputs: definition.inputs,
      outputs: definition.outputs,
      indicators: modelIndicators,
      supportingSources: definition.supportingSources,
      health: getModelHealth(definition.status, modelIndicators),
      explanation: definition.explanation,
      dependencyGraph: definition.dependencyGraph,
      evidenceReport,
    };
  });
}
