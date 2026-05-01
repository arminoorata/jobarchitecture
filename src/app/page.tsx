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
          href="/learn"
          className="rounded-[var(--radius-card)] border p-5 transition-colors"
          style={{
            borderColor: "var(--accent)",
            background: "var(--accent-soft)",
            color: "var(--text)",
          }}
        >
          <p className="text-sm font-semibold">Start with the model</p>
          <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
            Five short modules for busy managers, HRBPs, and TR partners. Pick the task you showed up to do and the modules reorder around it.
          </p>
        </Link>
        <Link
          href="/leveling"
          className="rounded-[var(--radius-card)] border p-5 transition-colors"
          style={{
            borderColor: "var(--line)",
            background: "var(--surface)",
            color: "var(--text)",
          }}
        >
          <p className="text-sm font-semibold">Try the leveling wizard</p>
          <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
            Three minutes, six dimensions, a directional read with coaching. Use it to sharpen the leveling conversation you&apos;re about to have.
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
            Four real boundary cases. Pick the band you would defend, then see what evidence actually mattered and what changes the call.
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
          Pick the task that fits and the module grid will lead with what
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
