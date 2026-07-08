import type { PlayabilityFormat } from "@/lib/intelligence/playability/PlayabilityIndicator";
import type { PlayabilityRole } from "@/lib/intelligence/playability/PlayabilityRole";
import type { PlayabilityTrend } from "@/lib/intelligence/playability/PlayabilityTrend";

export type PlayabilityFormatWeight = {
  competitiveWeight: number;
  casualWeight: number;
  demandWeight: number;
};

export type PlayabilityFormatDemandHint = {
  casualRelevanceBonus?: number;
  competitiveRelevanceBonus?: number;
  demandBonus?: number;
  keySignals?: string[];
  trend?: PlayabilityTrend;
};

export type PlayabilityCardDemandHint = {
  businessConclusion: string;
  confidenceBonus: number;
  confidenceReason: string;
  formatHints: Partial<Record<PlayabilityFormat, PlayabilityFormatDemandHint>>;
  keySignals: string[];
  roles: PlayabilityRole[];
};

export const playabilityFormatWeights: Record<
  Exclude<PlayabilityFormat, "Overall">,
  PlayabilityFormatWeight
> = {
  "Canadian Highlander": {
    casualWeight: 0.65,
    competitiveWeight: 0.35,
    demandWeight: 0.2,
  },
  Commander: {
    casualWeight: 1,
    competitiveWeight: 0.35,
    demandWeight: 1,
  },
  Explorer: {
    casualWeight: 0.15,
    competitiveWeight: 0.65,
    demandWeight: 0.35,
  },
  Legacy: {
    casualWeight: 0.2,
    competitiveWeight: 0.85,
    demandWeight: 0.45,
  },
  Modern: {
    casualWeight: 0.25,
    competitiveWeight: 0.9,
    demandWeight: 0.75,
  },
  Pauper: {
    casualWeight: 0.35,
    competitiveWeight: 0.55,
    demandWeight: 0.3,
  },
  Pioneer: {
    casualWeight: 0.2,
    competitiveWeight: 0.75,
    demandWeight: 0.45,
  },
  Standard: {
    casualWeight: 0.15,
    competitiveWeight: 0.7,
    demandWeight: 0.4,
  },
  Vintage: {
    casualWeight: 0.1,
    competitiveWeight: 0.8,
    demandWeight: 0.18,
  },
};

export const playabilityCardDemandHints: Record<
  string,
  PlayabilityCardDemandHint
> = {
  "black lotus": {
    businessConclusion:
      "Black Lotus is played because it is the defining Vintage power card, but its market demand is not broad gameplay demand. Its value depends on iconic restricted-format relevance more than active tournament volume.",
    confidenceBonus: 8,
    confidenceReason:
      "Live Vintage metagame and paper tournament demand providers have not yet been connected.",
    formatHints: {
      Vintage: {
        competitiveRelevanceBonus: 45,
        demandBonus: 25,
        keySignals: ["Vintage Power Card", "Narrow Play Demand"],
      },
    },
    keySignals: ["Vintage Power Card", "Low Format Breadth", "Narrow Play Demand"],
    roles: ["Fast Mana", "Combo Piece", "Utility"],
  },
  "chrome mox": {
    businessConclusion:
      "Chrome Mox is driven by high-powered Commander and older competitive formats. Its value depends on fast-mana demand from enfranchised players rather than broad casual adoption.",
    confidenceBonus: 10,
    confidenceReason:
      "Commander deck penetration and competitive usage providers have not yet been connected.",
    formatHints: {
      Commander: {
        casualRelevanceBonus: 20,
        demandBonus: 18,
        keySignals: ["Commander Fast Mana"],
        trend: "Stable",
      },
      Legacy: {
        competitiveRelevanceBonus: 25,
        demandBonus: 14,
        keySignals: ["Legacy Playable"],
      },
      Vintage: {
        competitiveRelevanceBonus: 20,
        demandBonus: 8,
      },
    },
    keySignals: ["Commander Fast Mana", "Legacy Playable", "Stable Demand"],
    roles: ["Fast Mana", "Combo Piece", "Utility"],
  },
  "collected company": {
    businessConclusion:
      "Collected Company is primarily driven by competitive creature decks in Modern, Pioneer, and Explorer. Its value depends more on metagame positioning than casual multiplayer demand.",
    confidenceBonus: 10,
    confidenceReason:
      "Modern, Pioneer, and Explorer metagame share providers have not yet been connected.",
    formatHints: {
      Explorer: {
        competitiveRelevanceBonus: 30,
        demandBonus: 18,
        keySignals: ["Explorer Competitive Demand"],
      },
      Modern: {
        competitiveRelevanceBonus: 32,
        demandBonus: 22,
        keySignals: ["Modern Competitive Demand"],
      },
      Pioneer: {
        competitiveRelevanceBonus: 34,
        demandBonus: 24,
        keySignals: ["Pioneer Competitive Demand"],
      },
    },
    keySignals: [
      "Competitive Deck Engine",
      "Moderate Casual Adoption",
      "Meta Dependent",
    ],
    roles: ["Engine", "Value Card", "Combo Piece"],
  },
  counterspell: {
    businessConclusion:
      "Counterspell is driven by broad format recognition and steady blue-deck demand. Its value depends on sustained format legality and casual familiarity rather than a single tournament spike.",
    confidenceBonus: 8,
    confidenceReason:
      "Detailed deck share and casual adoption providers have not yet been connected.",
    formatHints: {
      Commander: {
        casualRelevanceBonus: 18,
        demandBonus: 16,
        keySignals: ["Broad Casual Adoption"],
      },
      Legacy: {
        competitiveRelevanceBonus: 18,
        demandBonus: 12,
      },
      Modern: {
        competitiveRelevanceBonus: 22,
        demandBonus: 18,
      },
      Pauper: {
        competitiveRelevanceBonus: 20,
        demandBonus: 14,
      },
    },
    keySignals: ["Broad Format Diversity", "Stable Demand", "Casual Staple"],
    roles: ["Counterspell", "Protection", "Utility"],
  },
  "lightning bolt": {
    businessConclusion:
      "Lightning Bolt is played because it is efficient, iconic removal across multiple competitive and casual formats. Its value is supported by broad format diversity rather than one format alone.",
    confidenceBonus: 10,
    confidenceReason:
      "Format usage depth providers have not yet been connected.",
    formatHints: {
      Commander: {
        casualRelevanceBonus: 12,
        demandBonus: 10,
      },
      Legacy: {
        competitiveRelevanceBonus: 20,
        demandBonus: 16,
      },
      Modern: {
        competitiveRelevanceBonus: 32,
        demandBonus: 24,
        keySignals: ["Modern Staple"],
      },
      Pauper: {
        competitiveRelevanceBonus: 24,
        demandBonus: 18,
      },
      Vintage: {
        competitiveRelevanceBonus: 10,
        demandBonus: 6,
      },
    },
    keySignals: ["Broad Format Diversity", "Modern Staple", "Stable Demand"],
    roles: ["Removal", "Utility"],
  },
  "mox opal": {
    businessConclusion:
      "Mox Opal derives demand primarily from artifact-centric competitive strategies and Commander fast mana applications.",
    confidenceBonus: 10,
    confidenceReason:
      "Artifact archetype usage and Commander adoption providers have not yet been connected.",
    formatHints: {
      Commander: {
        casualRelevanceBonus: 18,
        demandBonus: 16,
        keySignals: ["Commander Fast Mana"],
        trend: "Stable",
      },
      Legacy: {
        competitiveRelevanceBonus: 24,
        demandBonus: 16,
        keySignals: ["Artifact Competitive Demand"],
      },
      Modern: {
        competitiveRelevanceBonus: 10,
        demandBonus: 4,
        keySignals: ["Banned Competitive History"],
      },
    },
    keySignals: ["Fast Mana", "Combo Enabler", "Artifact Strategy Demand"],
    roles: [
      "Fast Mana",
      "Combo Piece",
      "Artifact Synergy",
      "Competitive Staple",
      "Collector Card",
      "Engine",
      "Ramp",
    ],
  },
  "sol ring": {
    businessConclusion:
      "Sol Ring is overwhelmingly driven by Commander demand. Its value depends on continued multiplayer adoption rather than tournament performance.",
    confidenceBonus: 12,
    confidenceReason:
      "Commander deck penetration providers such as EDHREC have not yet been connected.",
    formatHints: {
      Commander: {
        casualRelevanceBonus: 45,
        demandBonus: 35,
        keySignals: ["Commander Staple", "High Casual Adoption"],
        trend: "Stable",
      },
      Vintage: {
        competitiveRelevanceBonus: 10,
        demandBonus: 4,
      },
    },
    keySignals: ["Commander Staple", "High Casual Adoption", "Low Competitive Presence"],
    roles: ["Fast Mana", "Commander Staple", "Ramp"],
  },
};
