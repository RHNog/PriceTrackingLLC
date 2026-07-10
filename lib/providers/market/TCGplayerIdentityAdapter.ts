import {
  createCanonicalId,
  createMarketIdentity,
  explicitEvidence,
} from "@/lib/engines/identity/IdentityOntology";
import type { MarketIdentity, PhysicalFinish } from "@/types/identityOntology";

export type TCGplayerProductRecord = {
  categoryId: number;
  groupId: number;
  imageUrl?: string;
  name: string;
  productId: number;
};

export type TCGplayerSkuRecord = {
  conditionId: number;
  languageId: number;
  printingId?: number;
  productId: number;
  skuId: number;
  variantId?: number;
};

export type TCGplayerMarketIdentityMapping = {
  marketIdentity: MarketIdentity;
  physicalFinish: PhysicalFinish;
  product: TCGplayerProductRecord;
  sku: TCGplayerSkuRecord;
};

export function mapTCGplayerSku(input: {
  finishName?: string;
  physicalVariantIdentityId: string;
  product: TCGplayerProductRecord;
  sku: TCGplayerSkuRecord;
}): TCGplayerMarketIdentityMapping {
  const finishValue = input.finishName ?? "Pending Support";
  const physicalFinish: PhysicalFinish = {
    evidence: input.finishName
      ? explicitEvidence(
          "tcgplayer",
          "sku.printingId/variantId",
          "TCGplayer category printing vocabulary explicitly segments this SKU.",
          95,
        )
      : {
          confidence: 0,
          explanation: "TCGplayer printing vocabulary has not been resolved for this SKU.",
          providerField: "sku.printingId/variantId",
          providerId: "tcgplayer",
          state: "Pending Support",
        },
    value: finishValue,
  };
  const marketIdentity = createMarketIdentity({
    physicalVariantIdentityId: input.physicalVariantIdentityId,
    providerId: "tcgplayer",
    providerProductId: input.product.productId,
    providerSkuId: input.sku.skuId,
    status: input.finishName ? "Validated" : "Candidate",
  });
  marketIdentity.providerSegmentation = {
    categoryId: String(input.product.categoryId),
    conditionId: String(input.sku.conditionId),
    groupId: String(input.product.groupId),
    languageId: String(input.sku.languageId),
    providerPrintingId: String(input.sku.printingId ?? input.sku.variantId ?? "unresolved"),
  };
  marketIdentity.marketIdentityId = createCanonicalId(
    "market",
    "tcgplayer",
    input.product.productId,
    input.sku.skuId,
  );
  return { marketIdentity, physicalFinish, product: input.product, sku: input.sku };
}
