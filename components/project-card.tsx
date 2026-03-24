// components/project-card.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CATEGORY_LABELS } from "@/lib/types";
import type { Project } from "@/lib/types";

const TEMPO_LOGO = "https://tempo.xyz/images/logo.svg";

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const { name, description, githubUrl, demoUrl, category, github } = project;
  const ownerSlug = github?.owner ?? (githubUrl ? new URL(githubUrl).pathname.split("/")[1] : null);
  const avatarUrl = github?.ownerAvatarUrl || null;
  const [avatarError, setAvatarError] = useState(false);

  return (
    <article className="group flex flex-col bg-white p-6 gap-4 transition-colors hover:bg-[#fafaf8]">
      {/* Avatar + owner + links row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {avatarUrl && !avatarError ? (
            <Image
              src={avatarUrl}
              alt={github?.owner ?? ""}
              width={20}
              height={20}
              className="rounded-full flex-shrink-0"
              onError={() => setAvatarError(true)}
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={TEMPO_LOGO}
              alt="Tempo"
              width={20}
              height={20}
              className="opacity-35 flex-shrink-0"
            />
          )}
          {ownerSlug && (
            <span className="font-mono text-xs text-[var(--tempo-text-muted)] truncate">
              {ownerSlug}
            </span>
          )}
        </div>

        {/* Link icons — top-right */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {githubUrl && (
            <Link
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
              className="text-[var(--tempo-text-muted)] hover:text-[var(--tempo-text-primary)] transition-colors cursor-pointer"
            >
              <GitHubIcon />
            </Link>
          )}
          {demoUrl && (
            <Link
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View live demo"
              className="text-[var(--tempo-text-muted)] hover:text-[var(--tempo-text-primary)] transition-colors cursor-pointer"
            >
              <GlobeIcon />
            </Link>
          )}
        </div>
      </div>

      {/* Name */}
      <h2 className="text-sm font-semibold text-[var(--tempo-text-primary)] leading-snug">
        {name}
      </h2>

      {/* Description */}
      <p className="text-sm text-[var(--tempo-text-secondary)] leading-relaxed line-clamp-3 flex-1">
        {description || github?.fallbackDescription || ""}
      </p>

      {/* Category + stats */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-[var(--tempo-border)]">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--tempo-text-muted)]">
          {CATEGORY_LABELS[category]}
        </span>
        <div className="flex items-center gap-3 font-mono text-[11px] text-[var(--tempo-text-muted)]">
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
    </article>
  );
}
