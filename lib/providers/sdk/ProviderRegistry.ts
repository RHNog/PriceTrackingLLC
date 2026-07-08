import type { ProviderAdapter } from "@/lib/providers/sdk/ProviderAdapter";
import { createPlannedCoverage } from "@/lib/providers/sdk/ProviderCoverage";
import { createProviderDiagnostics } from "@/lib/providers/sdk/ProviderDiagnostics";
import { createWaitingEvidence } from "@/lib/providers/sdk/ProviderEvidence";
import { createWaitingProviderHealth } from "@/lib/providers/sdk/ProviderHealth";
import type {
  ProviderDomain,
  ProviderMetadata,
} from "@/lib/providers/sdk/ProviderMetadata";

type PlannedProviderDefinition = {
  coverageAreas: string[];
  description: string;
  domain: ProviderDomain;
  evidenceTypes: string[];
  gaps: string[];
  id: string;
  mappedIndicatorIds: string[];
  name: string;
  supportedInputs: string[];
  supportedOutputs: string[];
};

type PlannedProviderOutput = {
  providerId: string;
  status: "WAITING_FOR_INTEGRATION";
};

class PlannedProviderAdapter
  implements ProviderAdapter<unknown, PlannedProviderOutput, unknown>
{
  readonly metadata: ProviderMetadata;

  constructor(private readonly definition: PlannedProviderDefinition) {
    this.metadata = {
      id: definition.id,
      name: definition.name,
      domain: definition.domain,
      lifecycleStatus: "PLANNED",
      description: definition.description,
      supportedInputs: definition.supportedInputs,
      supportedOutputs: definition.supportedOutputs,
      evidenceTypes: definition.evidenceTypes,
      version: "1.0.0",
    };
  }

  getCoverage() {
    return createPlannedCoverage(
      this.definition.domain,
      this.definition.coverageAreas,
      this.definition.gaps,
    );
  }

  getHealth() {
    return createWaitingProviderHealth(
      `${this.metadata.name} has SDK metadata but no live integration yet.`,
    );
  }

  mapEvidence() {
    return this.definition.evidenceTypes.map((evidenceType) =>
      createWaitingEvidence(
        this.metadata.name,
        evidenceType,
        this.definition.mappedIndicatorIds,
      ),
    );
  }

  normalize(): PlannedProviderOutput {
    return {
      providerId: this.metadata.id,
      status: "WAITING_FOR_INTEGRATION",
    };
  }

  createWaitingResult() {
    return {
      data: this.normalize(),
      diagnostics: createProviderDiagnostics({
        coverage: this.getCoverage(),
        evidence: this.mapEvidence(),
        health: this.getHealth(),
        metadata: this.metadata,
      }),
      status: "WAITING_FOR_INTEGRATION" as const,
    };
  }
}

export class ProviderRegistry {
  private adapters: ProviderAdapter<unknown, unknown, unknown>[] = [];

  register(adapter: ProviderAdapter<unknown, unknown, unknown>) {
    this.adapters = [
      ...this.adapters.filter((item) => item.metadata.id !== adapter.metadata.id),
      adapter,
    ];
  }

  getAdapters() {
    return this.adapters;
  }

  getMetadata() {
    return this.adapters.map((adapter) => adapter.metadata);
  }

  getDiagnostics() {
    return this.adapters.map((adapter) => adapter.createWaitingResult().diagnostics);
  }

  getHealth() {
    return this.adapters.map((adapter) => adapter.getHealth());
  }

  getCoverage() {
    return this.adapters.map((adapter) => adapter.getCoverage());
  }

  getEvidence() {
    return this.adapters.flatMap((adapter) => adapter.mapEvidence(null));
  }
}

const plannedProviders: PlannedProviderDefinition[] = [
  {
    id: "edhrec",
    name: "EDHREC",
    domain: "playability",
    description: "Future Commander demand and deck adoption provider.",
    supportedInputs: ["Card identity", "Commander format context"],
    supportedOutputs: ["Commander demand", "deck penetration", "casual demand"],
    evidenceTypes: ["Commander Demand", "Deck Penetration"],
    mappedIndicatorIds: ["commander-strength", "casual-strength"],
    coverageAreas: ["Commander", "Casual Demand"],
    gaps: ["No live integration", "No deck penetration samples"],
  },
  {
    id: "psa",
    name: "PSA",
    domain: "certification",
    description: "Future official certification population provider.",
    supportedInputs: ["Card identity", "Printing", "Variant"],
    supportedOutputs: ["Population", "Gem Population", "Gem Rate"],
    evidenceTypes: ["Population", "Gem Rate"],
    mappedIndicatorIds: ["population-scarcity", "gem-rate"],
    coverageAreas: ["Certification Population"],
    gaps: ["No official provider connection"],
  },
  {
    id: "bgs",
    name: "BGS",
    domain: "certification",
    description: "Future official certification population provider.",
    supportedInputs: ["Card identity", "Printing", "Variant"],
    supportedOutputs: ["Population", "Gem Population", "Gem Rate"],
    evidenceTypes: ["Population", "Gem Rate"],
    mappedIndicatorIds: ["population-scarcity", "gem-rate"],
    coverageAreas: ["Certification Population"],
    gaps: ["No official provider connection"],
  },
  {
    id: "cgc",
    name: "CGC",
    domain: "certification",
    description: "Future official certification population provider.",
    supportedInputs: ["Card identity", "Printing", "Variant"],
    supportedOutputs: ["Population", "Gem Population", "Gem Rate"],
    evidenceTypes: ["Population", "Gem Rate"],
    mappedIndicatorIds: ["population-scarcity", "gem-rate"],
    coverageAreas: ["Certification Population"],
    gaps: ["No official provider connection"],
  },
  {
    id: "cardmarket",
    name: "Cardmarket",
    domain: "market",
    description: "Future European marketplace depth and sales provider.",
    supportedInputs: ["Printing", "Variant", "Market Context"],
    supportedOutputs: ["Listings", "Recent Sales", "Liquidity"],
    evidenceTypes: ["Marketplace Depth", "Liquidity"],
    mappedIndicatorIds: ["liquidity", "market-confidence"],
    coverageAreas: ["EU Marketplace"],
    gaps: ["No marketplace API connection"],
  },
  {
    id: "tcgplayer",
    name: "TCGplayer",
    domain: "market",
    description: "Future US marketplace listing and sales provider.",
    supportedInputs: ["Printing", "Variant", "Market Context"],
    supportedOutputs: ["Listings", "Recent Sales", "Liquidity"],
    evidenceTypes: ["Marketplace Depth", "Liquidity"],
    mappedIndicatorIds: ["liquidity", "market-confidence"],
    coverageAreas: ["US Marketplace"],
    gaps: ["No marketplace API connection"],
  },
  {
    id: "melee",
    name: "Melee",
    domain: "tournament",
    description: "Future competitive tournament result provider.",
    supportedInputs: ["Card identity", "Format"],
    supportedOutputs: ["Competitive demand", "metagame share"],
    evidenceTypes: ["Competitive Demand", "Meta Share"],
    mappedIndicatorIds: ["competitive-strength", "meta-dependency"],
    coverageAreas: ["Competitive Play"],
    gaps: ["No tournament API connection"],
  },
  {
    id: "mtgo",
    name: "MTGO",
    domain: "playability",
    description: "Future digital metagame and event result provider.",
    supportedInputs: ["Card identity", "Format"],
    supportedOutputs: ["Competitive demand", "metagame share"],
    evidenceTypes: ["Competitive Demand", "Meta Share"],
    mappedIndicatorIds: ["competitive-strength", "meta-dependency"],
    coverageAreas: ["Digital Play"],
    gaps: ["No event data connection"],
  },
  {
    id: "ligamagic",
    name: "LigaMagic",
    domain: "market",
    description: "Future Brazil marketplace and regional pricing provider.",
    supportedInputs: ["Printing", "Variant", "Regional Market Context"],
    supportedOutputs: ["Regional pricing", "Listings", "Liquidity"],
    evidenceTypes: ["Regional Market", "Marketplace Depth"],
    mappedIndicatorIds: ["regional", "liquidity"],
    coverageAreas: ["Brazil Marketplace"],
    gaps: ["No marketplace API connection"],
  },
  {
    id: "ebay",
    name: "eBay",
    domain: "market",
    description: "Future marketplace listings and completed sales provider.",
    supportedInputs: ["Printing", "Variant", "Market Context"],
    supportedOutputs: ["Listings", "Recent Sales", "Liquidity"],
    evidenceTypes: ["Recent Sales", "Marketplace Depth"],
    mappedIndicatorIds: ["liquidity", "market-confidence"],
    coverageAreas: ["Marketplace Sales"],
    gaps: ["No marketplace API connection"],
  },
];

export const providerRegistry = new ProviderRegistry();

plannedProviders.forEach((definition) =>
  providerRegistry.register(new PlannedProviderAdapter(definition)),
);

export function getProviderSdkSnapshot() {
  return {
    coverage: providerRegistry.getCoverage(),
    diagnostics: providerRegistry.getDiagnostics(),
    evidence: providerRegistry.getEvidence(),
    health: providerRegistry.getHealth(),
    metadata: providerRegistry.getMetadata(),
  };
}
