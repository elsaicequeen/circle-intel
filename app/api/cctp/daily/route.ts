import { NextResponse } from "next/server";
import { duneQueryById, DUNE_QUERY_IDS } from "@/lib/dune";

export const revalidate = 3600;

export async function GET() {
  const rows = await duneQueryById(DUNE_QUERY_IDS.cctpDaily);
  const data = rows.map((r) => ({
    date: String(r.date).slice(0, 10),
    volume: Number(r.volume),
    tx_count: Number(r.tx_count),
  }));
  return NextResponse.json({ data, source: "dune" });
}
