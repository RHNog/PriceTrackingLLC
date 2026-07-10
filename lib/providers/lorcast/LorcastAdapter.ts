import { CanonicalCardIdentityAdapter } from "@/lib/engines/identity/IdentityProviderAdapter";

export class LorcastAdapter extends CanonicalCardIdentityAdapter {
  constructor() {
    super("LorcastNormalizer", "lorcast");
  }
}
