export { buildParsedQuery as resolveQuery } from "@/lib/engines/query/buildParsedQuery";
import type { ParsedQuery } from "@/types/parsedQuery";
import type { Card } from "@/types/card";

export function printingMatchesParsedQuery(card: Card, parsedQuery: ParsedQuery) {
  const searchablePrinting = `${card.name} ${card.set} ${card.finish}`.toLowerCase();

  return (
    (!parsedQuery.set ||
      card.set.toLowerCase().includes(parsedQuery.set.toLowerCase())) &&
    (!parsedQuery.setCode ||
      card.set.toLowerCase().includes(parsedQuery.setCode.toLowerCase())) &&
    (!parsedQuery.collectorNumber ||
      card.number === parsedQuery.collectorNumber) &&
    (!parsedQuery.finish ||
      card.finish.toLowerCase().includes(parsedQuery.finish.toLowerCase())) &&
    (!parsedQuery.frame ||
      searchablePrinting.includes(parsedQuery.frame.toLowerCase())) &&
    (!parsedQuery.treatment ||
      searchablePrinting.includes(parsedQuery.treatment.toLowerCase())) &&
    (!parsedQuery.promo ||
      searchablePrinting.includes(parsedQuery.promo.toLowerCase())) &&
    (!parsedQuery.language ||
      searchablePrinting.includes(parsedQuery.language.toLowerCase()) ||
      parsedQuery.language === "English")
  );
}
