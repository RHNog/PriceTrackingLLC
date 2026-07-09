import { capabilityRegistry, type CapabilityRegistry } from "@/lib/market/ontology/CapabilityRegistry";
import type { EvidenceCapability } from "@/lib/market/ontology/EvidenceCapability";
import type { EvidenceDomain } from "@/lib/market/ontology/EvidenceDomain";
import { getEvidenceQuestionForField } from "@/lib/market/ontology/EvidenceQuestion";
import type { ProviderCapability } from "@/lib/market/ontology/ProviderCapability";
import type { MarketSnapshotField } from "@/lib/market/MarketSnapshotMetadata";

export interface EvidenceResolutionPath {
  connectedProviders: string[];
  domain: EvidenceDomain | null;
  explanation: string;
  field: MarketSnapshotField;
  plannedProviders: string[];
  question: string;
  shouldQueryProvider: boolean;
  unsupportedProviders: string[];
}

function canAnswer(capability: EvidenceCapability) {
  return capability.status === "SUPPORTED" || capability.status === "PARTIAL";
}

function createNoQuestionPath(field: MarketSnapshotField): EvidenceResolutionPath {
  return {
    connectedProviders: [],
    domain: null,
    explanation: "No evidence domain owns this market question yet.",
    field,
    plannedProviders: [],
    question: field,
    shouldQueryProvider: false,
    unsupportedProviders: [],
  };
}

export class EvidenceResolver {
  constructor(private readonly registry: CapabilityRegistry = capabilityRegistry) {}

  resolveField(field: MarketSnapshotField): EvidenceResolutionPath {
    const question = getEvidenceQuestionForField(field);

    if (!question) {
      return createNoQuestionPath(field);
    }

    const domain = this.registry.getDomain(question.domainId);
    const providers = this.registry.getProvidersForDomain(question.domainId);
    const supported = providers.filter(({ capability }) => canAnswer(capability));
    const connectedProviders = supported
      .filter(({ provider }) => provider.connectionStatus === "CONNECTED")
      .map(({ provider }) => provider.providerName);
    const plannedProviders = supported
      .filter(({ provider }) => provider.connectionStatus !== "CONNECTED")
      .map(({ provider }) => provider.providerName);
    const unsupportedProviders = providers
      .filter(({ capability }) => capability.status === "UNSUPPORTED")
      .map(({ provider }) => provider.providerName);

    if (connectedProviders.length > 0) {
      return {
        connectedProviders,
        domain,
        explanation: `${domain?.name ?? "Evidence domain"} is supported by ${connectedProviders.join(", ")}.`,
        field,
        plannedProviders,
        question: question.question,
        shouldQueryProvider: true,
        unsupportedProviders,
      };
    }

    if (plannedProviders.length > 0) {
      return {
        connectedProviders,
        domain,
        explanation: `No connected provider currently supplies this evidence. Waiting for ${plannedProviders.join(", ")}.`,
        field,
        plannedProviders,
        question: question.question,
        shouldQueryProvider: false,
        unsupportedProviders,
      };
    }

    return {
      connectedProviders,
      domain,
      explanation: "No connected provider currently supplies this evidence.",
      field,
      plannedProviders,
      question: question.question,
      shouldQueryProvider: false,
      unsupportedProviders,
    };
  }

  canProviderAnswerField(input: {
    field: MarketSnapshotField;
    providerIdOrName: string;
  }) {
    const question = getEvidenceQuestionForField(input.field);

    if (!question) {
      return false;
    }

    const provider = this.registry.getProvider(input.providerIdOrName);

    if (!provider || provider.connectionStatus !== "CONNECTED") {
      return false;
    }

    return canAnswer(
      this.registry.getProviderCapability({
        domainId: question.domainId,
        providerIdOrName: provider.providerId,
      }),
    );
  }

  canProviderAnswerAnyField(input: {
    fields: MarketSnapshotField[];
    providerIdOrName: string;
  }) {
    return input.fields.some((field) =>
      this.canProviderAnswerField({
        field,
        providerIdOrName: input.providerIdOrName,
      }),
    );
  }

  getProviderCapabilityMatrix(): ProviderCapability[] {
    return this.registry.getProviders();
  }
}

export const ontologyEvidenceResolver = new EvidenceResolver();

export function canProviderAnswerMarketField(input: {
  field: MarketSnapshotField;
  providerIdOrName: string;
}) {
  return ontologyEvidenceResolver.canProviderAnswerField(input);
}

export function canProviderAnswerAnyMarketField(input: {
  fields: MarketSnapshotField[];
  providerIdOrName: string;
}) {
  return ontologyEvidenceResolver.canProviderAnswerAnyField(input);
}
