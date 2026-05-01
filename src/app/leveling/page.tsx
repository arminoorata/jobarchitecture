import type { Metadata } from "next";
import LevelingWizard from "@/components/leveling/LevelingWizard";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Leveling Wizard",
  description:
    "Three-minute directional leveling wizard. Six dimensions, weighted score, confidence rating, boundary detection.",
});

export default function LevelingPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
      <header className="mb-8 max-w-3xl">
        <p
          className="text-xs font-medium uppercase tracking-[0.28em]"
          style={{ color: "var(--accent)" }}
        >
          Applied learning
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Size the job. Walk away with coaching.
        </h1>
        <p className="mt-3 leading-7" style={{ color: "var(--muted)" }}>
          Six dimensions, three minutes, one directional read. The result
          explains itself, points out where the evidence is thin, and gives
          you something to take into a calibration conversation.
        </p>
      </header>
      <LevelingWizard />
    </main>
  );
}
