import { constraintConfig, printingConstraintWeights } from "@/config/constraints";
import type { Card } from "@/types/card";
import type { ConstraintMatch } from "@/types/constraintMatch";
import type { PrintingConstraint } from "@/types/printingConstraint";
import type { PrintingMatchCandidate } from "@/types/printingResolution";

function normalize(value?: string) {
  return value?.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim() ?? "";
}

function contains(haystack: string, needle: string) {
  return normalize(haystack).includes(normalize(needle));
}

function containsAnyToken(haystack: string, needle: string) {
  const normalizedHaystack = normalize(haystack);
  const tokens = normalize(needle)
    .split(" ")
    .filter((token) => token.length > 2 && token !== "promo");

  return tokens.some((token) => normalizedHaystack.includes(token));
}

function getSearchablePrintingText(printing: Card) {
  return [
    printing.name,
    printing.set,
    printing.setCode,
    printing.number,
    printing.rarity,
    printing.finish,
    printing.frame,
    printing.treatment,
    printing.productFamily,
    printing.releaseYear,
    printing.language,
    ...(printing.frameEffects ?? []),
    ...(printing.promoTypes ?? []),
  ].join(" ");
}

function matchesConstraint(printing: Card, constraint: PrintingConstraint) {
  switch (constraint.type) {
    case "collectorNumber":
      return normalize(printing.number) === normalize(constraint.value);
    case "finish":
      return contains(printing.finish, constraint.value);
    case "frame":
      return contains(
        [printing.frame, printing.treatment, ...(printing.frameEffects ?? [])].join(
          " ",
        ),
        constraint.value,
      );
    case "game":
      return normalize(printing.game) === normalize(constraint.value);
    case "language":
      return contains(printing.language ?? "", constraint.value);
    case "product":
      return containsAnyToken(
        [
          printing.productFamily ?? "",
          printing.set,
          printing.setCode ?? "",
          printing.name,
          ...(printing.promoTypes ?? []),
          printing.treatment ?? "",
        ].join(" "),
        constraint.value,
      );
    case "promo":
      return containsAnyToken(
        [printing.productFamily, printing.treatment, ...(printing.promoTypes ?? [])].join(
          " ",
        ),
        constraint.value,
      );
    case "releaseYear":
      return normalize(printing.releaseYear) === normalize(constraint.value);
    case "set":
      return contains(printing.set, constraint.value);
    case "setCode":
      return normalize(printing.setCode) === normalize(constraint.value);
    case "treatment":
    case "variant":
      if (
        normalize(constraint.value) === "textless" &&
        /(textless|store championship|championship)/i.test(
          getSearchablePrintingText(printing),
        )
      ) {
        return true;
      }

      if (
        normalize(constraint.value) === "masterpiece" &&
        /(invention|invocation|expedition|masterpiece)/i.test(
          getSearchablePrintingText(printing),
        )
      ) {
        return true;
      }

      return contains(getSearchablePrintingText(printing), constraint.value);
    case "condition":
    case "grading":
      return true;
    default:
      return false;
  }
}

function getConstraintWeight(constraint: PrintingConstraint) {
  if (
    constraint.type === "condition" ||
    constraint.type === "grading"
  ) {
    return 0;
  }

  return printingConstraintWeights[constraint.type] ?? 10;
}

export function scorePrintingAgainstConstraints(
  printing: Card,
  constraints: PrintingConstraint[],
): PrintingMatchCandidate {
  const matches: ConstraintMatch[] = constraints.map((constraint) => {
    const matched = matchesConstraint(printing, constraint);

    return {
      constraint,
      matched,
      score: matched ? getConstraintWeight(constraint) : 0,
    };
  });
  const selectableMatches = matches.filter(
    (match) =>
      match.constraint.priority !== "informational" &&
      getConstraintWeight(match.constraint) > 0,
  );
  const maximumScore = selectableMatches.reduce(
    (total, match) => total + getConstraintWeight(match.constraint),
    0,
  );
  const score = selectableMatches.reduce((total, match) => total + match.score, 0);
  const mandatoryMisses = selectableMatches.filter(
    (match) =>
      match.constraint.priority === "mandatory" &&
      !match.matched,
  );
  const preferredMisses = selectableMatches.filter(
    (match) =>
      match.constraint.priority === "preferred" &&
      !match.matched,
  );
  const penalty =
    mandatoryMisses.length * constraintConfig.mandatoryConstraintPenalty +
    preferredMisses.length * constraintConfig.preferredConstraintPenalty;
  const confidence =
    maximumScore > 0
      ? Math.max(0, Math.round((score / maximumScore) * 100 - penalty))
      : 50;

  return {
    confidence,
    explanation: [],
    matchedConstraints: matches.filter((match) => match.matched),
    printing,
    relaxedConstraints: constraints.filter(
      (constraint) => constraint.priority === "informational",
    ),
    unmatchedConstraints: matches.filter((match) => !match.matched),
  };
}
