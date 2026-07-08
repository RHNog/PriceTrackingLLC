import type { Card } from "@/types/card";
import type { PrintingConstraint } from "@/types/printingConstraint";
import type { PrintingVariant } from "@/types/printingVariant";

export type VariantSelectionReason =
  | "explicit_finish"
  | "single_finish"
  | "default_nonfoil"
  | "least_special_finish"
  | "unavailable";

export interface VariantResolutionResult {
  selectedVariant: PrintingVariant | null;
  selectionReason: string;
  selectionReasonCode: VariantSelectionReason;
  wasAutomaticallySelected: boolean;
  requiresUserSelection: boolean;
  confidence: number;
}

type VariantResolutionInput = {
  availableVariants: PrintingVariant[];
  constraints: PrintingConstraint[];
  printing: Card;
};

const defaultFinishPriority = [
  "regular",
  "nonfoil",
  "foil",
  "etched",
  "galaxy",
  "halo",
  "surge",
  "confetti",
  "serialized",
  "textured",
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function findExplicitFinishConstraint(constraints: PrintingConstraint[]) {
  return constraints.find((constraint) => constraint.type === "finish");
}

function findVariantByFinish(
  variants: PrintingVariant[],
  requestedFinish: string,
) {
  return variants.find(
    (variant) => normalize(variant.finish) === normalize(requestedFinish),
  );
}

function getPriority(variant: PrintingVariant) {
  const normalizedFinish = normalize(variant.finish);
  const index = defaultFinishPriority.findIndex(
    (finish) => normalize(finish) === normalizedFinish,
  );

  return index === -1 ? defaultFinishPriority.length : index;
}

function findLeastSpecialVariant(variants: PrintingVariant[]) {
  return [...variants].sort((first, second) => getPriority(first) - getPriority(second))[0];
}

export function resolvePrintingVariant(
  input: VariantResolutionInput,
): VariantResolutionResult {
  // TODO: Game-specific finish priority policies.
  // TODO: User preference overrides.
  // TODO: Marketplace-specific availability policies.
  // TODO: Strategy-aware variant defaults.
  const variants = input.availableVariants.filter((variant) => variant.isAvailable);
  const explicitFinish = findExplicitFinishConstraint(input.constraints);

  if (explicitFinish) {
    const selectedVariant = findVariantByFinish(variants, explicitFinish.value) ?? null;

    return {
      selectedVariant,
      selectionReason: selectedVariant
        ? `Selected ${selectedVariant.finish} because the query requested ${explicitFinish.value}.`
        : `${explicitFinish.value} was requested, but that finish is not available for this printing.`,
      selectionReasonCode: "explicit_finish",
      wasAutomaticallySelected: Boolean(selectedVariant),
      requiresUserSelection: !selectedVariant,
      confidence: selectedVariant ? explicitFinish.confidence : 0,
    };
  }

  if (variants.length === 1) {
    return {
      selectedVariant: variants[0],
      selectionReason: `Selected ${variants[0].finish} because it is the only available finish.`,
      selectionReasonCode: "single_finish",
      wasAutomaticallySelected: true,
      requiresUserSelection: false,
      confidence: 95,
    };
  }

  const nonfoilVariant = findVariantByFinish(variants, "Nonfoil");

  if (nonfoilVariant) {
    return {
      selectedVariant: nonfoilVariant,
      selectionReason:
        "Selected Nonfoil by default because this printing has multiple finishes and Nonfoil is the standard purchasable version.",
      selectionReasonCode: "default_nonfoil",
      wasAutomaticallySelected: true,
      requiresUserSelection: false,
      confidence: 90,
    };
  }

  const leastSpecialVariant = findLeastSpecialVariant(variants);

  if (leastSpecialVariant) {
    return {
      selectedVariant: leastSpecialVariant,
      selectionReason: `Selected ${leastSpecialVariant.finish} as the least-special available finish for this printing.`,
      selectionReasonCode: "least_special_finish",
      wasAutomaticallySelected: true,
      requiresUserSelection: false,
      confidence: 80,
    };
  }

  return {
    selectedVariant: null,
    selectionReason: "No purchasable finish variant is available for this printing.",
    selectionReasonCode: "unavailable",
    wasAutomaticallySelected: false,
    requiresUserSelection: true,
    confidence: 0,
  };
}
