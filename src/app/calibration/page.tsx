import CalibrationLab from "@/components/calibration/CalibrationLab";

export const metadata = {
  title: "Calibration Lab",
  description:
    "Interactive role scenarios and facilitation prompts for job leveling calibration.",
};

export default function CalibrationPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16">
      <CalibrationLab />
    </main>
  );
}
