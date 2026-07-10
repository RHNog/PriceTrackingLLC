import type { Card } from "@/types/card";

export type IdentityProviderLifecycle =
  | "OPERATIONAL"
  | "PENDING_CONNECTION"
  | "NOT_CONFIGURED"
  | "TEMPORARILY_OFFLINE";

export type IdentityProviderCapability = {
  artwork: boolean;
  conditions: boolean;
  finishes: boolean;
  games: Card["game"][];
  languages: boolean;
  lifecycle: IdentityProviderLifecycle;
  printings: boolean;
};
