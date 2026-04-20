export type PartnerCategory = "Exchange" | "Wallet" | "Payments" | "DeFi" | "Infrastructure" | "Fintech" | "Gaming";

export interface Partner {
  name: string;
  category: PartnerCategory;
  description: string;
  chains?: string[];
  since?: string;
  notable?: string;
}

export const PARTNERS: Partner[] = [
  // Exchanges
  { name: "Coinbase", category: "Exchange", description: "Primary USDC issuer and largest US exchange", notable: "Co-founder of Centre Consortium", since: "2018" },
  { name: "Binance", category: "Exchange", description: "Largest global exchange by volume", chains: ["Ethereum", "BNB Chain", "Solana"], since: "2020" },
  { name: "Kraken", category: "Exchange", description: "Major US exchange with USDC support", since: "2019" },
  { name: "OKX", category: "Exchange", description: "Top-5 global exchange with native USDC markets", chains: ["Ethereum", "Arbitrum", "Base"], since: "2021" },
  { name: "Bybit", category: "Exchange", description: "Global derivatives exchange", since: "2022" },
  { name: "Crypto.com", category: "Exchange", description: "Consumer exchange with USDC debit card", since: "2020" },
  { name: "dYdX", category: "Exchange", description: "Leading decentralized perpetuals exchange, USDC-margined", chains: ["dYdX Chain"], notable: "Native USDC settlement", since: "2021" },

  // Wallets
  { name: "MetaMask", category: "Wallet", description: "Largest browser wallet — #1 USDC holder by address count", chains: ["Multi-chain"], since: "2019" },
  { name: "Phantom", category: "Wallet", description: "Leading Solana wallet, native USDC swaps", chains: ["Solana", "Ethereum", "Polygon"], since: "2021" },
  { name: "Coinbase Wallet", category: "Wallet", description: "Self-custody wallet with native Circle integration", chains: ["Multi-chain"], since: "2018" },
  { name: "Trust Wallet", category: "Wallet", description: "Binance-owned mobile wallet, 100M+ users", since: "2020" },
  { name: "Rainbow", category: "Wallet", description: "Consumer Ethereum wallet with USDC focus", chains: ["Ethereum", "Base", "Optimism"], since: "2020" },
  { name: "Ledger", category: "Wallet", description: "Hardware wallet — largest cold storage USDC custodian", since: "2019" },

  // Payments
  { name: "Stripe", category: "Payments", description: "Global payments infra — USDC payouts via Circle API", notable: "Circle partner since 2023, crypto payouts product", since: "2023" },
  { name: "Visa", category: "Payments", description: "USDC settlement on Ethereum and Solana for card programs", notable: "$2.3B+ USDC settled on-chain", since: "2021" },
  { name: "MoneyGram", category: "Payments", description: "Global remittance — USDC/fiat on-off ramp at 350K locations", notable: "Circle partnership for last-mile cash", since: "2022" },
  { name: "Checkout.com", category: "Payments", description: "Enterprise payments — USDC settlement option", since: "2023" },
  { name: "Worldpay", category: "Payments", description: "FIS subsidiary, USDC acceptance for merchants", since: "2023" },
  { name: "Mastercard", category: "Payments", description: "USDC settlement pilot on multiple networks", since: "2023" },

  // DeFi
  { name: "Uniswap", category: "DeFi", description: "Largest DEX — USDC is #1 quote asset by volume", chains: ["Ethereum", "Arbitrum", "Base", "Optimism", "Polygon"], since: "2020" },
  { name: "Aave", category: "DeFi", description: "Largest lending protocol — USDC top supplied asset ($3B+)", chains: ["Ethereum", "Arbitrum", "Base", "Polygon"], since: "2020" },
  { name: "Compound", category: "DeFi", description: "Money market protocol, USDC lending pioneer", chains: ["Ethereum"], since: "2019" },
  { name: "Curve Finance", category: "DeFi", description: "Stablecoin AMM — massive USDC/USDT/USDS liquidity pools", chains: ["Ethereum", "Arbitrum", "Base"], since: "2020" },
  { name: "GMX", category: "DeFi", description: "Perpetuals DEX, USDC as collateral and settlement", chains: ["Arbitrum", "Avalanche"], since: "2022" },
  { name: "Pendle", category: "DeFi", description: "Yield trading — USDC yield tokenization", chains: ["Ethereum", "Arbitrum"], since: "2023" },

  // Infrastructure
  { name: "Chainlink", category: "Infrastructure", description: "USDC/USD price oracle for 500+ DeFi protocols", chains: ["Multi-chain"], since: "2020" },
  { name: "Alchemy", category: "Infrastructure", description: "RPC & dev tooling — powers most USDC-integrating dApps", since: "2021" },
  { name: "Biconomy", category: "Infrastructure", description: "Account abstraction & gasless USDC transactions", chains: ["Ethereum", "Polygon", "Base"], since: "2022" },
  { name: "LayerZero", category: "Infrastructure", description: "Cross-chain messaging — USDC omnichain transfers", since: "2022" },
  { name: "Wormhole", category: "Infrastructure", description: "Cross-chain bridge with USDC as primary asset", chains: ["Multi-chain"], since: "2022" },
  { name: "Axelar", category: "Infrastructure", description: "Interoperability protocol — USDC bridging", since: "2022" },

  // Fintech
  { name: "Brex", category: "Fintech", description: "Corporate cards — USDC treasury management for startups", since: "2023" },
  { name: "Mercury", category: "Fintech", description: "Startup banking — USDC yield on idle treasury", since: "2023" },
  { name: "Deel", category: "Fintech", description: "Global payroll — USDC contractor payments in 150+ countries", notable: "Circle partner for global payroll", since: "2022" },
  { name: "Ramp", category: "Fintech", description: "Crypto on-ramp — USDC primary purchase asset, $2B+ volume", since: "2021" },
  { name: "Transak", category: "Fintech", description: "Global fiat-to-USDC on-ramp, 170+ countries", since: "2021" },
  { name: "Fireblocks", category: "Fintech", description: "Institutional custody — largest USDC custodian by AUM", notable: "$40B+ in assets under custody", since: "2020" },

  // Gaming
  { name: "Immutable", category: "Gaming", description: "Gaming L2 — USDC gas and in-game payments", chains: ["Immutable zkEVM"], since: "2023" },
  { name: "Sequence", category: "Gaming", description: "Web3 gaming wallet — USDC micropayments", chains: ["Multi-chain"], since: "2022" },
];
