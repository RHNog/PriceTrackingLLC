import { calculateNetProfit } from "@/lib/engines/profit/calculateNetProfit";
import { calculateOpportunityScore } from "@/lib/scoring/calculateOpportunityScore";
import type { Opportunity } from "@/types/opportunity";

const urzasSagaProfit = calculateNetProfit({
  purchasePrice: 645,
  sellPrice: 812,
  marketplaceFees: 42,
  shippingCost: 18,
});

const moxOpalProfit = calculateNetProfit({
  purchasePrice: 520,
  sellPrice: 640,
  marketplaceFees: 35,
  shippingCost: 15,
});

const storeChampionshipProfit = calculateNetProfit({
  purchasePrice: 725,
  sellPrice: 895,
  marketplaceFees: 46,
  shippingCost: 18,
});

export const mockOpportunities: Opportunity[] = [
  {
    id: "urzas-saga-textless-foil",
    cardId: "urzas-saga-textless-foil",
    buyListingId: "buy-urzas-saga-ligamagic",
    sellListingId: "sell-urzas-saga-tcgplayer",
    watchlistId: "arbitrage-br-usa",
    estimatedFees: 42,
    shippingCost: 18,
    profit: urzasSagaProfit.netProfit,
    paymentFee: urzasSagaProfit.paymentFee,
    totalCosts: urzasSagaProfit.totalCosts,
    roi: 16.6,
    score: calculateOpportunityScore({
      roi: 16.6,
      profit: urzasSagaProfit.netProfit,
      shippingCost: 18,
      estimatedFees: 42,
    }),
    detectedAt: "Now",
  },
  {
    id: "mox-opal-judge-foil",
    cardId: "mox-opal-judge-foil",
    buyListingId: "buy-mox-opal-tcgplayer",
    sellListingId: "sell-mox-opal-card-kingdom",
    watchlistId: "spikes",
    estimatedFees: 35,
    shippingCost: 15,
    profit: moxOpalProfit.netProfit,
    paymentFee: moxOpalProfit.paymentFee,
    totalCosts: moxOpalProfit.totalCosts,
    roi: 13.4,
    score: calculateOpportunityScore({
      roi: 13.4,
      profit: moxOpalProfit.netProfit,
      shippingCost: 15,
      estimatedFees: 35,
    }),
    detectedAt: "Now",
  },
  {
    id: "store-championship-urzas-saga-textless",
    cardId: "store-championship-urzas-saga-textless",
    buyListingId: "buy-store-championship-urzas-saga-ebay",
    sellListingId: "sell-store-championship-urzas-saga-tcgplayer",
    watchlistId: "cards-to-watch",
    estimatedFees: 46,
    shippingCost: 18,
    profit: storeChampionshipProfit.netProfit,
    paymentFee: storeChampionshipProfit.paymentFee,
    totalCosts: storeChampionshipProfit.totalCosts,
    roi: 14.6,
    score: calculateOpportunityScore({
      roi: 14.6,
      profit: storeChampionshipProfit.netProfit,
      shippingCost: 18,
      estimatedFees: 46,
    }),
    detectedAt: "Now",
  },
];
