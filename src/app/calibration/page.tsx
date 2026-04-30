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
      <CalibrationLab />
    </main>
  );
}
