import type {
  CertificationProvider,
  CertificationProviderId,
} from "@/lib/intelligence/certification/CertificationProvider";

export const certificationProviderIds: CertificationProviderId[] = [
  "PSA",
  "BGS",
  "CGC",
  "TAG",
  "SGC",
  "ARS",
];

export const currentCertificationProviderIds: CertificationProviderId[] = [
  "PSA",
  "BGS",
  "CGC",
];

export class CertificationRegistry {
  private providers: CertificationProvider[] = [];

  register(provider: CertificationProvider) {
    this.providers = [
      ...this.providers.filter((item) => item.id !== provider.id),
      provider,
    ];
  }

  getProviders() {
    return this.providers;
  }

  getProviderForCertificationProvider(providerId: CertificationProviderId) {
    return this.providers.find((provider) =>
      provider.supportedProviders.includes(providerId),
    );
  }
}

export const certificationRegistry = new CertificationRegistry();
