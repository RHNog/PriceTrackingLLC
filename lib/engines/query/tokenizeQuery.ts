import { normalizeQuery } from "@/lib/engines/query/normalizeQuery";

export function tokenizeQuery(raw: string) {
  return normalizeQuery(raw).split(" ").filter(Boolean);
}
