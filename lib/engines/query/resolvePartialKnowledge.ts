import { universalKnowledgeBase } from "@/knowledge";
import { matchKnowledgeEntry } from "@/lib/engines/query/matchKnowledgeEntry";
import type { KnowledgeMatch } from "@/types/knowledgeMatch";
import type { KnowledgeEntry } from "@/types/knowledgeEntry";

export function resolvePartialKnowledge(
  sourceToken: string,
  knowledgeBase: KnowledgeEntry[] = universalKnowledgeBase,
) {
  // TODO: Edit distance typo correction.
  // TODO: Phonetic matching.
  // TODO: User-specific autocomplete.
  // TODO: Personal vocabulary learning.
  // TODO: Community vocabulary learning.
  // TODO: Knowledge Feedback Engine and Vendor Intelligence Engine.
  // TODO: AI-assisted query correction.
  return knowledgeBase
    .map((entry) => matchKnowledgeEntry(sourceToken, entry))
    .filter((match): match is KnowledgeMatch => Boolean(match))
    .sort((first, second) => second.confidence - first.confidence)[0] ?? null;
}
