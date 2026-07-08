import type { Card } from "@/types/card";
import type { CardConditionCode } from "@/types/conditionProfile";
import type { MarketContext } from "@/types/MarketContext";
import type { PrintingVariant } from "@/types/printingVariant";

export interface AssetSnapshot {
  assetContextId: string;
  assetContextGeneration: number;
  condition: CardConditionCode;
  identity: {
    game: Card["game"];
    id: string;
    name: string;
  };
  marketContext: MarketContext;
  printing: Pick<
    Card,
    "finish" | "id" | "imageUrl" | "name" | "number" | "rarity" | "set"
  >;
  variant: PrintingVariant;
}
