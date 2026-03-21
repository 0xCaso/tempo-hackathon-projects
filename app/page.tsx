// app/page.tsx
import { fetchAllProjects } from "@/lib/fetch-projects";
import { ProjectGrid } from "@/components/project-grid";

export const revalidate = 3600;

export default async function Home() {
  const projects = await fetchAllProjects();

  return (
    <main className="min-h-screen bg-[var(--tempo-bg)]">
      {/* Header */}
      <header className="border-b border-[var(--tempo-border)]">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-mono text-xs text-[var(--tempo-text-muted)] uppercase tracking-widest">
            Tempo
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-screen-xl mx-auto px-6 pt-20 pb-12">
        <p className="font-mono text-xs text-[var(--tempo-text-muted)] uppercase tracking-widest mb-6">
          MPP Hackathon 2026
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[var(--tempo-text-primary)] max-w-2xl leading-tight mb-6">
          Projects
        </h1>
        <p className="text-base text-[var(--tempo-text-secondary)] max-w-lg leading-relaxed">
          {projects.length} projects built during the Tempo Machine Payments
          Protocol Hackathon — exploring AI agents, on-chain payments, and the
          future of autonomous economies.
        </p>
      </section>

      {/* Grid */}
      <section className="max-w-screen-xl mx-auto px-6 pb-24">
        <ProjectGrid projects={projects} />
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--tempo-border)]">
        <div className="max-w-screen-xl mx-auto px-6 py-6">
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
        </div>
      </footer>
    </main>
  );
}
