import { NextResponse } from "next/server";
import { fetchStablecoins, fetchStablecoinHistory, colorFor } from "@/lib/defillama";

export const revalidate = 3600;

export async function GET() {
  const { summaries, totalMarketSupply } = await fetchStablecoins();

  const histories = await Promise.all(
    summaries.map(async (s, i) => {
      const hist = await fetchStablecoinHistory(s.id);
      const recent = hist.slice(-90).map((pt) => ({
        date: new Date(pt.date * 1000).toISOString().slice(0, 10),
        supply: pt.circulating?.peggedUSD ?? 0,
      }));
      return { id: s.id, symbol: s.symbol, color: colorFor(s.symbol, i), history: recent };
    })
  );

  const cards = summaries.map((s, i) => {
    const current = s.circulating?.peggedUSD ?? 0;
    const prev30d = s.circulatingPrevMonth?.peggedUSD ?? 0;
    return {
      id: s.id,
      symbol: s.symbol,
      name: s.name,
      color: colorFor(s.symbol, i),
      circulating: current,
      prev30d,
      change30d: prev30d > 0 ? ((current - prev30d) / prev30d) * 100 : 0,
      chains: Object.entries(s.chainCirculating ?? {})
        .map(([chain, v]) => ({ chain, supply: v?.current?.peggedUSD ?? 0 }))
        .sort((a, b) => b.supply - a.supply)
        .slice(0, 8),
    };
  });

  return NextResponse.json({ cards, histories, totalMarketSupply });
}
