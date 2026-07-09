import {
  evidenceDomains,
  type EvidenceDomain,
  type EvidenceDomainId,
} from "@/lib/market/ontology/EvidenceDomain";
import type { EvidenceCapabilityStatus } from "@/lib/market/ontology/EvidenceCapability";
import {
  getProviderCapabilityForDomain,
  type ProviderCapability,
} from "@/lib/market/ontology/ProviderCapability";

function capability(
  domainId: EvidenceDomainId,
  status: EvidenceCapabilityStatus,
  explanation: string,
) {
  return {
    domainId,
    explanation,
    status,
  };
}

export const justTCGMarketCapabilities: ProviderCapability = {
  providerId: "justtcg",
  providerName: "JustTCG",
  connectionStatus: "CONNECTED",
  capabilities: [
    capability(
      "variant-valuation",
      "SUPPORTED",
      "JustTCG supplies condition-, finish-, and language-specific variant prices.",
    ),
    capability(
      "historical-pricing",
      "SUPPORTED",
      "JustTCG supplies provider price history when requested through the SDK.",
    ),
    capability(
      "price-trend",
      "SUPPORTED",
      "JustTCG supplies trend and movement statistics on variants.",
    ),
    capability(
      "volatility",
      "SUPPORTED",
      "JustTCG supplies provider volatility statistics such as coefficient of variation and dispersion.",
    ),
    capability(
      "listing-intelligence",
      "UNSUPPORTED",
      "JustTCG does not expose live listing rows, seller competition, quantity, shipping, or listing freshness through the current SDK.",
    ),
    capability(
      "transaction-intelligence",
      "UNSUPPORTED",
      "JustTCG does not expose completed sales, median sale, auction result, or buyer behavior records through the current SDK.",
    ),
    capability(
      "inventory-intelligence",
      "UNSUPPORTED",
      "JustTCG does not expose listing inventory depth or seller quantity through the current SDK.",
    ),
    capability(
      "market-liquidity",
      "PARTIAL",
      "JustTCG can contribute valuation and movement context, but liquidity still needs listing or transaction evidence.",
    ),
    capability(
      "market-confidence",
      "SUPPORTED",
      "JustTCG can contribute confidence through provider health, freshness, price history, and variant coverage.",
    ),
    capability(
      "provider-metadata",
      "SUPPORTED",
      "JustTCG supplies provider usage metadata, authentication state, latency, and synchronization timing.",
    ),
  ],
};

export const tcgplayerMarketCapabilities: ProviderCapability = {
  providerId: "tcgplayer",
  providerName: "TCGplayer",
  connectionStatus: "CONNECTED",
  capabilities: [
    capability(
      "variant-valuation",
      "SUPPORTED",
      "TCGplayer Market Intelligence supplies normalized market price for supported fixture records.",
    ),
    capability(
      "listing-intelligence",
      "SUPPORTED",
      "TCGplayer Market Intelligence supplies lowest listing, listing count, and spread for supported fixture records.",
    ),
    capability(
      "transaction-intelligence",
      "SUPPORTED",
      "TCGplayer Market Intelligence supplies recent sales count and sales velocity for supported fixture records.",
    ),
    capability(
      "historical-pricing",
      "SUPPORTED",
      "TCGplayer Market Intelligence supplies price history for supported fixture records.",
    ),
    capability(
      "inventory-intelligence",
      "SUPPORTED",
      "TCGplayer Market Intelligence supplies listing count and inventory health for supported fixture records.",
    ),
    capability(
      "price-trend",
      "SUPPORTED",
      "TCGplayer Market Intelligence supplies market trend for supported fixture records.",
    ),
    capability(
      "volatility",
      "SUPPORTED",
      "TCGplayer Market Intelligence supplies volatility derived from price history.",
    ),
    capability(
      "market-liquidity",
      "SUPPORTED",
      "TCGplayer Market Intelligence supplies liquidity from inventory and sales velocity.",
    ),
    capability(
      "market-confidence",
      "SUPPORTED",
      "TCGplayer Market Intelligence supplies confidence from normalized market coverage.",
    ),
    capability(
      "provider-metadata",
      "SUPPORTED",
      "TCGplayer Market Intelligence supplies provider health and diagnostics metadata.",
    ),
  ],
};

export const scryfallMarketCapabilities: ProviderCapability = {
  providerId: "scryfall-market",
  providerName: "Scryfall Market Provider",
  connectionStatus: "CONNECTED",
  capabilities: [
    capability(
      "variant-valuation",
      "PARTIAL",
      "Scryfall market data supplies daily price estimates, not live listings or transactions.",
    ),
    capability(
      "historical-pricing",
      "UNSUPPORTED",
      "Scryfall market data does not supply repository-owned price history.",
    ),
    capability(
      "listing-intelligence",
      "UNSUPPORTED",
      "Scryfall market data is not live listing intelligence.",
    ),
    capability(
      "transaction-intelligence",
      "UNSUPPORTED",
      "Scryfall market data is not completed-sales intelligence.",
    ),
    capability(
      "inventory-intelligence",
      "UNSUPPORTED",
      "Scryfall market data does not include inventory depth.",
    ),
    capability(
      "price-trend",
      "UNSUPPORTED",
      "Scryfall market data does not include trend metrics.",
    ),
    capability(
      "volatility",
      "UNSUPPORTED",
      "Scryfall market data does not include volatility metrics.",
    ),
    capability(
      "market-liquidity",
      "UNSUPPORTED",
      "Scryfall market data does not include listing or transaction depth.",
    ),
    capability(
      "market-confidence",
      "PARTIAL",
      "Scryfall can contribute fallback confidence for daily market estimates.",
    ),
    capability(
      "provider-metadata",
      "SUPPORTED",
      "Scryfall market data supplies provider timestamp and source metadata.",
    ),
  ],
};

export const cardmarketFutureMarketCapabilities: ProviderCapability = {
  providerId: "cardmarket",
  providerName: "Cardmarket",
  connectionStatus: "PLANNED",
  capabilities: [
    capability(
      "listing-intelligence",
      "SUPPORTED",
      "Future Cardmarket integration is expected to supply live listing intelligence.",
    ),
    capability(
      "transaction-intelligence",
      "SUPPORTED",
      "Future Cardmarket integration is expected to supply transaction intelligence.",
    ),
    capability(
      "variant-valuation",
      "SUPPORTED",
      "Future Cardmarket integration is expected to supply variant valuation.",
    ),
  ],
};

export const ebayFutureMarketCapabilities: ProviderCapability = {
  providerId: "ebay",
  providerName: "eBay",
  connectionStatus: "PLANNED",
  capabilities: [
    capability(
      "transaction-intelligence",
      "SUPPORTED",
      "Future eBay integration is expected to supply completed sales and auction-result intelligence.",
    ),
    capability(
      "listing-intelligence",
      "SUPPORTED",
      "Future eBay integration may supply live marketplace listing intelligence if enabled.",
    ),
  ],
};

export class CapabilityRegistry {
  private domains = evidenceDomains;
  private providers: ProviderCapability[] = [];

  constructor(input?: {
    domains?: EvidenceDomain[];
    providers?: ProviderCapability[];
  }) {
    this.domains = input?.domains ?? evidenceDomains;
    this.providers = input?.providers ?? [];
  }

  getDomains() {
    return this.domains;
  }

  getDomain(domainId: EvidenceDomainId) {
    return this.domains.find((domain) => domain.id === domainId) ?? null;
  }

  getProviders() {
    return this.providers;
  }

  getProvider(providerIdOrName: string) {
    const normalized = providerIdOrName.toLowerCase().trim();

    return (
      this.providers.find(
        (provider) =>
          provider.providerId.toLowerCase() === normalized ||
          provider.providerName.toLowerCase() === normalized,
      ) ?? null
    );
  }

  getProviderCapability(input: {
    domainId: EvidenceDomainId;
    providerIdOrName: string;
  }) {
    const provider = this.getProvider(input.providerIdOrName);

    if (!provider) {
      return {
        domainId: input.domainId,
        explanation:
          "No provider capability declaration exists for this evidence domain.",
        status: "UNKNOWN" as const,
      };
    }

    return getProviderCapabilityForDomain(provider, input.domainId);
  }

  getProvidersForDomain(domainId: EvidenceDomainId) {
    return this.providers.map((provider) => ({
      capability: getProviderCapabilityForDomain(provider, domainId),
      provider,
    }));
  }

  registerProvider(provider: ProviderCapability) {
    this.providers = [
      ...this.providers.filter((item) => item.providerId !== provider.providerId),
      provider,
    ];
  }
}

export const capabilityRegistry = new CapabilityRegistry({
  providers: [
    justTCGMarketCapabilities,
    tcgplayerMarketCapabilities,
    scryfallMarketCapabilities,
    cardmarketFutureMarketCapabilities,
    ebayFutureMarketCapabilities,
  ],
});
