import type { CardImageUrls } from "@/types/card";

export interface PrintingVariant {
  id: string;
  printingId: string;
  finish: string;
  imageUrls?: CardImageUrls;
  isAvailable: boolean;
  source: string;
  metadata?: Record<string, boolean | number | string | undefined>;
}
