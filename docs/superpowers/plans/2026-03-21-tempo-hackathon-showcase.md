# Tempo MPP Hackathon Showcase — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static Next.js 15 website that lists all ~40 Tempo MPP Hackathon project submissions in a Tempo-inspired card grid with category filtering and live GitHub metadata fetched at build time.

**Architecture:** Single Next.js 15 App Router page rendered as SSG (ISR revalidate=3600). A static `data/projects.ts` array is the authoritative source of project identity; `lib/github.ts` enriches each entry at build time via the GitHub REST API. The page passes merged data to a client component (`ProjectGrid`) that owns filter state and renders `ProjectCard` components.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, shadcn/ui (Card, Badge, Button), GitHub REST API (unauthenticated or via `GITHUB_TOKEN` env var), Inter (Google Fonts).

**Design reference:** [tempo.xyz](https://tempo.xyz) — warm off-white `#f5f5f0` background, flat white cards, 1px borders, IBM Plex Mono for meta/stats, editorial sparse layout, no drop shadows.

---

## File Map

| Path | Responsibility |
|---|---|
| `app/layout.tsx` | Root layout — Inter + IBM Plex Mono fonts, global meta, bg color |
| `app/globals.css` | Tailwind base, Tempo design tokens as CSS variables |
| `app/page.tsx` | SSG page — calls `fetchAllProjects()`, passes data to `<ProjectGrid>` |
| `lib/types.ts` | Shared TypeScript types (`ProjectDefinition`, `Project`, `Category`) |
| `data/projects.ts` | Static array of all ~40 hackathon submissions |
| `lib/github.ts` | `fetchGitHubMeta(owner, repo)` — GitHub REST API fetcher with error handling |
| `lib/fetch-projects.ts` | `fetchAllProjects()` — merges static definitions with GitHub metadata |
| `components/project-card.tsx` | Card UI: avatar, owner, name, description, category badge, stars, language, links |
| `components/category-filter.tsx` | Filter button row — receives `categories`, `active`, `onSelect` props |
| `components/project-grid.tsx` | Client component — owns `activeCategory` state, renders filter + grid |
| `.env.local.example` | Documents `GITHUB_TOKEN` optional env var |
| `next.config.ts` | ISR revalidate, image domains for GitHub avatars |

---

## Task 1: Scaffold the Next.js 15 project

**Files:**
- Create: `tempo-hackathon-projects/` (project root — already exists)

- [ ] **Step 1: Scaffold Next.js 15 with Tailwind + TypeScript**

Run from `/Users/matteocasonato/Desktop/GitHub`:
```bash
npx create-next-app@latest tempo-hackathon-projects \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*" \
  --yes
```
When prompted to use Turbopack, choose yes (or pass `--turbopack`).
Expected: project scaffold created, `npm run dev` starts on port 3000.

- [ ] **Step 2: Install shadcn/ui**

```bash
cd tempo-hackathon-projects
npx shadcn@latest init -d
```
Choose: New York style, neutral base color, no CSS variables prompt (we'll override).

- [ ] **Step 3: Add required shadcn components**

```bash
npx shadcn@latest add card badge button
```

- [ ] **Step 4: Verify dev server starts**

```bash
npm run dev
```
Expected: Next.js starts without errors on http://localhost:3000.

- [ ] **Step 5: Commit scaffold**

```bash
git init
git add .
git commit -m "chore: scaffold Next.js 15 project with shadcn/ui"
```

---

## Task 2: Define types and design tokens

**Files:**
- Create: `lib/types.ts`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Write `lib/types.ts`**

```typescript
// lib/types.ts

export type Category =
  | "payment"
  | "ai-agents"
  | "defi"
  | "security"
  | "devtools"
  | "apps";

export const CATEGORY_LABELS: Record<Category, string> = {
  payment: "Payment Infrastructure",
  "ai-agents": "AI Agent Tools",
  defi: "DeFi / Trading",
  security: "Security / Privacy",
  devtools: "Developer Tools",
  apps: "Applications",
};

export type ProjectDefinition = {
  name: string;
  description: string;
  githubUrl: string | null; // null = no standalone repo
  demoUrl?: string;
  category: Category;
};

export type GitHubMeta = {
  owner: string;
  ownerAvatarUrl: string;
  repoName: string;
  stars: number;
  language: string | null;
  topics: string[];
  updatedAt: string;
  fallbackDescription: string | null;
};

export type Project = ProjectDefinition & {
  id: string; // slugified name
  github: GitHubMeta | null; // null if no repo or fetch failed
};
```

- [ ] **Step 2: Update `app/globals.css` with Tempo design tokens**

Replace the default Tailwind globals with:
```css
@import "tailwindcss";

:root {
  --color-bg: #f5f5f0;
  --color-surface: #ffffff;
  --color-border: #e5e5e0;
  --color-border-hover: #c5c5c0;
  --color-text-primary: #0a0a0a;
  --color-text-secondary: #6b6b6b;
  --color-text-muted: #9b9b9b;
  --color-accent: #0a0a0a;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text-primary);
}
```

- [ ] **Step 3: Update `app/layout.tsx` with fonts and meta**

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Tempo MPP Hackathon — Projects",
  description:
    "All projects submitted to the Tempo Machine Payments Protocol hackathon.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${ibmPlexMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add lib/types.ts app/globals.css app/layout.tsx
git commit -m "feat: add types and Tempo design tokens"
```

---

## Task 3: Add the static project data

**Files:**
- Create: `data/projects.ts`

- [ ] **Step 1: Write `data/projects.ts`**

Create the file with all ~40 hackathon submissions. Use the project list from the design spec. Key points:
- `githubUrl` is the full `https://github.com/owner/repo` URL, or `null` for projects without a standalone repo
- `description` is a concise one-liner curated from the chat submission
- `demoUrl` is the live URL when present (without trailing slash)

```typescript
import type { ProjectDefinition } from "@/lib/types";

export const projects: ProjectDefinition[] = [
  {
    name: "Anthill",
    description:
      "Conway's Game of Life meets Monopoly — AI agents make real economic decisions with on-chain payments via Tempo.",
    githubUrl: "https://github.com/fgimenez/anthill",
    category: "ai-agents", // deliberate: AI agent simulation, not DeFi
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
    name: "tempohack",
    description:
      "Hackathon project exploring MPP payment flows on Tempo.",
    githubUrl: "https://github.com/Keeeeeeeks/tempohack",
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
];
```

- [ ] **Step 2: Commit**

```bash
git add data/projects.ts
git commit -m "feat: add static project definitions for all hackathon submissions"
```

---

## Task 4: GitHub API fetcher

**Files:**
- Create: `lib/github.ts`
- Create: `lib/fetch-projects.ts`
- Create: `.env.local.example`

- [ ] **Step 1: Write `lib/github.ts`**

```typescript
// lib/github.ts
import type { GitHubMeta } from "./types";

const GITHUB_API = "https://api.github.com";

function parseOwnerRepo(githubUrl: string): { owner: string; repo: string } | null {
  try {
    const url = new URL(githubUrl);
    const parts = url.pathname.replace(/^\//, "").split("/");
    if (parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1] };
  } catch {
    return null;
  }
}

export async function fetchGitHubMeta(githubUrl: string): Promise<GitHubMeta | null> {
  const parsed = parseOwnerRepo(githubUrl);
  if (!parsed) return null;

  const { owner, repo } = parsed;
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, {
      headers,
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`GitHub API: ${res.status} for ${owner}/${repo}`);
      return null;
    }

    const data = await res.json();

    return {
      owner: data.owner?.login ?? owner,
      ownerAvatarUrl: data.owner?.avatar_url ?? "",
      repoName: data.name ?? repo,
      stars: data.stargazers_count ?? 0,
      language: data.language ?? null,
      topics: data.topics ?? [],
      updatedAt: data.updated_at ?? "",
      fallbackDescription: data.description ?? null,
    };
  } catch (err) {
    console.warn(`GitHub fetch failed for ${owner}/${repo}:`, err);
    return null;
  }
}
```

- [ ] **Step 2: Write `lib/fetch-projects.ts`**

```typescript
// lib/fetch-projects.ts
import { projects } from "@/data/projects";
import { fetchGitHubMeta } from "./github";
import type { Project } from "./types";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function fetchAllProjects(): Promise<Project[]> {
  const results = await Promise.all(
    projects.map(async (def) => {
      const github = def.githubUrl
        ? await fetchGitHubMeta(def.githubUrl)
        : null;

      return {
        ...def,
        id: slugify(def.name),
        github,
      } satisfies Project;
    })
  );

  return results;
}
```

- [ ] **Step 3: Write `.env.local.example`**

```
# Optional: GitHub personal access token
# Without this, the GitHub API allows 60 requests/hour (enough for ~40 repos at build time).
# With a token, the limit rises to 5,000 requests/hour.
# Create one at: https://github.com/settings/tokens (no scopes needed for public repos)
GITHUB_TOKEN=
```

- [ ] **Step 4: Commit**

```bash
git add lib/github.ts lib/fetch-projects.ts .env.local.example
git commit -m "feat: add GitHub API fetcher and project data merger"
```

---

## Task 5: ProjectCard component

**Files:**
- Create: `components/project-card.tsx`

- [ ] **Step 1: Write `components/project-card.tsx`**

```tsx
// components/project-card.tsx
import Image from "next/image";
import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/types";
import type { Project } from "@/lib/types";

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const { name, description, githubUrl, demoUrl, category, github } = project;
  const ownerSlug = github?.owner ?? (githubUrl ? new URL(githubUrl).pathname.split("/")[1] : null);
  const avatarUrl = github?.ownerAvatarUrl;

  return (
    <article className="group flex flex-col bg-white border border-[var(--color-border)] p-6 gap-4 transition-colors hover:border-[var(--color-border-hover)]">
      {/* Owner row */}
      <div className="flex items-center gap-2">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={github?.owner ?? ""}
            width={24}
            height={24}
            className="rounded-full"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-[var(--color-border)]" />
        )}
        {ownerSlug && (
          <span className="font-mono text-xs text-[var(--color-text-muted)]">
            {ownerSlug}
          </span>
        )}
      </div>

      {/* Name */}
      <h2 className="text-base font-semibold text-[var(--color-text-primary)] leading-snug">
        {name}
      </h2>

      {/* Description */}
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-3 flex-1">
        {description || github?.fallbackDescription || ""}
      </p>

      {/* Category + stats */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] border border-[var(--color-border)] px-2 py-0.5">
          {CATEGORY_LABELS[category]}
        </span>
        <div className="flex items-center gap-3 font-mono text-xs text-[var(--color-text-muted)]">
          {github && github.stars > 0 && (
            <span className="flex items-center gap-1">
              <StarIcon />
              {github.stars}
            </span>
          )}
          {github?.language && (
            <span>{github.language}</span>
          )}
        </div>
      </div>

      {/* Links */}
      <div className="flex items-center gap-4 pt-1 border-t border-[var(--color-border)]">
        {githubUrl && (
          <Link
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            GitHub <ExternalLinkIcon />
          </Link>
        )}
        {demoUrl && (
          <Link
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            Live Demo <ExternalLinkIcon />
          </Link>
        )}
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/project-card.tsx
git commit -m "feat: add ProjectCard component"
```

---

## Task 6: CategoryFilter component

**Files:**
- Create: `components/category-filter.tsx`

- [ ] **Step 1: Write `components/category-filter.tsx`**

```tsx
// components/category-filter.tsx
"use client";

import { CATEGORY_LABELS } from "@/lib/types";
import type { Category } from "@/lib/types";

type Props = {
  categories: Category[];
  active: Category | null;
  counts: Record<Category, number>;
  total: number;
  onSelect: (cat: Category | null) => void;
};

export function CategoryFilter({ categories, active, counts, total, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`font-mono text-xs px-3 py-1.5 border transition-colors ${
          active === null
            ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
            : "bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-border-hover)]"
        }`}
      >
        All ({total})
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`font-mono text-xs px-3 py-1.5 border transition-colors ${
            active === cat
              ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
              : "bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-border-hover)]"
          }`}
        >
          {CATEGORY_LABELS[cat]} ({counts[cat]})
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/category-filter.tsx
git commit -m "feat: add CategoryFilter component"
```

---

## Task 7: ProjectGrid component

**Files:**
- Create: `components/project-grid.tsx`

- [ ] **Step 1: Write `components/project-grid.tsx`**

```tsx
// components/project-grid.tsx
"use client";

import { useState, useMemo } from "react";
import { CategoryFilter } from "./category-filter";
import { ProjectCard } from "./project-card";
import type { Project, Category } from "@/lib/types";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const categories = useMemo(
    () => [...new Set(projects.map((p) => p.category))] as Category[],
    [projects]
  );

  const counts = useMemo(
    () =>
      categories.reduce(
        (acc, cat) => {
          acc[cat] = projects.filter((p) => p.category === cat).length;
          return acc;
        },
        {} as Record<Category, number>
      ),
    [categories, projects]
  );

  const filtered = useMemo(
    () =>
      activeCategory
        ? projects.filter((p) => p.category === activeCategory)
        : projects,
    [projects, activeCategory]
  );

  return (
    <div className="flex flex-col gap-8">
      <CategoryFilter
        categories={categories}
        active={activeCategory}
        counts={counts}
        total={projects.length}
        onSelect={setActiveCategory}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--color-border)]">
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="font-mono text-sm text-[var(--color-text-muted)] text-center py-12">
          No projects in this category.
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/project-grid.tsx
git commit -m "feat: add ProjectGrid client component with category filtering"
```

---

## Task 8: Main page

**Files:**
- Modify: `app/page.tsx`
- Modify: `next.config.ts`

- [ ] **Step 1: Write `app/page.tsx`**

```tsx
// app/page.tsx
import { fetchAllProjects } from "@/lib/fetch-projects";
import { ProjectGrid } from "@/components/project-grid";

export const revalidate = 3600;

export default async function Home() {
  const projects = await fetchAllProjects();

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <header className="border-b border-[var(--color-border)]">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-mono text-xs text-[var(--color-text-muted)] uppercase tracking-widest">
            Tempo
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-screen-xl mx-auto px-6 pt-20 pb-12">
        <p className="font-mono text-xs text-[var(--color-text-muted)] uppercase tracking-widest mb-6">
          MPP Hackathon 2026
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[var(--color-text-primary)] max-w-2xl leading-tight mb-6">
          Projects
        </h1>
        <p className="text-base text-[var(--color-text-secondary)] max-w-lg leading-relaxed">
          {projects.length} projects built during the Tempo Machine Payments
          Protocol Hackathon — exploring AI agents, on-chain payments, and the
          future of autonomous economies.
        </p>
      </section>

      {/* Grid */}
      <section className="max-w-screen-xl mx-auto px-6 pb-24">
        <ProjectGrid projects={projects} />
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)]">
        <div className="max-w-screen-xl mx-auto px-6 py-6">
          <p className="font-mono text-xs text-[var(--color-text-muted)]">
            Built from the MPP Developers Telegram group chat export.{" "}
            <a
              href="https://tempo.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-[var(--color-text-primary)] transition-colors"
            >
              Learn more about Tempo →
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
```

- [ ] **Step 2: Update `next.config.ts` to allow GitHub avatar images**

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx next.config.ts
git commit -m "feat: add main SSG page with hero and project grid"
```

---

## Task 9: Verify build and fix any issues

**Files:** various

- [ ] **Step 1: Run the production build**

```bash
npm run build
```
Expected: Build succeeds. If GitHub API rate limit is hit, set `GITHUB_TOKEN` in `.env.local`.

- [ ] **Step 2: Spot-check the dev server**

```bash
npm run dev
```
Open http://localhost:3000. Verify:
- Page renders with warm off-white background
- Project count in hero matches `data/projects.ts` length
- Cards show owner avatars, names, descriptions, category tags
- Filter buttons work (client-side, no page reload)
- GitHub/Demo links open in new tab

- [ ] **Step 3: Fix any TypeScript or lint errors**

```bash
npm run lint
npx tsc --noEmit
```
Fix any reported issues before the final commit.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: verify build and fix any lint/type issues"
```
