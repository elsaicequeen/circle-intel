import { NextResponse } from "next/server";
import { PARTNERS } from "@/data/partners";

export function GET() {
  const byCategory = PARTNERS.reduce(
    (acc, p) => {
      if (!acc[p.category]) acc[p.category] = [];
      acc[p.category].push(p);
      return acc;
    },
    {} as Record<string, typeof PARTNERS>
  );

  return NextResponse.json({
    partners: PARTNERS,
    byCategory,
    stats: {
      total: PARTNERS.length,
      categories: Object.keys(byCategory).length,
      chains: [...new Set(PARTNERS.flatMap((p) => p.chains ?? []))].length,
    },
  });
}
