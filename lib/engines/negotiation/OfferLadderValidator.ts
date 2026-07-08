import type { NegotiationLadder } from "@/lib/engines/negotiation/NegotiationLadder";

export type OfferValueStatus =
  | "READY"
  | "UNAVAILABLE"
  | "INVALID"
  | "WAITING_FOR_DATA";

export type OfferLadderValidationStatus =
  | "READY"
  | "UNAVAILABLE"
  | "INVALID";

export interface OfferValue {
  label: string;
  reason?: string;
  status: OfferValueStatus;
  value: number | null;
}

export type ValidatedOfferLadder = NegotiationLadder & {
  validationStatus: "READY";
};

export interface OfferLadderValidation {
  errors: string[];
  status: OfferLadderValidationStatus;
  validatedLadder: ValidatedOfferLadder | null;
  values: {
    maximumBuyPrice: OfferValue;
    negotiationMargin: OfferValue;
    openingOffer: OfferValue;
    recommendedOffer: OfferValue;
    targetOffer: OfferValue;
  };
  warnings: string[];
}

type ValidateOfferLadderInput = {
  ladder: NegotiationLadder | null;
  negotiationMargin: number | null;
  recommendedOffer: number | null;
};

function isReadyNumber(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function createOfferValue(label: string, value: number | null): OfferValue {
  if (!isReadyNumber(value)) {
    return {
      label,
      reason: `${label} is unavailable.`,
      status: "UNAVAILABLE",
      value: null,
    };
  }

  if (value < 0) {
    return {
      label,
      reason: `${label} cannot be negative.`,
      status: "INVALID",
      value,
    };
  }

  return {
    label,
    status: "READY",
    value,
  };
}

export function validateOfferLadder(
  input: ValidateOfferLadderInput,
): OfferLadderValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  const values = {
    openingOffer: createOfferValue(
      "Opening Offer",
      input.ladder?.openingOffer ?? null,
    ),
    targetOffer: createOfferValue(
      "Target Offer",
      input.ladder?.targetOffer ?? null,
    ),
    maximumBuyPrice: createOfferValue(
      "Maximum Buy Price",
      input.ladder?.maximumBuyPrice ?? null,
    ),
    recommendedOffer: createOfferValue(
      "Recommended Offer",
      input.recommendedOffer,
    ),
    negotiationMargin: createOfferValue(
      "Negotiation Margin",
      input.negotiationMargin,
    ),
  };

  Object.values(values).forEach((value) => {
    if (value.status === "UNAVAILABLE") {
      errors.push(value.reason ?? `${value.label} is unavailable.`);
    }

    if (value.status === "INVALID") {
      errors.push(value.reason ?? `${value.label} is invalid.`);
    }
  });

  const openingOffer = values.openingOffer.value;
  const targetOffer = values.targetOffer.value;
  const maximumBuyPrice = values.maximumBuyPrice.value;
  const recommendedOffer = values.recommendedOffer.value;

  if (
    isReadyNumber(openingOffer) &&
    isReadyNumber(targetOffer) &&
    openingOffer > targetOffer
  ) {
    errors.push("Opening Offer must be less than or equal to Target Offer.");
  }

  if (
    isReadyNumber(targetOffer) &&
    isReadyNumber(maximumBuyPrice) &&
    targetOffer > maximumBuyPrice
  ) {
    errors.push("Target Offer must be less than or equal to Maximum Buy Price.");
  }

  if (
    isReadyNumber(recommendedOffer) &&
    isReadyNumber(maximumBuyPrice) &&
    recommendedOffer > maximumBuyPrice
  ) {
    errors.push(
      "Recommended Offer must be less than or equal to Maximum Buy Price.",
    );
  }

  if (isReadyNumber(input.negotiationMargin) && input.negotiationMargin < 0) {
    warnings.push("Negotiation Margin is below zero; seller is above target.");
  }

  if (!input.ladder || !isReadyNumber(maximumBuyPrice)) {
    return {
      errors,
      status: "UNAVAILABLE",
      validatedLadder: null,
      values,
      warnings,
    };
  }

  if (errors.length > 0) {
    return {
      errors,
      status: "INVALID",
      validatedLadder: null,
      values,
      warnings,
    };
  }

  return {
    errors,
    status: "READY",
    validatedLadder: {
      ...input.ladder,
      validationStatus: "READY",
    },
    values,
    warnings,
  };
}
