"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "@/components/metric-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from "recharts";

interface Corridor {
  source_chain: string;
  dest_chain: string;
  tx_count: number;
  total_volume_usd: number;
  avg_transfer_usd: number;
}
interface DailyPoint { date: string; volume: number; tx_count: number }

const CHAIN_COLORS: Record<string, string> = {
  Ethereum: "#627eea",
  Base: "#0052ff",
  Arbitrum: "#28a0f0",
  Optimism: "#ff0420",
  Polygon: "#8247e5",
  Avalanche: "#e84142",
};

function fmt(n: number) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${(n / 1e3).toFixed(0)}K`;
}

function fmtNum(n: number) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return String(n);
}

export default function FlowsPage() {
  const [corridors, setCorridors] = useState<Corridor[]>([]);
  const [daily, setDaily] = useState<DailyPoint[]>([]);
  const [source, setSource] = useState<"dune" | "demo" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/cctp/corridors").then((r) => r.json()),
      fetch("/api/cctp/daily").then((r) => r.json()),
    ]).then(([c, d]) => {
      setCorridors(c.data);
      setDaily(d.data);
      setSource(c.source);
      setLoading(false);
    });
  }, []);

  const totalVolume = corridors.reduce((s, c) => s + c.total_volume_usd, 0);
  const totalTx = corridors.reduce((s, c) => s + c.tx_count, 0);
  const avgTransfer = totalTx > 0 ? totalVolume / totalTx : 0;
  const activePairs = corridors.length;

  const top10 = corridors.slice(0, 10);

  const chainVolume = Object.entries(
    corridors.reduce((acc, c) => {
      acc[c.source_chain] = (acc[c.source_chain] ?? 0) + c.total_volume_usd;
      return acc;
    }, {} as Record<string, number>)
  )
    .map(([chain, vol]) => ({ chain, vol }))
    .sort((a, b) => b.vol - a.vol);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CCTP Cross-Chain Flows</h1>
          <p className="text-sm text-muted-foreground mt-1">30-day USDC transfer volume via Circle's Cross-Chain Transfer Protocol</p>
        </div>
        {source && (
          <Badge variant={source === "dune" ? "default" : "secondary"}>
            {source === "dune" ? "Dune Analytics" : "Demo Data"}
          </Badge>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
        ) : (
          <>
            <MetricCard label="Total Volume (30d)" value={fmt(totalVolume)} sub="All CCTP corridors" accent="#2563eb" />
            <MetricCard label="Total Transactions" value={fmtNum(totalTx)} sub="30-day count" accent="#22c55e" />
            <MetricCard label="Avg Transfer Size" value={fmt(avgTransfer)} sub="Per transaction" accent="#f59e0b" />
            <MetricCard label="Active Corridors" value={String(activePairs)} sub="Chain-pair routes" accent="#a855f7" />
          </>
        )}
      </div>

      {/* Daily volume + chain breakdown */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="text-sm font-medium mb-4">Daily Volume (30d)</h3>
          {loading ? (
            <Skeleton className="h-52 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <LineChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d) => d.slice(5)} stroke="#ffffff30" />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => fmt(v)} stroke="#ffffff30" width={60} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a2235", border: "1px solid #ffffff15", borderRadius: 8 }}
                  formatter={(v) => [fmt(Number(v)), "Volume"]}
                />
                <Line type="monotone" dataKey="volume" stroke="#2563eb" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-medium mb-4">Volume by Source Chain</h3>
          {loading ? (
            <Skeleton className="h-52 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={chainVolume} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => fmt(v)} stroke="#ffffff30" />
                <YAxis type="category" dataKey="chain" tick={{ fontSize: 11 }} stroke="#ffffff30" width={75} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a2235", border: "1px solid #ffffff15", borderRadius: 8 }}
                  formatter={(v) => [fmt(Number(v)), "Volume"]}
                />
                <Bar dataKey="vol" radius={[0, 4, 4, 0]}>
                  {chainVolume.map((entry) => (
                    <rect key={entry.chain} fill={CHAIN_COLORS[entry.chain] ?? "#4b5563"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Corridor Leaderboard */}
      <Card className="p-5">
        <h3 className="text-sm font-medium mb-4">Top Corridors by Volume (30d)</h3>
        {loading ? (
          <div className="space-y-2">{Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="text-left pb-2 font-medium">#</th>
                  <th className="text-left pb-2 font-medium">Corridor</th>
                  <th className="text-right pb-2 font-medium">Volume (30d)</th>
                  <th className="text-right pb-2 font-medium">Transactions</th>
                  <th className="text-right pb-2 font-medium">Avg Size</th>
                  <th className="text-right pb-2 font-medium">Share</th>
                </tr>
              </thead>
              <tbody>
                {top10.map((c, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 text-muted-foreground">{i + 1}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: CHAIN_COLORS[c.source_chain] ?? "#4b5563" }}
                        />
                        <span className="font-medium">{c.source_chain}</span>
                        <span className="text-muted-foreground">→</span>
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: CHAIN_COLORS[c.dest_chain] ?? "#4b5563" }}
                        />
                        <span className="font-medium">{c.dest_chain}</span>
                      </div>
                    </td>
                    <td className="py-3 text-right font-mono font-medium">{fmt(c.total_volume_usd)}</td>
                    <td className="py-3 text-right font-mono text-muted-foreground">{fmtNum(c.tx_count)}</td>
                    <td className="py-3 text-right font-mono text-muted-foreground">{fmt(c.avg_transfer_usd)}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${(c.total_volume_usd / (corridors[0]?.total_volume_usd ?? 1)) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-10 text-right">
                          {totalVolume > 0 ? ((c.total_volume_usd / totalVolume) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
