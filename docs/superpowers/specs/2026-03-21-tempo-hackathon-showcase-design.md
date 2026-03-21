# Design Spec: Tempo MPP Hackathon Showcase

**Date:** 2026-03-21  
**Status:** Approved by user

---

## Overview

A static showcase website listing all hackathon project submissions from the Tempo MPP Hackathon Telegram group chat. The site fetches live enrichment data from the GitHub API at build time (SSG with ISR), presenting each project in a clean card grid inspired by the visual design language of [tempo.xyz](https://tempo.xyz/).

---

## Goals

- Surface all ~30 hackathon submissions in one discoverable place
- Show rich per-project metadata: name, description, author/org, stars, language, live demo link
- Allow filtering by project category
- Match Tempo's aesthetic: minimal, editorial, light warm-gray background, monospace accents

---

## Data Source & Enrichment

### Static project list (`data/projects.ts`)

A TypeScript array is the authoritative source of project identity. Each entry contains:

```ts
type ProjectDefinition = {
  name: string;           // Human-readable project name (from chat)
  description: string;    // Curated one-liner from the chat submission
  githubUrl: string;      // e.g. "https://github.com/fgimenez/anthill"
  demoUrl?: string;       // Optional live demo link
  category: Category;
}
```

### Build-time GitHub enrichment (`lib/github.ts`)

At `next build`, for each project the site fetches from the GitHub REST API (`/repos/{owner}/{repo}`):

- `owner.login` + `owner.avatar_url`
- `stargazers_count`
- `language`
- `topics`
- `updated_at`
- `description` (used as fallback if our curated description is empty)

**Auth:** No token required for 30 repos (unauthenticated = 60 req/hr). An optional `GITHUB_TOKEN` env var raises this to 5,000 req/hr.

**Revalidation:** ISR with `revalidate = 3600` (1 hour) so data stays fresh without manual rebuilds.

### Merged type (`lib/types.ts`)

```ts
type Project = ProjectDefinition & {
  owner: { login: string; avatarUrl: string };
  stars: number;
  language: string | null;
  topics: string[];
  updatedAt: string;
}
```

---

## Categories

Each project is manually assigned one category based on its chat submission:

| Category | Slug | Example projects |
|---|---|---|
| Payment Infrastructure | `payment` | mppx-stableyard, mppx-proxy, mpp-gateway, PMPP, clkd-mppx |
| AI Agent Tools | `ai-agents` | agent-skills, BotPolice, monitor, SpendOS, bookfold, agent-escrow |
| DeFi / Trading | `defi` | bgw-tempo-hackathon, DEX-Oracle, solver-as-a-service, anthill |
| Security / Privacy | `security` | sardis-guard-mpp, spire (Agent Bank), mpp-zama, zk-proof-service |
| Developer Tools | `devtools` | Dossier, agent-findable, github-mpp-proxy, temper-tempo, dynamic-pricing |
| Applications | `apps` | clocky, human402, TemPetals, wog-mmorpg, mikuu, AgentAds, oboee, px, mpprouter |

---

## Project List

All confirmed hackathon submissions (filtered from the Telegram export, excluding Tempo ecosystem repos and referenced tools):

| Name | GitHub | Demo | Category |
|---|---|---|---|
| Anthill | fgimenez/anthill | — | ai-agents |
| Agent Bank (Spire) | suverenum/spire | goldhord.xyz | security |
| tempo-x402 | compusophy/tempo-x402 | — | payment |
| TemPetals | cryptofelon/TemPetals | — | apps |
| GitHub MPP Proxy | aLjTap/github-mpp-proxy | github.tempflow.xyz | devtools |
| Dossier | kphed/tempo-hackathon | — | devtools |
| UnstoppableMPP | Gajesh2007/UnstoppableMPP | unstoppable-mpp.vercel.app | payment |
| AgentNet | (no standalone repo — omit GitHub link, use demo only) | agentnet-7xb.pages.dev | ai-agents |
| Sardis Guard | EfeDurmaz16/sardis-guard-mpp | sardis-guard-482463483786.us-central1.run.app | security |
| mppx-stableyard | stableyardfi/mppx-stableyard | — | payment |
| AgentFindable | arome3/agent-findable | lucid-nature-production.up.railway.app | devtools |
| mppx-proxy | starc007/mppx-proxy | — | payment |
| human402 | joohhnnn/human402 | human402.com | apps |
| Bitget Wallet × MPP | hackathon-bitget-wallet/bgw-tempo-hackathon | — | defi |
| mpp-gateway | 0xinit/mpp-gateway | mpp-gateway.vercel.app | payment |
| Payload Exchange (px) | microchipgnu/px | payload-exchange.fly.dev | apps |
| Clocky | builders-garden/clocky | — | apps |
| Agent Skills | Lor3mipsvm/agent-skills | — | ai-agents |
| ZK Proof Service | Himess/zk-proof-service | himess-zk-proof-service.hf.space | security |
| MPP Dynamic Pricing | trionlabs/tempo-mpp-dynamic-pricing | mpp-dynamic-pricing.0x471.workers.dev | devtools |
| mppx-colossus | 0xRampey/mppx | mppx-testnet.up.railway.app | payment |
| tempohack | Keeeeeeeks/tempohack | — | apps |
| PMPP | UsmannK/PMPP | — | security |
| BotPolice | Lor3mipsvm/BotPolice | — | ai-agents |
| mikuu | mateojkk/mikuu | mikuu.vercel.app | apps |
| monitor | wschwab/monitor | — | ai-agents |
| agent-escrow | AdamBeaudoin/agent-escrow | — | ai-agents |
| mpp-zama | enitrat/mpp-zama | — | security |
| World of Geneva | DasilvaKareem/wog-mmorpg | worldofgeneva.com | apps |
| bookfold | avichalp/bookfold | — | ai-agents |
| SpendOS | alvesjtiago/spendos | spendos-tempo.vercel.app | ai-agents |
| AgentAds | yash-atreya/AgentAds | agentads.xyz | apps |
| clkd-mppx | cloakedxyz/clkd-mppx | — | payment |
| MPP Router | richtan/mpprouter | mpprouter.com | apps |
| Temper Tempo | EnsoBuild/temper-tempo-mpp | — | devtools |
| Sardis Company Builder | EfeDurmaz16/sardis-company-builder | — | ai-agents |
| Solver as a Service | evchip/tempo_mpp_hackathon_solver_as_a_service | solverasaservice-production.up.railway.app | defi |
| DEX Oracle | scab24/DEX-Oracle | — | defi |
| Agent Credit Protocol | Fbartoli/tempo-hack | precious-prosperity-production-2f7f.up.railway.app | defi |
| oboee | t3nsed/oboee | oboe.sh | apps |
| Helix | adrianhihi/helix-tempo | helix-tempo.pages.dev | devtools |

---

## Architecture

### Stack

- **Next.js 15** (App Router, SSG + ISR)
- **shadcn/ui** (Card, Badge, Button)
- **Tailwind CSS v4**
- **TypeScript**

### File Structure

```
tempo-hackathon-projects/
├── app/
│   ├── layout.tsx          # Root layout, fonts, global styles
│   ├── page.tsx            # SSG page — fetches enriched data at build time
│   └── globals.css         # Tailwind + Tempo design tokens
├── components/
│   ├── project-card.tsx    # Card: avatar, name, desc, stars, language, links
│   ├── project-grid.tsx    # Client component: manages filter state, renders grid
│   └── category-filter.tsx # Filter button row
├── data/
│   └── projects.ts         # Static project definitions (source of truth)
├── lib/
│   ├── github.ts           # GitHub REST API fetcher (build-time)
│   └── types.ts            # Shared TypeScript types
├── next.config.ts
├── package.json
└── tsconfig.json
```

### Data flow

```
data/projects.ts (static)
        │
        ▼
lib/github.ts (fetch at build time via GitHub API)
        │
        ▼
app/page.tsx (SSG — merges static + API data, passes to grid)
        │
        ▼
components/project-grid.tsx (client — filter state)
        │
        ├─▶ components/category-filter.tsx (filter buttons)
        └─▶ components/project-card.tsx × N (one per project)
```

---

## Visual Design (Tempo-inspired)

### Palette

| Token | Value | Usage |
|---|---|---|
| Background | `#f5f5f0` | Page background (warm off-white) |
| Surface | `#ffffff` | Card background |
| Border | `#e5e5e0` | Card borders, dividers |
| Text primary | `#0a0a0a` | Headings, names |
| Text secondary | `#6b6b6b` | Descriptions, meta |
| Accent | `#0a0a0a` | Active filter, buttons |

### Typography

- **Headlines:** Tempo's brand font `Pilat` is a commercial typeface not available in this project. Use `Inter` (Google Fonts) as the primary, `system-ui` as fallback — visually similar clean sans-serif.
- **Body / UI:** `IBM Plex Mono` (Tempo uses this for code/meta) for stats and category tags
- **Descriptions:** system sans-serif, secondary color

### Layout

- Full-width page, max-content-width `1280px`, `px-6` gutters
- Hero header: sparse, left-aligned title + subtitle + project count
- Filter row: inline badges, active state = filled black
- Card grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, `gap-px` with `bg-border` (editorial grid lines, like tempo.xyz's grid sections)
- Cards: flat white, no shadows, `1px` border, hover lifts border to darker gray
- Stats row at card bottom: star count + language in monospace, small

### Card anatomy

```
┌─────────────────────────────┐
│ [avatar 32px]  owner/repo   │  ← monospace, muted
│                             │
│ Project Name                │  ← bold, larger
│                             │
│ Short description text      │  ← body, muted, 2-line clamp
│                             │
│ [tag]          ★ 42  Rust   │  ← category badge + stats
│                             │
│ [GitHub ↗]  [Demo ↗]        │  ← text links with arrow
└─────────────────────────────┘
```

---

## Error Handling

- If GitHub API fetch fails for a repo, the project still renders using the static data (graceful degradation)
- Missing `demoUrl`: simply omit the demo link — do not show a broken/empty button
- Missing `language` or `stars`: omit those fields from the stats row

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GITHUB_TOKEN` | No | PAT to raise API rate limit from 60 to 5,000 req/hr |

---

## Out of Scope

- Authentication / user accounts
- Search / full-text filtering (categories are sufficient)
- Project submission form
- Dark mode
- Internationalisation
