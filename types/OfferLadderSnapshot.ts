export interface OfferLadderSnapshot {
  explanation: string[];
  maximumBuyPrice: number;
  offerLadderId: string;
  openingOffer: number;
  targetOffer: number;
  validationStatus: "READY";
  walkAwayPrice: number;
}
