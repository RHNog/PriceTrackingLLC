export type PlayabilityRole =
  | "Artifact Synergy"
  | "Fast Mana"
  | "Commander Staple"
  | "Combo Piece"
  | "Competitive Staple"
  | "Collector Card"
  | "Tutor"
  | "Removal"
  | "Counterspell"
  | "Finisher"
  | "Engine"
  | "Utility"
  | "Value Card"
  | "Ramp"
  | "Protection"
  | "Card Draw";

export interface PlayabilityRoleSignal {
  confidence: number;
  explanation: string;
  role: PlayabilityRole;
}
