import type { CardIdentity } from "@/types/cardIdentity";
import type { ParsedQuery } from "@/types/parsedQuery";

export function resolveIdentity(
  identities: CardIdentity[],
  parsedQuery: ParsedQuery,
) {
  if (!parsedQuery.cardName) {
    return identities;
  }

  return identities.filter((identity) =>
    identity.name.toLowerCase().includes(parsedQuery.cardName.toLowerCase()),
  );
}
