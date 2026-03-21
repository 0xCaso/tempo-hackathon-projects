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
