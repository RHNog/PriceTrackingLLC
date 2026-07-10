import type { IdentityProvider as LegacyIdentityProvider } from "@/types/identityProvider";
import type { IdentityProviderAdapter } from "@/lib/engines/identity/IdentityProviderAdapter";
import type { IdentityProviderCapability } from "@/lib/engines/identity/IdentityProviderCapability";

export interface IdentityProvider extends LegacyIdentityProvider {
  readonly adapter: IdentityProviderAdapter;
  readonly capability: IdentityProviderCapability;
}
