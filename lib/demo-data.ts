export const DEMO_CORRIDORS = [
  { source_chain: "Ethereum", dest_chain: "Base", tx_count: 48203, total_volume_usd: 4821000000, avg_transfer_usd: 99999 },
  { source_chain: "Base", dest_chain: "Ethereum", tx_count: 41887, total_volume_usd: 3940000000, avg_transfer_usd: 94075 },
  { source_chain: "Ethereum", dest_chain: "Arbitrum", tx_count: 38124, total_volume_usd: 3120000000, avg_transfer_usd: 81836 },
  { source_chain: "Arbitrum", dest_chain: "Ethereum", tx_count: 33901, total_volume_usd: 2890000000, avg_transfer_usd: 85247 },
  { source_chain: "Ethereum", dest_chain: "Optimism", tx_count: 21043, total_volume_usd: 1840000000, avg_transfer_usd: 87435 },
  { source_chain: "Optimism", dest_chain: "Ethereum", tx_count: 18924, total_volume_usd: 1620000000, avg_transfer_usd: 85604 },
  { source_chain: "Base", dest_chain: "Arbitrum", tx_count: 14302, total_volume_usd: 1240000000, avg_transfer_usd: 86701 },
  { source_chain: "Arbitrum", dest_chain: "Base", tx_count: 12841, total_volume_usd: 1180000000, avg_transfer_usd: 91891 },
  { source_chain: "Ethereum", dest_chain: "Polygon", tx_count: 9834, total_volume_usd: 820000000, avg_transfer_usd: 83385 },
  { source_chain: "Polygon", dest_chain: "Ethereum", tx_count: 8921, total_volume_usd: 740000000, avg_transfer_usd: 82952 },
  { source_chain: "Ethereum", dest_chain: "Avalanche", tx_count: 7203, total_volume_usd: 610000000, avg_transfer_usd: 84687 },
  { source_chain: "Avalanche", dest_chain: "Ethereum", tx_count: 6518, total_volume_usd: 540000000, avg_transfer_usd: 82854 },
  { source_chain: "Base", dest_chain: "Optimism", tx_count: 5924, total_volume_usd: 490000000, avg_transfer_usd: 82716 },
  { source_chain: "Optimism", dest_chain: "Base", tx_count: 5412, total_volume_usd: 450000000, avg_transfer_usd: 83148 },
  { source_chain: "Arbitrum", dest_chain: "Optimism", tx_count: 4103, total_volume_usd: 340000000, avg_transfer_usd: 82867 },
];

export const DEMO_DAILY = (() => {
  const days: { date: string; volume: number; tx_count: number }[] = [];
  const base = new Date("2025-03-21");
  for (let i = 0; i < 30; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    const noise = 0.7 + Math.random() * 0.6;
    days.push({
      date: d.toISOString().slice(0, 10),
      volume: Math.round(700000000 * noise),
      tx_count: Math.round(8000 * noise),
    });
  }
  return days;
})();
