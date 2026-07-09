import { JustTCG } from "justtcg-js";

async function main() {
  const apiKey = process.env.JUSTTCG_API_KEY;

  if (!apiKey) {
    throw new Error("JUSTTCG_API_KEY is not set.");
  }

  const client = new JustTCG();

  const result = await client.v1.cards.get({
    game: "Magic: The Gathering",
    query: "Mox Opal",
    limit: 1,
    include_price_history: true,
    priceHistoryDuration: "30d",
  });

  console.dir(result, { depth: null });
}

main().catch(console.error);
