import type { Metadata } from "next";
import { modules } from "@/data/modules";
import HomePathSection from "@/components/home/HomePathSection";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Learn",
  description:
    "Five short modules: architecture basics, leveling dimensions, IC/manager/exec tracks, calibration, pay transparency.",
});

export default function LearnPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16">
      <section>
        <p
          className="text-xs font-medium uppercase tracking-[0.32em]"
          style={{ color: "var(--accent)" }}
        >
          Learn
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          Pick a starting point.
        </h1>
        <p className="mt-5 max-w-3xl leading-7" style={{ color: "var(--muted)" }}>
          Five short modules. Pick the task you showed up to do and the
          grid leads with what helps that task. Skip the picker if
          you&apos;d rather read in order.
        </p>
      </section>

      <div className="mt-10">
        <HomePathSection modules={modules} />
      </div>
    </main>
  );
}
