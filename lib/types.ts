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
