import Link from "next/link";
import { ArrowRight, Activity, BarChart3, Network } from "lucide-react";

const apps = [
  {
    href: "/flows",
    icon: Activity,
    title: "CCTP Cross-Chain Flows",
    description: "30-day USDC transfer volume and corridors across all CCTP-supported chains. Powered by Dune Analytics.",
    color: "#2563eb",
    stats: "6 chains · Real-time",
  },
  {
    href: "/market",
    icon: BarChart3,
    title: "Stablecoin Market Share",
    description: "USDC vs USDT vs DAI vs PYUSD — market cap, velocity, and chain distribution over 90 days.",
    color: "#22c55e",
    stats: "6 stablecoins · 90-day history",
  },
  {
    href: "/ecosystem",
    icon: Network,
    title: "Circle Ecosystem",
    description: "40+ Circle partners across exchanges, wallets, payments, DeFi, and fintech with integration details.",
    color: "#a855f7",
    stats: "40+ partners · 7 categories",
  },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-14 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Mainnet · Live Data
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Circle Intelligence Suite
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Real-time analytics on USDC flows, stablecoin market dynamics, and the Circle partner ecosystem.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {apps.map((app) => (
          <Link
            key={app.href}
            href={app.href}
            className="group relative rounded-xl border border-border bg-card p-6 hover:border-primary/40 transition-all hover:-translate-y-0.5"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: `${app.color}20` }}
            >
              <app.icon className="w-5 h-5" style={{ color: app.color }} />
            </div>
            <h2 className="font-semibold mb-2">{app.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{app.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{app.stats}</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
