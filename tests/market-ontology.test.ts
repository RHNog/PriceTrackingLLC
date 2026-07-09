import assert from "node:assert/strict";
import test from "node:test";
import { marketOntology } from "@/lib/market/ontology/MarketOntology";
import {
  capabilityRegistry,
  justTCGMarketCapabilities,
} from "@/lib/market/ontology/CapabilityRegistry";
import { ontologyEvidenceResolver } from "@/lib/market/ontology/EvidenceResolver";
import { calculateDomainCoverage } from "@/lib/market/ontology/DomainCoverage";

const knownCards = [
  "Mox Opal",
  "Chrome Mox",
  "Black Lotus",
  "Lightning Bolt",
  "Collected Company",
  "Urza's Saga",
];

test("Market Ontology registers the required market evidence domains", () => {
  const domains = marketOntology.getDomains().map((domain) => domain.name);

  assert.ok(domains.includes("Variant Valuation"));
  assert.ok(domains.includes("Listing Intelligence"));
  assert.ok(domains.includes("Transaction Intelligence"));
  assert.ok(domains.includes("Historical Pricing"));
  assert.ok(domains.includes("Inventory Intelligence"));
  assert.ok(domains.includes("Price Trend"));
  assert.ok(domains.includes("Volatility"));
  assert.ok(domains.includes("Market Liquidity"));
  assert.ok(domains.includes("Market Confidence"));
  assert.ok(domains.includes("Provider Metadata"));
});

test("JustTCG declares supported and unsupported evidence domains explicitly", () => {
  const byDomain = Object.fromEntries(
    justTCGMarketCapabilities.capabilities.map((capability) => [
      capability.domainId,
      capability.status,
    ]),
  );

  assert.equal(byDomain["variant-valuation"], "SUPPORTED");
  assert.equal(byDomain["historical-pricing"], "SUPPORTED");
  assert.equal(byDomain["price-trend"], "SUPPORTED");
  assert.equal(byDomain.volatility, "SUPPORTED");
  assert.equal(byDomain["listing-intelligence"], "UNSUPPORTED");
  assert.equal(byDomain["transaction-intelligence"], "UNSUPPORTED");
  assert.equal(byDomain["inventory-intelligence"], "UNSUPPORTED");
});

test("Evidence questions resolve to domains before providers are selected", () => {
  knownCards.forEach((cardName) => {
    const valuation = marketOntology.resolveField("marketPrice");
    const listings = marketOntology.resolveField("lowestListing");
    const transactions = marketOntology.resolveField("recentSales");
    const volatility = marketOntology.resolveField("volatility");

    assert.equal(valuation.domain?.name, "Variant Valuation", cardName);
    assert.equal(valuation.shouldQueryProvider, true, cardName);
    assert.ok(valuation.connectedProviders.includes("JustTCG"), cardName);
    assert.equal(listings.domain?.name, "Listing Intelligence", cardName);
    assert.equal(listings.shouldQueryProvider, true, cardName);
    assert.ok(listings.connectedProviders.includes("TCGplayer"), cardName);
    assert.ok(listings.unsupportedProviders.includes("JustTCG"), cardName);
    assert.equal(transactions.domain?.name, "Transaction Intelligence", cardName);
    assert.ok(transactions.connectedProviders.includes("TCGplayer"), cardName);
    assert.ok(transactions.unsupportedProviders.includes("JustTCG"), cardName);
    assert.equal(volatility.domain?.name, "Volatility", cardName);
    assert.ok(volatility.connectedProviders.includes("JustTCG"), cardName);
  });
});

test("Unsupported providers are not eligible for requested evidence fields", () => {
  assert.equal(
    ontologyEvidenceResolver.canProviderAnswerField({
      field: "lowestListing",
      providerIdOrName: "justtcg",
    }),
    false,
  );
  assert.equal(
    ontologyEvidenceResolver.canProviderAnswerField({
      field: "recentSales",
      providerIdOrName: "justtcg",
    }),
    false,
  );
  assert.equal(
    ontologyEvidenceResolver.canProviderAnswerField({
      field: "marketPrice",
      providerIdOrName: "justtcg",
    }),
    true,
  );
});

test("Domain coverage reports connected, planned, partial, and unsupported providers", () => {
  const coverage = calculateDomainCoverage(capabilityRegistry);
  const listingCoverage = coverage.find(
    (domain) => domain.domainId === "listing-intelligence",
  );
  const liquidityCoverage = coverage.find(
    (domain) => domain.domainId === "market-liquidity",
  );

  assert.ok(listingCoverage);
  assert.ok(listingCoverage.connectedProviders.includes("TCGplayer"));
  assert.ok(listingCoverage.plannedProviders.includes("Cardmarket"));
  assert.ok(listingCoverage.unsupportedProviders.includes("JustTCG"));
  assert.ok(liquidityCoverage);
  assert.ok(liquidityCoverage.partialProviders.includes("JustTCG"));
});
