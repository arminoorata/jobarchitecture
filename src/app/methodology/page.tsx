import Link from "next/link";
import { sourceNotes } from "@/data/architecture";
import { levelMaps } from "@/lib/leveling";

export const metadata = {
  title: "Methodology",
  description:
    "Methodology, sources, and limitations for the Job Architecture Toolkit.",
};

export default function MethodologyPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
      <section>
        <p
          className="text-xs font-medium uppercase tracking-[0.32em]"
          style={{ color: "var(--accent)" }}
        >
          Methodology
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          Built to educate managers and improve intake quality.
        </h1>
        <p className="mt-5 max-w-3xl leading-7" style={{ color: "var(--muted)" }}>
          This toolkit uses public Aon/Radford concepts as a positive example
          of how mature job architecture connects work, levels, market data,
          and governance. It does not copy proprietary level guides, survey job
          descriptions, point-factor methods, or licensed content.
        </p>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3" aria-label="Method summary">
        {[
          [
            "Education",
            "Manager-friendly modules explain architecture, tracks, leveling dimensions, calibration, and pay transparency readiness.",
          ],
          [
            "Scoring",
            "The wizard averages six common dimensions, then applies a light track-specific weighting for people leadership or strategy ownership.",
          ],
          [
            "Governance",
            "Results are directional and designed to feed internal calibration, not replace it.",
          ],
        ].map(([title, body]) => (
          <article
            key={title}
            className="rounded-[var(--radius-card)] border p-5"
            style={{
              borderColor: "var(--line)",
              background: "var(--surface)",
            }}
          >
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-3 text-sm leading-6" style={{ color: "var(--muted)" }}>
              {body}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-12" aria-labelledby="scoring-title">
        <h2 id="scoring-title" className="text-3xl font-semibold tracking-tight">
          Scoring model
        </h2>
        <div className="mt-5 space-y-5 leading-7" style={{ color: "var(--muted)" }}>
          <p>
            Core dimensions are scope of impact, problem complexity, autonomy,
            influence, knowledge depth, and business impact. Each is scored from
            1 to 7 using plain-language options.
          </p>
          <p>
            Manager recommendations weight the six-dimension average at 80%
            and people leadership at 20%. Executive recommendations weight the
            six-dimension average at 70% and strategy ownership at 30%.
          </p>
          <p>
            Confidence is based on standard deviation across the selected
            dimensions. Scores within 0.2 of a level threshold are shown as
            boundary cases.
          </p>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {Object.entries(levelMaps).map(([track, ranges]) => (
            <article
              key={track}
              className="rounded-[var(--radius-card)] border p-5"
              style={{
                borderColor: "var(--line)",
                background: "var(--surface)",
              }}
            >
              <h3 className="capitalize font-semibold">{track}</h3>
              <div className="mt-4 grid gap-2 text-sm">
                {ranges.map((range) => (
                  <div
                    key={range.code}
                    className="flex items-center justify-between gap-4"
                  >
                    <span>{range.code}</span>
                    <span className="mono" style={{ color: "var(--text-muted)" }}>
                      {range.min.toFixed(1)}-{range.max.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="sources-title">
        <h2 id="sources-title" className="text-3xl font-semibold tracking-tight">
          Public sources used
        </h2>
        <div className="mt-5 grid gap-4">
          {sourceNotes.map((source) => (
            <article
              key={source.href}
              className="rounded-[var(--radius-card)] border p-5"
              style={{
                borderColor: "var(--line)",
                background: "var(--surface)",
              }}
            >
              <h3 className="font-semibold">
                <Link
                  href={source.href}
                  className="underline underline-offset-4"
                  style={{ color: "var(--text)" }}
                >
                  {source.label}
                </Link>
              </h3>
              <p className="mt-3 text-sm leading-6" style={{ color: "var(--muted)" }}>
                {source.note}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="mt-12 rounded-[var(--radius-card)] border p-6"
        style={{
          borderColor: "var(--accent)",
          background: "var(--accent-soft)",
        }}
      >
        <h2 className="text-2xl font-semibold tracking-tight">
          Radford/Aon-friendly use
        </h2>
        <p className="mt-4 leading-7" style={{ color: "var(--muted)" }}>
          The recommended production workflow is to use this toolkit to educate
          managers and structure intake, then use licensed Radford/Aon tools,
          survey participation, job matching, peer groups, and consulting
          support for formal market pricing and architecture governance.
        </p>
      </section>
    </main>
  );
}
