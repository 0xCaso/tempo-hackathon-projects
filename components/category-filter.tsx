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
            ? "bg-[var(--tempo-accent)] text-white border-[var(--tempo-accent)]"
            : "bg-transparent text-[var(--tempo-text-secondary)] border-[var(--tempo-border)] hover:border-[var(--tempo-border-hover)]"
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
              ? "bg-[var(--tempo-accent)] text-white border-[var(--tempo-accent)]"
              : "bg-transparent text-[var(--tempo-text-secondary)] border-[var(--tempo-border)] hover:border-[var(--tempo-border-hover)]"
          }`}
        >
          {CATEGORY_LABELS[cat]} ({counts[cat]})
        </button>
      ))}
    </div>
  );
}
