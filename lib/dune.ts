const DUNE_API_KEY = process.env.DUNE_API_KEY!;
const BASE = "https://api.dune.com/api/v1";

// Saved Dune query IDs — raw-log based, no decoded table dependency
export const DUNE_QUERY_IDS = {
  cctpCorridors: 7345981,
  cctpDaily: 7345982,
};

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

/**
 * Returns the most recent cached results for a saved Dune query.
 * Falls back to triggering a fresh execution if no results exist yet.
 * This avoids the 1-2min queue wait on every request.
 */
export async function duneQueryById(queryId: number): Promise<Record<string, unknown>[]> {
  // Try cached results first (instant)
  const cached = await fetch(`${BASE}/query/${queryId}/results?limit=500`, {
    headers: { "X-Dune-API-Key": DUNE_API_KEY },
    cache: "no-store",
  });
  if (cached.ok) {
    const d = await cached.json();
    if (d.result?.rows?.length > 0) return d.result.rows;
  }

  // No cached results — trigger fresh execution and wait
  const res = await fetch(`${BASE}/query/${queryId}/execute`, {
    method: "POST",
    headers: {
      "X-Dune-API-Key": DUNE_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ performance: "medium" }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Dune execute failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return poll(data.execution_id);
}
