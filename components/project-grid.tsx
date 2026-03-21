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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--tempo-border)]">
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="font-mono text-sm text-[var(--tempo-text-muted)] text-center py-12">
          No projects in this category.
        </p>
      )}
    </div>
  );
}
