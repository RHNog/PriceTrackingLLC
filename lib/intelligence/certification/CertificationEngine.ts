import type { Card } from "@/types/card";
import type { PrintingVariant } from "@/types/printingVariant";
import { knowledgeGraphRegistry } from "@/lib/knowledge/KnowledgeGraphRegistry";
import type { AssetKnowledgeGraph } from "@/lib/knowledge/AssetKnowledgeGraph";
import type { CertificationIndicator } from "@/lib/intelligence/certification/CertificationIndicator";
import type { CertificationProfile, CertificationTier } from "@/lib/intelligence/certification/CertificationProfile";
import type {
  CertificationProvider,
  CertificationProviderContext,
  CertificationProviderId,
  CertificationProviderSummary,
} from "@/lib/intelligence/certification/CertificationProvider";
import {
  certificationProviderIds,
  certificationRegistry,
  currentCertificationProviderIds,
} from "@/lib/intelligence/certification/CertificationRegistry";
import type { CertificationSource } from "@/lib/intelligence/certification/CertificationSource";
import type { CertificationTrend } from "@/lib/intelligence/certification/CertificationTrend";

function clampScore(score: number) {
  return Math.min(100, Math.max(0, Math.round(score)));
}

function includesAny(values: (string | undefined)[], terms: string[]) {
  const haystack = values.join(" ").toLowerCase();

  return terms.some((term) => haystack.includes(term));
}

function estimateCollectibleCertificationScore(
  printing: Card,
  variant: PrintingVariant,
  knowledgeGraph: AssetKnowledgeGraph,
) {
  const metadata = [
    printing.name,
    printing.set,
    printing.productFamily,
    printing.treatment,
    printing.rarity,
    variant.finish,
    ...(printing.promoTypes ?? []),
    ...(printing.frameEffects ?? []),
  ];
  let score = 58;

  if (printing.rarity.toLowerCase().includes("mythic")) {
    score += 9;
  } else if (printing.rarity.toLowerCase().includes("rare")) {
    score += 6;
  }

  if (includesAny(metadata, ["serialized", "serial"])) {
    score += 30;
  }

  if (includesAny(metadata, ["masterpiece", "invention", "invocation", "expedition"])) {
    score += 24;
  }

  if (includesAny(metadata, ["judge"])) {
    score += 20;
  }

  if (includesAny(metadata, ["textless"])) {
    score += 16;
  }

  if (includesAny(metadata, ["foil", "etched", "halo", "surge", "galaxy", "confetti"])) {
    score += 8;
  }

  if (knowledgeGraph.labelsByKind("Premium Printing").length > 0) {
    score += 10;
  }

  if (knowledgeGraph.labelsByKind("Reserved List").length > 0) {
    score += 8;
  }

  if (knowledgeGraph.labelsByKind("Role").includes("Collector Card")) {
    score += 6;
  }

  return clampScore(score);
}

function getTier(score: number): CertificationTier {
  if (score >= 85) {
    return "Excellent";
  }

  if (score >= 72) {
    return "High";
  }

  if (score >= 55) {
    return "Medium";
  }

  return "Low";
}

function providerName(providerId: CertificationProviderId) {
  return {
    ARS: "ARS",
    BGS: "BGS",
    CGC: "CGC",
    PSA: "PSA",
    SGC: "SGC",
    TAG: "TAG",
  }[providerId];
}

export class PlaceholderCertificationProvider implements CertificationProvider {
  readonly id = "placeholder-certification-provider";
  readonly name = "Placeholder Certification Provider";
  readonly supportedProviders = currentCertificationProviderIds;

  getCertificationSummary(
    context: CertificationProviderContext,
    providerId: CertificationProviderId,
  ): CertificationProviderSummary | null {
    if (!this.supportedProviders.includes(providerId)) {
      return null;
    }

    const grade = estimateCollectibleCertificationScore(
      context.printing,
      context.variant,
      knowledgeGraphRegistry.resolve(context.printing),
    );
    const premium = clampScore((grade - 50) * 1.6);
    const timestamp = new Date().toISOString();

    return {
      providerId,
      providerName: providerName(providerId),
      grade,
      confidence: 45,
      population: null,
      gemPopulation: null,
      gemRate: null,
      estimatedPremium: premium,
      trend: "Unknown",
      status: "PLACEHOLDER",
      source: "Placeholder",
      lastUpdated: timestamp,
      explanation:
        `${providerName(providerId)} certification characteristics are estimated from collectible metadata only. Population reports are not connected.`,
    };
  }
}

certificationRegistry.register(new PlaceholderCertificationProvider());

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return clampScore(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function createIndicator(
  name: CertificationIndicator["name"],
  label: string,
  score: number,
  confidence: number,
  trend: CertificationTrend,
  source: CertificationSource,
  explanation: string,
): CertificationIndicator {
  return {
    name,
    label,
    score: clampScore(score),
    confidence: clampScore(confidence),
    status: "PLACEHOLDER",
    source,
    trend,
    lastUpdated: new Date().toISOString(),
    explanation,
  };
}

export function createCertificationProfile(
  printing: Card,
  variant: PrintingVariant,
): CertificationProfile {
  const knowledgeGraph = knowledgeGraphRegistry.resolve(printing);
  const providerSummaries = currentCertificationProviderIds
    .map((providerId) =>
      certificationRegistry
        .getProviderForCertificationProvider(providerId)
        ?.getCertificationSummary({ printing, variant }, providerId),
    )
    .filter((summary): summary is CertificationProviderSummary => Boolean(summary));
  const overallGrade = average(providerSummaries.map((summary) => summary.grade));
  const overallConfidence = average(
    providerSummaries.map((summary) => summary.confidence),
  );
  const premium = average(
    providerSummaries.map((summary) => summary.estimatedPremium ?? 0),
  );
  const source = providerSummaries[0]?.source ?? "Placeholder";
  const futureProviders = certificationProviderIds
    .filter((providerId) => !currentCertificationProviderIds.includes(providerId))
    .map((providerId) => ({
      providerId,
      providerName: providerName(providerId),
      status: "Future Provider" as const,
    }));

  return {
    modelId: "certification-intelligence",
    modelName: "Certification Intelligence",
    version: "1.0.0",
    overallGrade,
    overallConfidence,
    tier: getTier(overallGrade),
    providers: providerSummaries,
    futureProviders,
    knowledgeGraph: {
      edgeCount: knowledgeGraph.edges.length,
      premiumPrintings: knowledgeGraph.labelsByKind("Premium Printing"),
      reservedList: knowledgeGraph.labelsByKind("Reserved List").length > 0,
      roles: knowledgeGraph.labelsByKind("Role"),
    },
    indicators: {
      certificationGrade: createIndicator(
        "certificationGrade",
        "Certification Grade",
        overallGrade,
        overallConfidence,
        "Unknown",
        source,
        "Overall certification grade measures collectible certification fit across registered providers.",
      ),
      populationScarcity: createIndicator(
        "populationScarcity",
        "Population Scarcity",
        overallGrade,
        30,
        "Unknown",
        source,
        "Population scarcity is placeholder-only until official population data providers are connected.",
      ),
      gemRate: createIndicator(
        "gemRate",
        "Gem Rate",
        overallGrade * 0.8,
        30,
        "Unknown",
        source,
        "Gem rate is prepared for provider population reports and is not scraped or inferred from unofficial APIs.",
      ),
      certificationPremium: createIndicator(
        "certificationPremium",
        "Certification Premium",
        premium,
        overallConfidence,
        "Unknown",
        source,
        "Estimated premium reflects collectible certification relevance, not a buy or pass decision.",
      ),
      populationTrend: createIndicator(
        "populationTrend",
        "Population Trend",
        0,
        0,
        "Unknown",
        "Future Provider",
        "Population trend is reserved for future official provider history.",
      ),
      collectorCompetition: createIndicator(
        "collectorCompetition",
        "Collector Competition",
        overallGrade,
        overallConfidence,
        "Unknown",
        source,
        "Collector competition measures likely certified-collector attention from prestige metadata.",
      ),
      submissionSaturation: createIndicator(
        "submissionSaturation",
        "Submission Saturation",
        0,
        0,
        "Unknown",
        "Future Provider",
        "Submission saturation is reserved for future official population growth data.",
      ),
    },
    explanation:
      `${printing.name} has ${getTier(overallGrade).toLowerCase()} certification characteristics. Certification Intelligence measures collectible traits only; Collector Intelligence decides how to interpret them.`,
    providerRoadmap: certificationProviderIds,
    dependencyGraph: [
      "Certification Intelligence",
      "Certification Engine",
      "Certification Provider Registry",
      "Asset Knowledge Graph",
      "Relationship Registry",
      "Placeholder Certification Provider",
      "PSA",
      "BGS",
      "CGC",
      "Future Certification Providers",
      "Collector Intelligence",
      "Strategy",
      "Negotiation Ladder",
      "Decision Resolver",
    ],
    generatedAt: new Date().toISOString(),
  };
}
