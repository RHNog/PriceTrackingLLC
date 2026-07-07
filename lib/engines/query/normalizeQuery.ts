import { normalizeQuery as normalizeSearchQuery } from "@/lib/engines/search/normalizeQuery";

export function normalizeQuery(raw: string) {
  return normalizeSearchQuery(raw);
}
