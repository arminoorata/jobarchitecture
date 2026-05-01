import type { Metadata } from "next";
import CalibrationLab from "@/components/calibration/CalibrationLab";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Calibration Lab",
  description:
    "Predict-then-reveal practice on four real boundary cases: IC, manager, executive, HRBP.",
});

export default function CalibrationPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16">
      <header className="mb-8 max-w-3xl">
        <p
          className="text-xs font-medium uppercase tracking-[0.28em]"
          style={{ color: "var(--accent)" }}
        >
          Practice for the calibration room
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Real boundary cases. Predict, then compare.
        </h1>
        <p className="mt-3 leading-7" style={{ color: "var(--muted)" }}>
          Each case is the kind of role a calibration committee actually
          argues about. Read the facts, pick the band you would defend, and
          see how the strongest evidence and the watch-outs line up. The
          point is sharper judgment for the next real conversation.
        </p>
      </header>
      <CalibrationLab />
    </main>
  );
}
