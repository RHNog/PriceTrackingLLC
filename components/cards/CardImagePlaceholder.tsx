type CardImagePlaceholderProps = {
  alt: string;
  compact?: boolean;
};

export default function CardImagePlaceholder({ alt, compact = false }: CardImagePlaceholderProps) {
  return (
    <div
      aria-label={`${alt}. Artwork unavailable.`}
      className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(circle_at_top,#164e63_0%,#09090b_58%)] p-2 text-center"
      role="img"
    >
      <span className={`${compact ? "text-lg" : "text-3xl"} font-semibold text-cyan-200`} aria-hidden="true">
        Φ
      </span>
      {!compact ? <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Project Phronesis</span> : null}
    </div>
  );
}
