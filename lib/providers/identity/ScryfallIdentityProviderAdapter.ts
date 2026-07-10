import { CanonicalCardIdentityAdapter } from "@/lib/engines/identity/IdentityProviderAdapter";
import type { IdentityProvider } from "@/lib/engines/identity/IdentityProvider";
import { ScryfallProvider } from "@/lib/providers/identity/ScryfallProvider";

export class ScryfallIdentityProviderAdapter
  extends ScryfallProvider
  implements IdentityProvider
{
  readonly adapter = new CanonicalCardIdentityAdapter("ScryfallAdapter", "scryfall");
  readonly capability = {
    artwork: true,
    conditions: false,
    finishes: true,
    games: ["Magic" as const],
    languages: true,
    lifecycle: "OPERATIONAL" as const,
    printings: true,
  };
}
