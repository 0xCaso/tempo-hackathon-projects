import type { ProjectDefinition } from "@/lib/types";

export const projects: ProjectDefinition[] = [
  {
    name: "Anthill",
    description:
      "Conway's Game of Life meets Monopoly — AI agents make real economic decisions with on-chain payments via Tempo.",
    githubUrl: "https://github.com/fgimenez/anthill",
    category: "ai-agents",
  },
  {
    name: "Agent Bank (Spire)",
    description:
      "Guardian smart contracts that enforce per-tx caps, daily limits, and vendor allowlists on AI agent wallets.",
    githubUrl: "https://github.com/suverenum/spire",
    demoUrl: "https://goldhord.xyz",
    category: "security",
  },
  {
    name: "tempo-x402",
    description:
      "Self-replicating virtual machines that orchestrate over Tempo using the x402 payment protocol.",
    githubUrl: "https://github.com/compusophy/tempo-x402",
    category: "payment",
  },
  {
    name: "TemPetals",
    description:
      "An MPP server that lets AI agents order flower deliveries — pay-per-request via Tempo.",
    githubUrl: "https://github.com/cryptofelon/TemPetals",
    category: "apps",
  },
  {
    name: "GitHub MPP Proxy",
    description:
      "The GitHub REST API as an MPP service — any agent with a Tempo wallet can query GitHub without managing API keys.",
    githubUrl: "https://github.com/aLjTap/github-mpp-proxy",
    demoUrl: "https://github.tempflow.xyz",
    category: "devtools",
  },
  {
    name: "Dossier",
    description:
      "Paid deep research over MPP — charges $0.01/query, runs grounded Gemini research, returns structured dossiers with citations.",
    githubUrl: "https://github.com/kphed/tempo-hackathon",
    category: "devtools",
  },
  {
    name: "UnstoppableMPP",
    description:
      "Unstoppable API marketplace — put your API key and sell at a discount or markup based on the market.",
    githubUrl: "https://github.com/Gajesh2007/UnstoppableMPP",
    demoUrl: "https://unstoppable-mpp.vercel.app",
    category: "payment",
  },
  {
    name: "AgentNet",
    description:
      "A social network where AI agents post, reply, like, and tip each other with USDC micropayments via MPP.",
    githubUrl: null,
    demoUrl: "https://agentnet-7xb.pages.dev",
    category: "ai-agents",
  },
  {
    name: "Sardis Guard",
    description:
      "Reputation and risk intelligence layer — a 9-gate ML pipeline that scores every MPP agent payment 0–1.",
    githubUrl: "https://github.com/EfeDurmaz16/sardis-guard-mpp",
    demoUrl: "https://sardis-guard-482463483786.us-central1.run.app",
    category: "security",
  },
  {
    name: "mppx-stableyard",
    description:
      "Third payment method for MPP — agents pay from 7 EVM chains + Solana + Movement, merchants settle on any chain.",
    githubUrl: "https://github.com/stableyardfi/mppx-stableyard",
    category: "payment",
  },
  {
    name: "AgentFindable",
    description:
      "Pay-per-request API that audits any website across 12 categories and scores its AI-agent findability and citability.",
    githubUrl: "https://github.com/arome3/agent-findable",
    demoUrl: "https://lucid-nature-production.up.railway.app",
    category: "devtools",
  },
  {
    name: "mppx-proxy",
    description:
      "Reverse proxy that puts any HTTP API behind Solana micropayments — no accounts, no rate limits, just pay per call.",
    githubUrl: "https://github.com/starc007/mppx-proxy",
    category: "payment",
  },
  {
    name: "human402",
    description:
      "The first human-in-the-loop task marketplace on MPP — AI agents pay USDC to hire humans for tasks.",
    githubUrl: "https://github.com/joohhnnn/human402",
    demoUrl: "https://human402.com",
    category: "apps",
  },
  {
    name: "Bitget Wallet × MPP",
    description:
      "The first autonomous agent trading loop on MPP — discover, pay, execute DeFi operations, and settle on-chain.",
    githubUrl: "https://github.com/hackathon-bitget-wallet/bgw-tempo-hackathon",
    category: "defi",
  },
  {
    name: "mpp-gateway",
    description:
      "Open-source API gateway that brings 43 non-MPP services (Stripe, Twilio, Plaid, GitHub…) into the MPP ecosystem.",
    githubUrl: "https://github.com/0xinit/mpp-gateway",
    demoUrl: "https://mpp-gateway.vercel.app",
    category: "payment",
  },
  {
    name: "Payload Exchange (px)",
    description:
      "Orderbook for agent intents — buyers post tasks, solvers compete, attestation verifies, MPP settles on Tempo.",
    githubUrl: "https://github.com/microchipgnu/px",
    demoUrl: "https://payload-exchange.fly.dev",
    category: "apps",
  },
  {
    name: "Clocky",
    description:
      "Pay friends and talk to AI over iMessage, powered by MPP and Tempo — Venice AI wrapped behind an MPP service.",
    githubUrl: "https://github.com/builders-garden/clocky",
    category: "apps",
  },
  {
    name: "Agent Skills",
    description:
      "Corrects common LLM misconceptions about the Tempo SDK before they hit your code — install with one command.",
    githubUrl: "https://github.com/Lor3mipsvm/agent-skills",
    category: "ai-agents",
  },
  {
    name: "ZK Proof Service",
    description:
      "Agents pay $0.01 and get a Groth16 zero-knowledge proof in ~5 seconds — real SNARK proving, not an API wrapper.",
    githubUrl: "https://github.com/Himess/zk-proof-service",
    demoUrl: "https://himess-zk-proof-service.hf.space",
    category: "security",
  },
  {
    name: "MPP Dynamic Pricing",
    description:
      "AI inference gateway where the price adjusts in real-time based on demand — surge pricing from 1x to 10x.",
    githubUrl: "https://github.com/trionlabs/tempo-mpp-dynamic-pricing",
    demoUrl: "https://mpp-dynamic-pricing.0x471.workers.dev",
    category: "devtools",
  },
  {
    name: "mppx-colossus",
    description:
      "MPP implemented on Colossus (OP Stack L2, chain 9511) — full charge + session support with one extra config line.",
    githubUrl: "https://github.com/0xRampey/mppx",
    demoUrl: "https://mppx-testnet.up.railway.app",
    category: "payment",
  },
  {
    name: "Trenchcoat",
    description:
      "Hackathon project exploring MPP payment flows on Tempo.",
    githubUrl: "https://github.com/Keeeeeeeks/trenchcoat-mpp",
    category: "apps",
  },
  {
    name: "PMPP (Private MPP)",
    description:
      "Converts MPP session settlements into Poseidon note commitments — merchants redeem with Groth16 proofs, no identity on-chain.",
    githubUrl: "https://github.com/UsmannK/PMPP",
    category: "security",
  },
  {
    name: "BotPolice",
    description:
      "Runtime policy layer for MPP — answers 'may this agent pay this vendor?' and enforces dynamic budget limits.",
    githubUrl: "https://github.com/Lor3mipsvm/BotPolice",
    category: "ai-agents",
  },
  {
    name: "mikuu",
    description:
      "Hackathon project built on Tempo MPP.",
    githubUrl: "https://github.com/mateojkk/mikuu",
    demoUrl: "https://mikuu.vercel.app",
    category: "apps",
  },
  {
    name: "Monitor",
    description:
      "Agent swarm dispatcher and live ops dashboard — create tasks, assign budgets, watch autonomous agents execute in real time.",
    githubUrl: "https://github.com/wschwab/monitor",
    category: "ai-agents",
  },
  {
    name: "Agent Escrow",
    description:
      "Three-party escrow for AI agent tasks — requester posts bounty, worker delivers, LLM judge evaluates, auto-settles on-chain.",
    githubUrl: "https://github.com/AdamBeaudoin/agent-escrow",
    category: "ai-agents",
  },
  {
    name: "mpp-zama",
    description:
      "MPPX plugin using Zama FHE — payment amounts are encrypted on-chain, only the recipient server can decrypt and verify.",
    githubUrl: "https://github.com/enitrat/mpp-zama",
    category: "security",
  },
  {
    name: "World of Geneva",
    description:
      "RuneScape-style MMORPG with AI agents on chain — summon your hero, list them as a mercenary, and passively earn.",
    githubUrl: "https://github.com/DasilvaKareem/wog-mmorpg",
    demoUrl: "https://worldofgeneva.com",
    category: "apps",
  },
  {
    name: "bookfold",
    description:
      "Local-first CLI that summarises full books from PDFs and EPUBs via a staged OpenAI pipeline, paid through a Tempo session.",
    githubUrl: "https://github.com/avichalp/bookfold",
    category: "ai-agents",
  },
  {
    name: "SpendOS",
    description:
      "Spend governance for the autonomous economy — Ramp/Mercury for AI agents, with policies, limits, and full audit trails.",
    githubUrl: "https://github.com/alvesjtiago/spendos",
    demoUrl: "https://spendos-tempo.vercel.app",
    category: "ai-agents",
  },
  {
    name: "AgentAds",
    description:
      "Ad platform for AI coding agents — developers earn passive income by consuming relevant ads in their terminal.",
    githubUrl: "https://github.com/yash-atreya/AgentAds",
    demoUrl: "https://agentads.xyz",
    category: "apps",
  },
  {
    name: "clkd-mppx",
    description:
      "Stealth address wallet on Tempo — agents set up self-custodial wallets, receive payments to stealth addresses, and spend via MPP.",
    githubUrl: "https://github.com/cloakedxyz/clkd-mppx",
    category: "payment",
  },
  {
    name: "MPP Router",
    description:
      "Dashboard and proxy that routes agents to the cheapest MPP service provider for a given intent, handling payment automatically.",
    githubUrl: "https://github.com/richtan/mpprouter",
    demoUrl: "https://mpprouter.com",
    category: "apps",
  },
  {
    name: "Temper Tempo",
    description:
      "EVM transaction simulation API extended for Tempo chain — full call traces, gas breakdown, and shareable visual trace debugger via MPP.",
    githubUrl: "https://github.com/EnsoBuild/temper-tempo-mpp",
    category: "devtools",
  },
  {
    name: "Sardis Company Builder",
    description:
      "AI agent that autonomously starts companies — researches markets, validates ideas, and produces tech specs for ~$0.20 USDC.",
    githubUrl: "https://github.com/EfeDurmaz16/sardis-company-builder",
    demoUrl: "https://sardis-company-builder-482463483786.us-central1.run.app",
    category: "ai-agents",
  },
  {
    name: "Solver as a Service",
    description:
      "Buy Polymarket prediction market positions cross-chain — pay on Tempo, receive on Polygon, no bridging required.",
    githubUrl: "https://github.com/evchip/tempo_mpp_hackathon_solver_as_a_service",
    demoUrl: "https://solverasaservice-production.up.railway.app",
    category: "defi",
  },
  {
    name: "DEX Oracle",
    description:
      "Paid API reading Tempo's StablecoinDEX orderbook in real time — spread data, risk scoring, and swap recommendations across 15 pairs.",
    githubUrl: "https://github.com/scab24/DEX-Oracle",
    category: "defi",
  },
  {
    name: "Agent Credit Protocol",
    description:
      "Brex for AI agents — ERC4626 vault where LPs deposit USDC, agents get credit lines to call paid MPP services, LPs earn yield.",
    githubUrl: "https://github.com/Fbartoli/tempo-hack",
    demoUrl: "https://precious-prosperity-production-2f7f.up.railway.app",
    category: "defi",
  },
  {
    name: "oboee",
    description:
      "Skills marketplace where agents fund and bid on highly-specific skills that don't exist yet — like Deep Funding for AI capabilities.",
    githubUrl: "https://github.com/t3nsed/oboee",
    demoUrl: "https://oboe.sh",
    category: "apps",
  },
  {
    name: "Helix",
    description:
      "Self-healing payment infrastructure for AI agents — perceives transaction failures and auto-repairs them in seconds.",
    githubUrl: "https://github.com/adrianhihi/helix-tempo",
    demoUrl: "https://helix-tempo.pages.dev",
    category: "devtools",
  },
  {
    name: "Remlo",
    description:
      "Borderless enterprise payroll on Tempo L1 — AI agents execute compliant batch payments via HTTP 402, employees receive in 0.4s and spend via Visa card globally.",
    githubUrl: "https://github.com/winsznx/remlo",
    demoUrl: "https://remlo.xyz",
    category: "apps",
  },
];
