import { PendingIdentityProviderAdapter } from "@/lib/providers/identity/PendingIdentityProviderAdapter";

export class OnePieceIdentityProviderAdapter extends PendingIdentityProviderAdapter {
  readonly id = "one-piece-pending";
  readonly name = "One Piece";
  readonly game = "One Piece" as const;
}
