import Image from "next/image";
import type { Card } from "@/types/card";

type CardImageProps = {
  card: Card;
  detail?: string;
  size: "identity" | "printing" | "selected";
};

const sizeClasses = {
  identity: "h-16 w-11 text-[10px]",
  printing: "h-20 w-14 text-[10px]",
  selected: "h-72 w-48 text-sm",
};
const imageSizes = {
  identity: {
    height: 96,
    width: 64,
  },
  printing: {
    height: 120,
    width: 84,
  },
  selected: {
    height: 432,
    width: 288,
  },
};

function getImageUrl(card: Card, size: CardImageProps["size"]) {
  if (size === "identity") {
    return card.imageUrls?.small ?? card.imageUrl;
  }

  if (size === "selected") {
    return card.imageUrls?.large ?? card.imageUrls?.normal ?? card.imageUrl;
  }

  return card.imageUrls?.normal ?? card.imageUrls?.small ?? card.imageUrl;
}

export default function CardImage({ card, detail, size }: CardImageProps) {
  const imageUrl = getImageUrl(card, size);
  const altText = detail ? `${card.name} — ${detail}` : card.name;
  const className = `${sizeClasses[size]} shrink-0 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 object-cover`;

  if (!imageUrl) {
    return (
      <div
        role="img"
        aria-label={`${altText}. No image available.`}
        className={`${className} flex flex-col items-center justify-center p-2 text-center text-zinc-500`}
      >
        <span className="font-medium text-zinc-300">{card.name}</span>
        <span className="mt-1">{card.set}</span>
        <span className="mt-1">No image available</span>
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={altText}
      width={imageSizes[size].width}
      height={imageSizes[size].height}
      className={className}
      priority={size === "selected"}
      unoptimized
    />
  );
}
