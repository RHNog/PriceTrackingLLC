import type { CanonicalIdentityModel } from "@/lib/engines/identity/IdentityProviderAdapter";
import type { Card } from "@/types/card";

export function projectPrintingCard(
  identity: CanonicalIdentityModel,
  printingIdentityId: string,
): Card | undefined {
  return identity.printings.find(
    (card) => card.printingIdentity?.printingIdentityId === printingIdentityId,
  );
}

export function getLegacyIdentityId(identity: CanonicalIdentityModel) {
  return identity.gameplayIdentity.gameplayIdentityId;
}

export function getLegacyPrintingId(card: Card) {
  return card.printingIdentity?.aliases.find((alias) => alias.namespace === "print")?.value ?? card.id;
}

export function getLegacyVariantId(card: Card, physicalVariantIdentityId: string) {
  const variant = card.physicalVariants?.find(
    (candidate) => candidate.physicalVariantIdentityId === physicalVariantIdentityId,
  );
  return variant?.aliases[0]?.value ?? physicalVariantIdentityId;
}
