import Link from "next/link";
import ArchitectureExplorer from "@/components/education/ArchitectureExplorer";
import RadfordPositioning from "@/components/education/RadfordPositioning";
import HomePathSection from "@/components/home/HomePathSection";
import { modules } from "@/data/modules";

import type { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "Free directional leveling tool and education for HRBPs, managers, and Total Rewards leaders. Built by Armi Noorata.",
};

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16">
      <ArchitectureExplorer />

      <section className="mt-12 grid gap-4 md:grid-cols-3" aria-label="Primary actions">
        <Link
          href="/leveling"
          className="rounded-[var(--radius-card)] border p-5 transition-colors"
          style={{
            borderColor: "var(--accent)",
            background: "var(--accent-soft)",
            color: "var(--text)",
          }}
        >
          <p className="text-sm font-semibold">Classify a role</p>
          <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
            Run the wizard. Three minutes. Six dimensions. A directional answer plus the things worth checking.
          </p>
        </Link>
        <Link
          href="/learn"
          className="rounded-[var(--radius-card)] border p-5 transition-colors"
          style={{
            borderColor: "var(--line)",
            background: "var(--surface)",
            color: "var(--text)",
          }}
        >
          <p className="text-sm font-semibold">Teach the model</p>
          <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
            Five short modules for managers, HRBPs, and TR partners. Read one before your next leveling conversation.
          </p>
        </Link>
        <Link
          href="/calibration"
          className="rounded-[var(--radius-card)] border p-5 transition-colors"
          style={{
            borderColor: "var(--line)",
            background: "var(--surface)",
            color: "var(--text)",
          }}
        >
          <p className="text-sm font-semibold">Practice calibration</p>
          <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
            Four real boundary cases. Predict the level, then see what evidence actually mattered.
          </p>
        </Link>
      </section>

      <section className="mt-16" aria-labelledby="home-path-title">
        <h2 id="home-path-title" className="sr-only">
          Pick a starting point
        </h2>
        <p
          className="mb-4 max-w-3xl text-sm leading-6"
          style={{ color: "var(--muted)" }}
        >
          Pick the role that fits and the module grid will lead with what
          you&apos;ll need first.
        </p>
        <HomePathSection modules={modules} />
      </section>

      <div className="mt-16">
        <RadfordPositioning />
      </div>
    </main>
  );
}
