import { printingMatchesParsedQuery } from "@/lib/engines/query/resolveQuery";
import type { Card } from "@/types/card";
import type { ParsedQuery } from "@/types/parsedQuery";

export function resolvePrintings(printings: Card[], parsedQuery: ParsedQuery) {
  const matchingPrintings = printings.filter((printing) =>
    printingMatchesParsedQuery(printing, parsedQuery),
  );

  return matchingPrintings.length > 0 ? matchingPrintings : printings;
}
