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
    <nav className="border-b border-border bg-white/85 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-10">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-full bg-[#3752ff] flex items-center justify-center shadow-sm">
            <span className="text-white text-[11px] font-bold tracking-tight">C</span>
          </div>
          <span className="font-semibold text-[15px] tracking-tight">Circle Intel</span>
        </Link>
        <div className="flex items-center gap-0.5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                pathname === l.href
                  ? "bg-[#eef1fb] text-[#3752ff]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-muted-foreground">Mainnet · Live</span>
        </div>
      </div>
    </nav>
  );
}
