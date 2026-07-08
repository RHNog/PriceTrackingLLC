import type { AssetContextValidationStatus } from "@/types/AssetContext";
import type { Card } from "@/types/card";
import type { CardIdentity } from "@/types/cardIdentity";
import type { MarketSnapshot } from "@/types/marketSnapshot";
import type { PrintingVariant } from "@/types/printingVariant";

export type AssetContextValidatorInput = {
  assetContext: {
    identityId: string;
    printingId: string;
    variantId: string;
    marketSnapshotId: string;
  };
  identity?: CardIdentity;
  marketSnapshot?: MarketSnapshot;
  printing?: Card;
  variant?: PrintingVariant;
};

export type AssetContextValidationResult = {
  reasons: string[];
  status: AssetContextValidationStatus;
};

export function createMarketSnapshotId(input: {
  printingId: string;
  providerId: string;
  updatedAt: string;
  variantId: string;
}) {
  return [
    "market",
    input.providerId,
    input.printingId,
    input.variantId,
    input.updatedAt,
  ].join(":");
}

export function validateAssetContext(
  input: AssetContextValidatorInput,
): AssetContextValidationResult {
  const reasons: string[] = [];
  const context = input.assetContext;

  if (!context.identityId) {
    reasons.push("Identity is not selected.");
  }

  if (!context.printingId) {
    reasons.push("Printing is not selected.");
  }

  if (!context.variantId) {
    reasons.push("Variant is not selected.");
  }

  if (!input.identity || !input.printing || !input.variant) {
    return {
      reasons,
      status: reasons.length > 0 ? "Incomplete" : "Invalid",
    };
  }

  const printingBelongsToIdentity = input.identity.printings.some(
    (printing) => printing.id === input.printing?.id,
  );

  if (!printingBelongsToIdentity) {
    reasons.push("Printing does not belong to the selected identity.");
  }

  if (context.printingId !== input.printing.id) {
    reasons.push("Selected printing does not match Asset Context.");
  }

  if (input.variant.printingId !== input.printing.id) {
    reasons.push("Variant does not belong to the selected printing.");
  }

  if (context.variantId !== input.variant.id) {
    reasons.push("Selected variant does not match Asset Context.");
  }

  if (input.marketSnapshot) {
    const snapshotId = createMarketSnapshotId({
      printingId: input.marketSnapshot.printingId,
      providerId: input.marketSnapshot.providerId,
      updatedAt: input.marketSnapshot.updatedAt,
      variantId: input.marketSnapshot.variantId,
    });

    if (input.marketSnapshot.printingId !== input.printing.id) {
      reasons.push("Market snapshot does not belong to the selected printing.");
    }

    if (input.marketSnapshot.variantId !== input.variant.id) {
      reasons.push("Market snapshot does not belong to the selected variant.");
    }

    if (context.marketSnapshotId && context.marketSnapshotId !== snapshotId) {
      reasons.push("Market snapshot does not match Asset Context generation.");
    }
  } else {
    reasons.push("Market snapshot is not loaded.");
  }

  if (reasons.length === 0) {
    return {
      reasons: ["Asset Context is synchronized."],
      status: "Valid",
    };
  }

  return {
    reasons,
    status:
      context.identityId && context.printingId && context.variantId
        ? "Invalid"
        : "Incomplete",
  };
}
