import { NextResponse } from "next/server";
import { duneQuery } from "@/lib/dune";
import { DEMO_DAILY } from "@/lib/demo-data";

export const revalidate = 3600;

const SQL = `
WITH transfers AS (
  SELECT evt_block_time, CAST(amount AS DOUBLE) / 1e6 AS usdc_amount FROM circle_cctp_v1_ethereum.tokenmessenger_evt_depositforburn WHERE evt_block_time >= NOW() - INTERVAL '30' DAY
  UNION ALL
  SELECT evt_block_time, CAST(amount AS DOUBLE) / 1e6 FROM circle_cctp_v1_arbitrum.tokenmessenger_evt_depositforburn WHERE evt_block_time >= NOW() - INTERVAL '30' DAY
  UNION ALL
  SELECT evt_block_time, CAST(amount AS DOUBLE) / 1e6 FROM circle_cctp_v1_base.tokenmessenger_evt_depositforburn WHERE evt_block_time >= NOW() - INTERVAL '30' DAY
  UNION ALL
  SELECT evt_block_time, CAST(amount AS DOUBLE) / 1e6 FROM circle_cctp_v1_optimism.tokenmessenger_evt_depositforburn WHERE evt_block_time >= NOW() - INTERVAL '30' DAY
  UNION ALL
  SELECT evt_block_time, CAST(amount AS DOUBLE) / 1e6 FROM circle_cctp_v1_polygon.tokenmessenger_evt_depositforburn WHERE evt_block_time >= NOW() - INTERVAL '30' DAY
  UNION ALL
  SELECT evt_block_time, CAST(amount AS DOUBLE) / 1e6 FROM circle_cctp_v1_avalanche_c.tokenmessenger_evt_depositforburn WHERE evt_block_time >= NOW() - INTERVAL '30' DAY
)
SELECT
  DATE_TRUNC('day', evt_block_time) AS date,
  COUNT(*) AS tx_count,
  SUM(usdc_amount) AS volume
FROM transfers
GROUP BY 1
ORDER BY 1
`;

export async function GET() {
  try {
    const rows = await duneQuery(SQL);
    const data = rows.map((r) => ({
      date: String(r.date).slice(0, 10),
      volume: Number(r.volume),
      tx_count: Number(r.tx_count),
    }));
    return NextResponse.json({ data, source: "dune" });
  } catch (e) {
    console.error("Dune daily failed, using demo data:", e);
    return NextResponse.json({ data: DEMO_DAILY, source: "demo" });
  }
}
