# Tempo MPP Hackathon — Projects

A browsable gallery of all projects submitted to the [Tempo](https://tempo.xyz) Machine Payments Protocol Hackathon. Live GitHub stats fetched at build time, category filtering, and instant search.

## Features

- 41 hackathon projects with descriptions, categories, and links
- Live GitHub metadata — stars, language, owner avatar (ISR, revalidates every hour)
- Category filtering and debounced full-text search
- Statically generated — no backend, no database

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · GitHub REST API

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Optionally, set a GitHub token to raise the API rate limit from 60 to 5,000 req/hr at build time:

```bash
cp .env.local.example .env.local
# then add your token to .env.local
```

## Adding a Project

Edit [`data/projects.ts`](./data/projects.ts) and add an entry to the array:

```ts
{
  name: "Your Project",
  description: "One-line description of what it does.",
  githubUrl: "https://github.com/owner/repo", // or null
  demoUrl: "https://yourproject.xyz",          // optional
  category: "apps",                            // see lib/types.ts for all categories
}
```

Then open a PR.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/0xCaso/tempo-hackathon-projects)

One click. Add `GITHUB_TOKEN` as an environment variable in Vercel for enriched build-time metadata.
