import { PendingIdentityProviderAdapter } from "@/lib/providers/identity/PendingIdentityProviderAdapter";

export class FleshAndBloodIdentityProviderAdapter extends PendingIdentityProviderAdapter {
  readonly id = "flesh-and-blood-pending";
  readonly name = "Flesh and Blood";
  readonly game = "Flesh and Blood" as const;
}
