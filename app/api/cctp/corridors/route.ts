import { NextResponse } from "next/server";
import { duneQuery } from "@/lib/dune";
import { DEMO_CORRIDORS } from "@/lib/demo-data";

export const revalidate = 3600;

const SQL = `
WITH transfers AS (
  SELECT 'Ethereum' AS source_chain,
    CASE CAST(destinationDomain AS INTEGER)
      WHEN 0 THEN 'Ethereum' WHEN 1 THEN 'Avalanche' WHEN 2 THEN 'Optimism'
      WHEN 3 THEN 'Arbitrum'  WHEN 6 THEN 'Base'      WHEN 7 THEN 'Polygon'
      ELSE 'Other'
    END AS dest_chain,
    CAST(amount AS DOUBLE) / 1e6 AS usdc_amount
  FROM circle_cctp_v1_ethereum.tokenmessenger_evt_depositforburn
  WHERE evt_block_time >= NOW() - INTERVAL '30' DAY

  UNION ALL
  SELECT 'Arbitrum', CASE CAST(destinationDomain AS INTEGER)
      WHEN 0 THEN 'Ethereum' WHEN 1 THEN 'Avalanche' WHEN 2 THEN 'Optimism'
      WHEN 3 THEN 'Arbitrum'  WHEN 6 THEN 'Base'      WHEN 7 THEN 'Polygon' ELSE 'Other'
    END, CAST(amount AS DOUBLE) / 1e6
  FROM circle_cctp_v1_arbitrum.tokenmessenger_evt_depositforburn
  WHERE evt_block_time >= NOW() - INTERVAL '30' DAY

  UNION ALL
  SELECT 'Base', CASE CAST(destinationDomain AS INTEGER)
      WHEN 0 THEN 'Ethereum' WHEN 1 THEN 'Avalanche' WHEN 2 THEN 'Optimism'
      WHEN 3 THEN 'Arbitrum'  WHEN 6 THEN 'Base'      WHEN 7 THEN 'Polygon' ELSE 'Other'
    END, CAST(amount AS DOUBLE) / 1e6
  FROM circle_cctp_v1_base.tokenmessenger_evt_depositforburn
  WHERE evt_block_time >= NOW() - INTERVAL '30' DAY

  UNION ALL
  SELECT 'Optimism', CASE CAST(destinationDomain AS INTEGER)
      WHEN 0 THEN 'Ethereum' WHEN 1 THEN 'Avalanche' WHEN 2 THEN 'Optimism'
      WHEN 3 THEN 'Arbitrum'  WHEN 6 THEN 'Base'      WHEN 7 THEN 'Polygon' ELSE 'Other'
    END, CAST(amount AS DOUBLE) / 1e6
  FROM circle_cctp_v1_optimism.tokenmessenger_evt_depositforburn
  WHERE evt_block_time >= NOW() - INTERVAL '30' DAY

  UNION ALL
  SELECT 'Polygon', CASE CAST(destinationDomain AS INTEGER)
      WHEN 0 THEN 'Ethereum' WHEN 1 THEN 'Avalanche' WHEN 2 THEN 'Optimism'
      WHEN 3 THEN 'Arbitrum'  WHEN 6 THEN 'Base'      WHEN 7 THEN 'Polygon' ELSE 'Other'
    END, CAST(amount AS DOUBLE) / 1e6
  FROM circle_cctp_v1_polygon.tokenmessenger_evt_depositforburn
  WHERE evt_block_time >= NOW() - INTERVAL '30' DAY

  UNION ALL
  SELECT 'Avalanche', CASE CAST(destinationDomain AS INTEGER)
      WHEN 0 THEN 'Ethereum' WHEN 1 THEN 'Avalanche' WHEN 2 THEN 'Optimism'
      WHEN 3 THEN 'Arbitrum'  WHEN 6 THEN 'Base'      WHEN 7 THEN 'Polygon' ELSE 'Other'
    END, CAST(amount AS DOUBLE) / 1e6
  FROM circle_cctp_v1_avalanche_c.tokenmessenger_evt_depositforburn
  WHERE evt_block_time >= NOW() - INTERVAL '30' DAY
)
SELECT source_chain, dest_chain,
  COUNT(*) AS tx_count,
  SUM(usdc_amount) AS total_volume_usd,
  AVG(usdc_amount) AS avg_transfer_usd
FROM transfers
WHERE source_chain != dest_chain AND dest_chain != 'Other'
GROUP BY 1, 2
ORDER BY total_volume_usd DESC
`;

export async function GET() {
  try {
    const rows = await duneQuery(SQL);
    return NextResponse.json({ data: rows, source: "dune" });
  } catch (e) {
    console.error("Dune corridors failed, using demo data:", e);
    return NextResponse.json({ data: DEMO_CORRIDORS, source: "demo" });
  }
}
