import type { Card } from "@/types/card";
import type {
  PlayabilityFormat,
  PlayabilityIndicator,
} from "@/lib/intelligence/playability/PlayabilityIndicator";

export type PlayabilityProviderContext = {
  card: Card;
  format: PlayabilityFormat;
};

export interface PlayabilityProvider {
  id: string;
  name: string;
  supportedFormats: PlayabilityFormat[];
  getFormatIndicator(
    context: PlayabilityProviderContext,
  ): PlayabilityIndicator | null;
}

