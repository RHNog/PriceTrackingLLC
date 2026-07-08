import type { Decision } from "@/types/decision";

export type DecisionDriverTone = "negative" | "positive" | "warning";

export interface DecisionDriver {
  tone: DecisionDriverTone;
  message: string;
}

type DecisionDriversInput = {
  action: Decision["action"];
  askingPrice: number;
  estimatedProfit: number;
  maximumPurchasePrice: number;
  minimumProfit: number;
  minimumROI: number;
  recommendedOffer: number;
  roi: number;
  strategyName?: string;
};

export function createDecisionDrivers(
  input: DecisionDriversInput,
): DecisionDriver[] {
  const drivers: DecisionDriver[] = [];
  const passesProfit = input.estimatedProfit >= input.minimumProfit;
  const passesRoi = input.roi >= input.minimumROI;
  const isBelowTarget = input.askingPrice <= input.maximumPurchasePrice;
  const strategyLabel = input.strategyName ?? "selected strategy";

  if (isBelowTarget) {
    drivers.push({
      tone: "positive",
      message: "Asking price is inside the current negotiation ladder.",
    });
  } else {
    drivers.push({
      tone: input.action === "NEGOTIATE" ? "warning" : "negative",
      message:
        input.action === "NEGOTIATE"
          ? "Asking price is close enough to negotiate back into ladder range."
          : "Asking price exceeds the walk-away point.",
    });
  }

  drivers.push({
    tone: passesRoi ? "positive" : "negative",
    message: passesRoi
      ? `Expected ROI satisfies the ${strategyLabel} strategy.`
      : `Expected ROI is below the ${strategyLabel} strategy threshold.`,
  });

  drivers.push({
    tone: passesProfit ? "positive" : "negative",
    message: passesProfit
      ? "Expected profit clears the strategy minimum."
      : "Expected profit is below the strategy minimum.",
  });

  if (input.action === "NEGOTIATE") {
    drivers.push({
      tone: "warning",
      message: "Suggested offer would bring the purchase back inside target.",
    });
  }

  if (input.action === "BUY") {
    drivers.push({
      tone: "positive",
      message: "Recommendation is strong enough to act without negotiation.",
    });
  }

  drivers.push({
    tone: "warning",
    message: "Market estimate is based on daily pricing, not live inventory.",
  });

  return drivers;
}
