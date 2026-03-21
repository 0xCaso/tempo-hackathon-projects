// app/page.tsx
import { fetchAllProjects } from "@/lib/fetch-projects";
import { ProjectGrid } from "@/components/project-grid";

export const revalidate = 3600;

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default async function Home() {
  const projects = await fetchAllProjects();

  return (
    <main className="min-h-screen bg-[var(--tempo-bg)]">
      {/* Header */}
      <header className="border-b border-[var(--tempo-border)]">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
          <a
            href="https://tempo.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-[var(--tempo-text-muted)] uppercase tracking-widest hover:text-[var(--tempo-text-primary)] transition-colors cursor-pointer"
          >
            Tempo
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-screen-xl mx-auto px-6 pt-24 pb-16">
        <p className="font-mono text-xs text-[var(--tempo-text-muted)] uppercase tracking-widest mb-8">
          MPP Hackathon 2026
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[var(--tempo-text-primary)] max-w-2xl leading-tight mb-8">
          Projects
        </h1>
        <p className="text-base text-[var(--tempo-text-secondary)] max-w-lg leading-relaxed">
          {projects.length} projects built during the Tempo Machine Payments
          Protocol Hackathon — exploring AI agents, on-chain payments, and the
          future of autonomous economies.
        </p>
      </section>

      {/* Grid */}
      <section className="max-w-screen-xl mx-auto px-6 pb-32">
        <ProjectGrid projects={projects} />
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--tempo-border)]">
        <div className="max-w-screen-xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-mono text-xs text-[var(--tempo-text-muted)]">
            Built from the MPP Developers Telegram group chat export.{" "}
            <a
              href="https://tempo.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-[var(--tempo-text-primary)] transition-colors"
            >
              Learn more about Tempo →
            </a>
          </p>

          <div className="flex items-center gap-3 font-mono text-xs text-[var(--tempo-text-muted)]">
            <span>built with love by</span>
            <a
              href="https://github.com/0xCaso"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="0xCaso on GitHub"
              className="flex items-center gap-1.5 hover:text-[var(--tempo-text-primary)] transition-colors cursor-pointer"
            >
              <GitHubIcon />
              <span>0xCaso</span>
            </a>
            <a
              href="https://x.com/casoxbt"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="casoxbt on X"
              className="flex items-center gap-1 hover:text-[var(--tempo-text-primary)] transition-colors cursor-pointer"
            >
              <XIcon />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
