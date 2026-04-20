import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Circle Intel — USDC & Ecosystem Intelligence",
  description: "Real-time intelligence on USDC cross-chain flows, stablecoin market dynamics, and the Circle partner ecosystem.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border bg-muted/40 mt-12">
          <div className="max-w-7xl mx-auto px-6 py-8 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
            <span>Data: <a className="underline hover:text-foreground" href="https://dune.com" target="_blank" rel="noreferrer">Dune Analytics</a> · <a className="underline hover:text-foreground" href="https://defillama.com" target="_blank" rel="noreferrer">DefiLlama</a> · <a className="underline hover:text-foreground" href="https://developers.circle.com" target="_blank" rel="noreferrer">Circle APIs</a></span>
            <span>Built as interview research — not affiliated with Circle Internet Financial.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
