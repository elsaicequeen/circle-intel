"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/metric-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Partner, PartnerCategory } from "@/data/partners";

const CATEGORY_COLORS: Record<PartnerCategory, string> = {
  Exchange: "#f59e0b",
  Wallet: "#2563eb",
  Payments: "#22c55e",
  DeFi: "#a855f7",
  Infrastructure: "#06b6d4",
  Fintech: "#ec4899",
  Gaming: "#ef4444",
};

const CATEGORIES: PartnerCategory[] = ["Exchange", "Wallet", "Payments", "DeFi", "Infrastructure", "Fintech", "Gaming"];

interface EcosystemData {
  partners: Partner[];
  byCategory: Record<string, Partner[]>;
  stats: { total: number; categories: number; chains: number };
}

export default function EcosystemPage() {
  const [data, setData] = useState<EcosystemData | null>(null);
  const [filter, setFilter] = useState<PartnerCategory | "All">("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ecosystem/partners")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, []);

  const displayed = filter === "All"
    ? (data?.partners ?? [])
    : (data?.byCategory[filter] ?? []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Circle Ecosystem</h1>
        <p className="text-sm text-muted-foreground mt-1">Partners integrating USDC and Circle infrastructure across the global financial system</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
        ) : (
          <>
            <MetricCard label="Total Partners" value={String(data?.stats.total ?? 0)} sub="Tracked integrations" accent="#2563eb" />
            <MetricCard label="Categories" value={String(data?.stats.categories ?? 0)} sub="Exchange to Gaming" accent="#a855f7" />
            <MetricCard label="Chains Covered" value={`${data?.stats.chains ?? 0}+`} sub="Unique networks" accent="#22c55e" />
            <MetricCard label="Notable Partners" value="Stripe · Visa · Coinbase" sub="Recent integrations" accent="#f59e0b" />
          </>
        )}
      </div>

      {/* Category counts bar */}
      {!loading && (
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          <button
            onClick={() => setFilter("All")}
            className={`rounded-lg border p-3 text-center transition-colors cursor-pointer ${
              filter === "All" ? "border-primary/50 bg-primary/10" : "border-border bg-card hover:bg-secondary"
            }`}
          >
            <div className="text-lg font-bold">{data?.stats.total}</div>
            <div className="text-xs text-muted-foreground">All</div>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-lg border p-3 text-center transition-colors cursor-pointer ${
                filter === cat ? "border-primary/50 bg-primary/10" : "border-border bg-card hover:bg-secondary"
              }`}
            >
              <div className="text-lg font-bold" style={{ color: CATEGORY_COLORS[cat] }}>
                {data?.byCategory[cat]?.length ?? 0}
              </div>
              <div className="text-xs text-muted-foreground">{cat}</div>
            </button>
          ))}
        </div>
      )}

      {/* Partner cards grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(12).fill(0).map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayed.map((p) => (
            <Card key={p.name} className="p-4 border-border hover:border-primary/30 transition-colors"
              style={{ borderLeft: `3px solid ${CATEGORY_COLORS[p.category]}` }}>
              <div className="flex items-start justify-between mb-2">
                <span className="font-semibold text-sm">{p.name}</span>
                <Badge
                  variant="outline"
                  className="text-xs shrink-0 ml-2"
                  style={{ color: CATEGORY_COLORS[p.category], borderColor: `${CATEGORY_COLORS[p.category]}40` }}
                >
                  {p.category}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{p.description}</p>
              <div className="flex flex-wrap gap-1">
                {p.since && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                    Since {p.since}
                  </span>
                )}
                {p.chains?.slice(0, 2).map((ch) => (
                  <span key={ch} className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                    {ch}
                  </span>
                ))}
              </div>
              {p.notable && (
                <div className="mt-2 text-xs text-primary/80 bg-primary/5 rounded px-2 py-1">
                  {p.notable}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
