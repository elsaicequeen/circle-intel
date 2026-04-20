import { NextResponse } from "next/server";
import { duneQueryById, DUNE_QUERY_IDS } from "@/lib/dune";

export const revalidate = 3600;

export async function GET() {
  const rows = await duneQueryById(DUNE_QUERY_IDS.cctpCorridors);
  return NextResponse.json({ data: rows, source: "dune" });
}
