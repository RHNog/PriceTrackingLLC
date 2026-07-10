import { PendingIdentityProviderAdapter } from "@/lib/providers/identity/PendingIdentityProviderAdapter";

export class LorcanaIdentityProviderAdapter extends PendingIdentityProviderAdapter {
  readonly id = "lorcana-pending";
  readonly name = "Lorcana";
  readonly game = "Lorcana" as const;
}
