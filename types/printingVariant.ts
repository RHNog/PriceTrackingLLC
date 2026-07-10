import type { CardImageUrls } from "@/types/card";
import type { IdentityTreatment } from "@/types/identityTreatment";
import type { PhysicalFinish } from "@/types/identityOntology";

export interface PrintingVariant {
  id: string;
  printingId: string;
  finish: string;
  imageUrls?: CardImageUrls;
  isAvailable: boolean;
  source: string;
  treatmentDetails?: IdentityTreatment;
  physicalFinish?: PhysicalFinish;
  physicalVariantIdentityId?: string;
  metadata?: Record<string, boolean | number | string | undefined>;
}
