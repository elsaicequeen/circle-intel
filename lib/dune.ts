const DUNE_API_KEY = process.env.DUNE_API_KEY!;
const BASE = "https://api.dune.com/api/v1";

async function poll(executionId: string): Promise<Record<string, unknown>[]> {
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await fetch(`${BASE}/execution/${executionId}/status`, {
      headers: { "X-Dune-API-Key": DUNE_API_KEY },
      cache: "no-store",
    });
    const data = await res.json();
    if (data.state === "QUERY_STATE_COMPLETED") {
      const r = await fetch(`${BASE}/execution/${executionId}/results`, {
        headers: { "X-Dune-API-Key": DUNE_API_KEY },
        cache: "no-store",
      });
      const d = await r.json();
      return d.result?.rows ?? [];
    }
    if (data.state === "QUERY_STATE_FAILED" || data.state === "QUERY_STATE_CANCELLED") {
      throw new Error(`Dune query ${data.state}`);
    }
  }
  throw new Error("Dune query timed out after 60s");
}

export async function duneQuery(sql: string): Promise<Record<string, unknown>[]> {
  const res = await fetch(`${BASE}/query/execute`, {
    method: "POST",
    headers: {
      "X-Dune-API-Key": DUNE_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query_sql: sql, performance: "medium" }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Dune execute failed: ${res.status}`);
  const data = await res.json();
  return poll(data.execution_id);
}
