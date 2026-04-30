import LevelingWizard from "@/components/leveling/LevelingWizard";

export const metadata = {
  title: "Leveling Tool",
  description:
    "A client-side directional job level classification wizard for HRBPs and managers.",
};

export default function LevelingPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
      <LevelingWizard />
    </main>
  );
}
