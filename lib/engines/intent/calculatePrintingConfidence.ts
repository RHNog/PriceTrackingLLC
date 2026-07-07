import type { Card } from "@/types/card";
import type { Constraint } from "@/types/constraint";

function printingContains(printing: Card, value: string) {
  return `${printing.name} ${printing.set} ${printing.number} ${printing.finish} ${printing.rarity}`
    .toLowerCase()
    .includes(value.toLowerCase());
}

export function calculatePrintingConfidence(
  printing: Card,
  constraints: Constraint[],
) {
  if (constraints.length === 0) {
    return 50;
  }

  const matchedConstraints = constraints.filter((constraint) =>
    printingContains(printing, constraint.value),
  );

  return Math.min(100, Math.round((matchedConstraints.length / constraints.length) * 100));
}
