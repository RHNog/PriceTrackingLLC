import type { IdentityPresentationModel } from "@/lib/engines/identity/IdentityPresentationModel";

type CardIdentityFactsProps = {
  className?: string;
  layout?: "inline" | "stacked";
  presentation: IdentityPresentationModel;
};

export default function CardIdentityFacts({
  className = "",
  layout = "inline",
  presentation,
}: CardIdentityFactsProps) {
  const fields = [presentation.treatment, presentation.finish].filter(
    (field) => field.visible,
  );
  if (fields.length === 0) return null;
  if (layout === "stacked") {
    return (
      <div className={className}>
        {fields.map((field) => (
          <p className="mt-1" key={field.canonicalConcept}>
            {field.label}: {field.presentationValue}
          </p>
        ))}
      </div>
    );
  }
  return (
    <span className={className}>
      {fields.map((field, index) => (
        <span key={field.canonicalConcept}>
          {index > 0 ? " · " : ""}{field.label}: {field.presentationValue}
        </span>
      ))}
    </span>
  );
}
