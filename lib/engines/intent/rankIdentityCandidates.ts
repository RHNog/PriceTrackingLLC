import { intentConfig } from "@/config/intent";
import { explainResolution } from "@/lib/engines/entity/explainResolution";
import { filterCandidates } from "@/lib/engines/entity/filterCandidates";
import {
  calculateIdentityConfidence,
  calculateIdentityScoreDetails,
} from "@/lib/engines/intent/calculateIdentityConfidence";
import type { CardIdentity } from "@/types/cardIdentity";
import type { IdentityCandidate } from "@/types/identityCandidate";
import type { ParsedQuery } from "@/types/parsedQuery";

export function rankIdentityCandidates(
  identities: CardIdentity[],
  parsedQuery: ParsedQuery,
): IdentityCandidate[] {
  return filterCandidates(identities)
    .accepted.map(({ identity, relationship }) => {
      const confidence = calculateIdentityConfidence(
        identity,
        parsedQuery,
        relationship,
      );
      const scoreDetails = calculateIdentityScoreDetails(
        identity,
        parsedQuery,
        relationship,
      );
      const candidate: IdentityCandidate = {
        confidence,
        explanation: [
          `Identity confidence is ${confidence}.`,
          `Relationship ${relationship.type} weighted ${relationship.weight}.`,
          `${identity.printings.length} printings available.`,
        ],
        identity,
        normalizationBoost: scoreDetails.normalizationBoost,
        scoreAfterNormalizationBoost: scoreDetails.scoreAfterNormalizationBoost,
        scoreBeforeNormalizationBoost: scoreDetails.scoreBeforeNormalizationBoost,
        relationship,
      };

      return {
        ...candidate,
        explanationDetails: explainResolution(candidate),
      };
    })
    .sort((first, second) => second.confidence - first.confidence)
    .slice(0, intentConfig.maximumIdentityResults);
}
