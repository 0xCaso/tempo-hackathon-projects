// components/project-grid.tsx
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { CategoryFilter } from "./category-filter";
import { ProjectCard } from "./project-card";
import { Input } from "@/components/ui/input";
import type { Project, Category } from "@/lib/types";

function SearchIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setDebounced(value), delay);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value, delay]);

  return debounced;
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [searchRaw, setSearchRaw] = useState("");
  const searchQuery = useDebounce(searchRaw, 200);

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
    [projects, categories]
  );

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesCategory = !activeCategory || p.category === activeCategory;
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.github?.owner ?? "").toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [projects, activeCategory, searchQuery]);

  return (
    <div className="flex flex-col gap-6">
      {/* Search + filter rows */}
      <div className="flex flex-col gap-4">
        <div className="relative w-full">
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--tempo-text-muted)]">
            <SearchIcon />
          </span>
          <Input
            type="search"
            placeholder="Search projects…"
            value={searchRaw}
            onChange={(e) => setSearchRaw(e.target.value)}
            className="pl-8 h-8 font-mono text-xs rounded-none border-[var(--tempo-border)] bg-white placeholder:text-[var(--tempo-text-muted)] focus-visible:border-[var(--tempo-text-primary)] focus-visible:ring-0"
            aria-label="Search projects"
          />
        </div>
        <CategoryFilter
          categories={categories}
          active={activeCategory}
          counts={counts}
          total={projects.length}
          onSelect={setActiveCategory}
        />
      </div>

      {/* Grid */}
      <div className="border border-[var(--tempo-border)]">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--tempo-border)]">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="font-mono text-sm text-[var(--tempo-text-muted)] text-center py-12">
            No projects found.
          </p>
        )}
      </div>
    </div>
  );
}
