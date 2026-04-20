"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/flows", label: "CCTP Flows" },
  { href: "/market", label: "Market Share" },
  { href: "/ecosystem", label: "Ecosystem" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-bold">C</span>
          </div>
          <span className="font-semibold text-sm tracking-tight">Circle Intel</span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                pathname === l.href
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="ml-auto">
          <span className="text-xs text-muted-foreground">Mainnet · Live</span>
          <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>
    </nav>
  );
}
