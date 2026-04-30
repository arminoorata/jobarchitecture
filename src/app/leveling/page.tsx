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
      <LevelingWizard />
    </main>
  );
}
