const BASE = "https://stablecoins.llama.fi";

export interface StablecoinSummary {
  id: string;
  name: string;
  symbol: string;
  circulating: { peggedUSD: number };
  circulatingPrevDay: { peggedUSD: number } | null;
  circulatingPrevWeek: { peggedUSD: number } | null;
  circulatingPrevMonth: { peggedUSD: number } | null;
  chains: string[];
  chainCirculating: Record<string, { current: { peggedUSD: number } }>;
  pegType: string;
  pegMechanism: string;
  price: number;
}

export interface HistoricalPoint {
  date: number;
  circulating: { peggedUSD: number };
}

// Known brand colors; unknown symbols get palette fallback
const SYMBOL_COLORS: Record<string, string> = {
  USDC:  "#3752ff",
  USDT:  "#22c55e",
  DAI:   "#f59e0b",
  PYUSD: "#a855f7",
  FDUSD: "#ec4899",
  USDS:  "#06b6d4",
  USDe:  "#ef4444",
  FRAX:  "#1e40af",
  TUSD:  "#0ea5e9",
  GUSD:  "#10b981",
};
const COLOR_PALETTE = ["#3752ff","#22c55e","#f59e0b","#a855f7","#ec4899","#06b6d4","#ef4444","#8b5cf6"];

export function colorFor(symbol: string, index: number): string {
  return SYMBOL_COLORS[symbol] ?? COLOR_PALETTE[index % COLOR_PALETTE.length];
}

export async function fetchStablecoins(): Promise<{
  summaries: StablecoinSummary[];
  totalMarketSupply: number;
}> {
  const res = await fetch(`${BASE}/stablecoins?includePrices=true`, {
    next: { revalidate: 3600 },
  });
  const data = await res.json();
  const allAssets = data.peggedAssets as StablecoinSummary[];

  // Only USD-pegged assets; dedup by symbol (keep largest supply entry)
  const seen = new Map<string, StablecoinSummary>();
  for (const a of allAssets) {
    if (a.pegType !== "peggedUSD") continue;
    const cur = a.circulating?.peggedUSD ?? 0;
    const existCur = seen.get(a.symbol)?.circulating?.peggedUSD ?? 0;
    if (cur > existCur) seen.set(a.symbol, a);
  }

  // True total market supply across all USD-pegged stablecoins
  let totalMarketSupply = 0;
  seen.forEach((a) => { totalMarketSupply += a.circulating?.peggedUSD ?? 0; });

  // Top 8 by current circulating supply
  const summaries = Array.from(seen.values())
    .sort((a, b) => (b.circulating?.peggedUSD ?? 0) - (a.circulating?.peggedUSD ?? 0))
    .slice(0, 8);

  return { summaries, totalMarketSupply };
}

export async function fetchStablecoinHistory(id: string): Promise<HistoricalPoint[]> {
  const res = await fetch(`${BASE}/stablecoin/${id}`, { cache: "no-store" });
  const data = await res.json();
  return data.tokens ?? [];
}
