import { buildCanonicalCollectible } from "@/lib/engines/identity/IdentityOntology";
import type { CardIdentity } from "@/types/cardIdentity";
import type { CanonicalCollectibleIdentity } from "@/types/identityOntology";

export type MigratedIdentityRecord = {
  compatibilityIdentity: CardIdentity;
  migratedAt: string;
  ontology: CanonicalCollectibleIdentity;
  sourceSchema: "legacy-card-identity" | "PHR-ARCH-007";
};

export function migrateIdentityRecord(
  identity: CardIdentity | (CardIdentity & CanonicalCollectibleIdentity),
): MigratedIdentityRecord {
  const existing = "ontologyVersion" in identity && identity.ontologyVersion === "PHR-ARCH-007"
    ? identity
    : undefined;
  return {
    compatibilityIdentity: identity,
    migratedAt: new Date().toISOString(),
    ontology: existing ?? buildCanonicalCollectible(identity.printings),
    sourceSchema: existing ? "PHR-ARCH-007" : "legacy-card-identity",
  };
}

export function migrateIdentityRecords(identities: CardIdentity[]) {
  return identities.map(migrateIdentityRecord);
}
