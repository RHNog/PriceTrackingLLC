import CardImage from "@/components/cards/CardImage";
import type { CardImageCandidate } from "@/components/cards/CardImageCache";

type CardThumbnailProps = {
  alt: string;
  assetKey: string;
  candidates: CardImageCandidate[];
  className?: string;
  developerMode?: boolean;
  selected?: boolean;
};

export default function CardThumbnail(props: CardThumbnailProps) {
  return <CardImage {...props} size="thumbnail" />;
}
