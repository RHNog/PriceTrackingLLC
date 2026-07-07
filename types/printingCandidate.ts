import type { Card } from "@/types/card";

export interface PrintingCandidate {
  confidence: number;
  explanation: string[];
  printing: Card;
  rejectedReason?: string;
}
