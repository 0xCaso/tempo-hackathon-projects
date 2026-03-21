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
    <article className="group flex flex-col bg-white p-6 gap-4 transition-colors hover:bg-[#fafaf8]">
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
          <div className="w-6 h-6 rounded-full bg-[var(--tempo-border)]" />
        )}
        {ownerSlug && (
          <span className="font-mono text-xs text-[var(--tempo-text-muted)]">
            {ownerSlug}
          </span>
        )}
      </div>

      {/* Name */}
      <h2 className="text-base font-semibold text-[var(--tempo-text-primary)] leading-snug">
        {name}
      </h2>

      {/* Description */}
      <p className="text-sm text-[var(--tempo-text-secondary)] leading-relaxed line-clamp-3 flex-1">
        {description || github?.fallbackDescription || ""}
      </p>

      {/* Category + stats */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--tempo-text-muted)] border border-[var(--tempo-border)] px-2 py-0.5">
          {CATEGORY_LABELS[category]}
        </span>
        <div className="flex items-center gap-3 font-mono text-xs text-[var(--tempo-text-muted)]">
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
      <div className="flex items-center gap-4 pt-1 border-t border-[var(--tempo-border)]">
        {githubUrl && (
          <Link
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-xs text-[var(--tempo-text-secondary)] hover:text-[var(--tempo-text-primary)] transition-colors"
          >
            GitHub <ExternalLinkIcon />
          </Link>
        )}
        {demoUrl && (
          <Link
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-xs text-[var(--tempo-text-secondary)] hover:text-[var(--tempo-text-primary)] transition-colors"
          >
            Live Demo <ExternalLinkIcon />
          </Link>
        )}
      </div>
    </article>
  );
}
