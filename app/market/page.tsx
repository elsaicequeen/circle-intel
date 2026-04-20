"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "@/components/metric-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, BarChart, Bar,
} from "recharts";

interface StablecoinCard {
  id: string;
  symbol: string;
  name: string;
  color: string;
  circulating: number;
  change30d: number;
  chains: { chain: string; supply: number }[];
}

interface HistoryPoint {
  id: string;
  symbol: string;
  color: string;
  history: { date: string; supply: number }[];
}

interface MarketData {
  cards: StablecoinCard[];
  histories: HistoryPoint[];
  totalMarketSupply: number;
}

function fmt(n: number) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toFixed(0)}`;
}

export default function MarketPage() {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/market/stablecoins")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, []);

  const usdc = data?.cards.find((c) => c.symbol === "USDC");
  const totalSupply = data?.totalMarketSupply ?? (data?.cards ?? []).reduce((s, c) => s + c.circulating, 0);
  const usdcShare = usdc && totalSupply ? ((usdc.circulating / totalSupply) * 100).toFixed(1) : "—";

  // Build combined time-series for stacked area
  const allDates = data?.histories[0]?.history.map((h) => h.date) ?? [];
  const chartData = allDates.map((date) => {
    const row: Record<string, string | number> = { date };
    data?.histories.forEach((h) => {
      const pt = h.history.find((p) => p.date === date);
      row[h.symbol] = pt ? Math.round(pt.supply / 1e9 * 100) / 100 : 0;
    });
    return row;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Stablecoin Market Share</h1>
        <p className="text-sm text-muted-foreground mt-1">Supply, market share, and chain distribution · 90-day history via DefiLlama</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
        ) : (
          <>
            <MetricCard label="USDC Supply" value={fmt(usdc?.circulating ?? 0)} trend={usdc?.change30d} sub="vs 30 days ago" accent="#2563eb" />
            <MetricCard label="USDC Market Share" value={`${usdcShare}%`} sub="of tracked stablecoins" accent="#2563eb" />
            <MetricCard label="Total Stablecoin Supply" value={fmt(totalSupply)} sub="All USD-pegged assets" accent="#6b7280" />
            <MetricCard label="USDC Chains" value={String(usdc?.chains.length ?? 0)} sub="Active networks" accent="#22c55e" />
          </>
        )}
      </div>

      {/* Stablecoin cards row */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {data?.cards.map((c) => (
            <Card key={c.id} className="p-4 border-border" style={{ borderTop: `2px solid ${c.color}` }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-sm">{c.symbol}</span>
                <Badge
                  variant="outline"
                  className="text-xs px-1.5 py-0"
                  style={{ color: c.change30d >= 0 ? "#22c55e" : "#ef4444", borderColor: "transparent" }}
                >
                  {c.change30d >= 0 ? "+" : ""}{c.change30d.toFixed(1)}%
                </Badge>
              </div>
              <div className="text-lg font-bold">{fmt(c.circulating)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {totalSupply > 0 ? ((c.circulating / totalSupply) * 100).toFixed(1) : 0}% share
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Stacked area + chain breakdown */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="text-sm font-medium mb-4">Supply Over Time (90d, $B)</h3>
          {loading ? (
            <Skeleton className="h-56 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e8f2" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#5d6787" }} tickFormatter={(d) => d.slice(5)} stroke="#e4e8f2" interval={13} />
                <YAxis tick={{ fontSize: 10, fill: "#5d6787" }} tickFormatter={(v) => `$${v}B`} stroke="#e4e8f2" width={50} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e4e8f2", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  labelStyle={{ color: "#0d0e16", fontWeight: 600, marginBottom: 4 }}
                  itemStyle={{ color: "#5d6787" }}
                  formatter={(v, name) => [`$${Number(v).toFixed(1)}B`, name as string]}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {data?.histories.map((h) => (
                  <Area key={h.symbol} type="monotone" dataKey={h.symbol} stackId="1"
                    stroke={h.color} fill={h.color} fillOpacity={0.15} strokeWidth={2} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-medium mb-4">USDC Supply by Chain</h3>
          {loading ? (
            <Skeleton className="h-56 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={usdc?.chains.slice(0, 8) ?? []} layout="vertical" margin={{ left: 0, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e8f2" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#5d6787" }} tickFormatter={(v) => fmt(v)} stroke="#e4e8f2" />
                <YAxis type="category" dataKey="chain" tick={{ fontSize: 11, fill: "#0d0e16" }} stroke="#e4e8f2" width={90} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e4e8f2", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  labelStyle={{ color: "#0d0e16", fontWeight: 600 }}
                  itemStyle={{ color: "#5d6787" }}
                  formatter={(v) => [fmt(Number(v)), "Supply"]}
                />
                <Bar dataKey="supply" fill="#3752ff" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Stablecoin comparison table */}
      <Card className="p-5">
        <h3 className="text-sm font-medium mb-4">Stablecoin Comparison</h3>
        {loading ? (
          <div className="space-y-2">{Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="text-left pb-2 font-medium">Asset</th>
                <th className="text-right pb-2 font-medium">Supply</th>
                <th className="text-right pb-2 font-medium">Market Share</th>
                <th className="text-right pb-2 font-medium">30d Change</th>
                <th className="text-right pb-2 font-medium">Top Chain</th>
                <th className="text-right pb-2 font-medium">Chains</th>
              </tr>
            </thead>
            <tbody>
              {data?.cards.map((c) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="font-semibold">{c.symbol}</span>
                      <span className="text-muted-foreground text-xs hidden md:inline">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right font-mono font-medium">{fmt(c.circulating)}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full rounded-full" style={{
                          width: `${totalSupply > 0 ? (c.circulating / totalSupply) * 100 : 0}%`,
                          backgroundColor: c.color,
                        }} />
                      </div>
                      <span className="text-xs w-10 text-right">
                        {totalSupply > 0 ? ((c.circulating / totalSupply) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </td>
                  <td className={`py-3 text-right font-mono text-sm ${c.change30d >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {c.change30d >= 0 ? "+" : ""}{c.change30d.toFixed(2)}%
                  </td>
                  <td className="py-3 text-right text-muted-foreground text-xs">
                    {c.chains[0]?.chain ?? "—"}
                  </td>
                  <td className="py-3 text-right text-muted-foreground">{c.chains.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
