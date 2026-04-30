import Link from "next/link";
import ArchitectureExplorer from "@/components/education/ArchitectureExplorer";
import ModuleCards from "@/components/education/ModuleCards";
import RadfordPositioning from "@/components/education/RadfordPositioning";

export const metadata = {
  title: { absolute: "Job Architecture Toolkit" },
  description:
    "A practical job architecture education and directional leveling tool for managers, HRBPs, and Total Rewards leaders.",
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
            Use the 3-minute directional leveling wizard.
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
            Walk managers through architecture, tracks, and calibration.
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
            Review realistic boundary cases with discussion prompts.
          </p>
        </Link>
      </section>

      <div className="mt-16">
        <ModuleCards />
      </div>

      <div className="mt-16">
        <RadfordPositioning />
      </div>
    </main>
  );
}
