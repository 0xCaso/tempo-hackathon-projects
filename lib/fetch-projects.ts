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
