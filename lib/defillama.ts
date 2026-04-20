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

const TRACKED_SYMBOLS = [
  { symbol: "USDC", color: "#2563eb" },
  { symbol: "USDT", color: "#22c55e" },
  { symbol: "DAI", color: "#f59e0b" },
  { symbol: "PYUSD", color: "#a855f7" },
  { symbol: "FDUSD", color: "#ec4899" },
  { symbol: "USDS", color: "#06b6d4" },
];

export const STABLECOIN_META = TRACKED_SYMBOLS.map((t) => ({ ...t, id: t.symbol }));

export async function fetchStablecoins(): Promise<StablecoinSummary[]> {
  const res = await fetch(`${BASE}/stablecoins?includePrices=true`, {
    next: { revalidate: 3600 },
  });
  const data = await res.json();
  const symbols = new Set(TRACKED_SYMBOLS.map((t) => t.symbol));
  // Pick the largest circulating supply for each symbol (dedup)
  const seen = new Map<string, StablecoinSummary>();
  for (const a of data.peggedAssets as StablecoinSummary[]) {
    if (!symbols.has(a.symbol)) continue;
    const existing = seen.get(a.symbol);
    const cur = a.circulating?.peggedUSD ?? 0;
    const existCur = existing?.circulating?.peggedUSD ?? 0;
    if (!existing || cur > existCur) seen.set(a.symbol, a);
  }
  return TRACKED_SYMBOLS.map((t) => seen.get(t.symbol)).filter(Boolean) as StablecoinSummary[];
}

export async function fetchStablecoinHistory(id: string): Promise<HistoricalPoint[]> {
  const res = await fetch(`${BASE}/stablecoin/${id}`, { cache: "no-store" });
  const data = await res.json();
  return data.tokens ?? [];
}
