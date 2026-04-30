import { sourceNotes } from "@/data/architecture";

export const metadata = {
  title: "Methodology",
  description:
    "How the scoring works, what the confidence rating means, sources, and limitations.",
};

type TocEntry = { id: string; label: string };

const tocEntries: TocEntry[] = [
  { id: "purpose", label: "What this tool is for (and isn't)" },
  { id: "scoring", label: "Scoring model" },
  { id: "confidence", label: "Confidence rating" },
  { id: "boundary", label: "Boundary detection" },
  { id: "flags", label: "Sanity flags" },
  { id: "sources", label: "Sources" },
  { id: "limitations", label: "Limitations" },
  { id: "radford-aon", label: "Radford / Aon-friendly usage" },
  { id: "disclaimer", label: "Disclaimer" },
];

export default function MethodologyPage() {
  return (
    <main className="mx-auto max-w-[720px] px-6 py-12 md:px-10 md:py-16">
      <header>
        <p
          className="text-xs font-medium uppercase tracking-[0.32em]"
          style={{ color: "var(--accent)" }}
        >
          Methodology
        </p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          How this tool produces an answer, and where it stops.
        </h1>
        <p className="mt-5 leading-7" style={{ color: "var(--muted)" }}>
          The summary below covers the model in plain English. The full math,
          edge cases, and worked examples live in the{" "}
          <a
            href="#engine-reference-note"
            className="underline underline-offset-4"
            style={{ color: "var(--text)" }}
          >
            engine reference
          </a>
          .
        </p>
      </header>

      <nav
        aria-label="On this page"
        className="mt-8 rounded-[var(--radius-card)] border p-4 md:p-5"
        style={{ borderColor: "var(--line)", background: "var(--surface)" }}
      >
        <p
          className="text-xs font-medium uppercase tracking-[0.24em]"
          style={{ color: "var(--text-muted)" }}
        >
          On this page
        </p>
        <ol className="mt-3 grid gap-2 text-sm leading-6 md:grid-cols-2">
          {tocEntries.map((entry, i) => (
            <li key={entry.id} className="flex gap-2">
              <span
                className="mono text-xs"
                style={{ color: "var(--text-muted)" }}
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <a
                href={`#${entry.id}`}
                className="underline underline-offset-4"
                style={{ color: "var(--text)" }}
              >
                {entry.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <section className="mt-12" aria-labelledby="purpose">
        <h2
          id="purpose"
          className="text-2xl font-semibold tracking-tight md:text-3xl"
        >
          What this tool is for (and isn&apos;t)
        </h2>
        <p className="mt-4 leading-7" style={{ color: "var(--text)" }}>
          This is a directional education tool for HRBPs, managers, and Total
          Rewards leaders who want a credible way to teach job architecture and
          prepare better leveling intake. It is not a final pay or compensation
          decision engine, and it does not reproduce proprietary Radford,
          Mercer, or WTW level descriptors, point-factor methods, survey job
          descriptions, or job codes.
        </p>
      </section>

      <section className="mt-12" aria-labelledby="scoring">
        <h2
          id="scoring"
          className="text-2xl font-semibold tracking-tight md:text-3xl"
        >
          Scoring model
        </h2>
        <p className="mt-4 leading-7" style={{ color: "var(--text)" }}>
          The wizard asks about six core dimensions of a role: scope,
          complexity, autonomy, influence, knowledge, and business impact. Each
          dimension has a 7-point scale.
        </p>
        <p className="mt-4 leading-7" style={{ color: "var(--text)" }}>
          The engine averages the six. Manager-track roles add a seventh
          dimension (people leadership) at 20% weight. Executive-track roles
          add a seventh (strategy ownership) at 30% weight. The weighted score
          maps to a level on the IC, manager, or executive ladder. Bands are
          documented in the engine reference.
        </p>
      </section>

      <section className="mt-12" aria-labelledby="confidence">
        <h2
          id="confidence"
          className="text-2xl font-semibold tracking-tight md:text-3xl"
        >
          Confidence rating
        </h2>
        <p className="mt-4 leading-7" style={{ color: "var(--text)" }}>
          Confidence is the standard deviation of your dimension scores. If
          your scores agree closely, confidence is high. If they&apos;re
          scattered, confidence is low. Low confidence usually means the role
          is a hybrid, a stretch, or a boundary case worth talking about in
          calibration.
        </p>
      </section>

      <section className="mt-12" aria-labelledby="boundary">
        <h2
          id="boundary"
          className="text-2xl font-semibold tracking-tight md:text-3xl"
        >
          Boundary detection
        </h2>
        <p className="mt-4 leading-7" style={{ color: "var(--text)" }}>
          If the weighted score sits within 0.2 of an adjacent level threshold,
          the result flags the boundary (e.g., &quot;P4 (boundary P3/P4)&quot;).
          The level you see is the band the score actually falls in. The
          boundary tells you that small shifts in evidence could move it.
        </p>
      </section>

      <section className="mt-12" aria-labelledby="flags">
        <h2
          id="flags"
          className="text-2xl font-semibold tracking-tight md:text-3xl"
        >
          Sanity flags
        </h2>
        <p className="mt-4 leading-7" style={{ color: "var(--text)" }}>
          Flags are informational. They don&apos;t block the result. They
          surface when something in the inputs looks inconsistent: an autonomy
          score far higher than complexity, a people-leadership score with a
          narrow scope, an executive selection with low strategy ownership, or
          scores that vary widely across dimensions. Each flag suggests
          something worth a second look in calibration.
        </p>
      </section>

      <section className="mt-12" aria-labelledby="sources">
        <h2
          id="sources"
          className="text-2xl font-semibold tracking-tight md:text-3xl"
        >
          Sources
        </h2>
        <ol className="mt-5 grid gap-4">
          {sourceNotes.map((source, i) => {
            const anchorId = source.id ? `sources-${source.id}` : undefined;
            return (
              <li
                key={source.href}
                id={anchorId}
                className="rounded-[var(--radius-card)] border p-5"
                style={{
                  borderColor: "var(--line)",
                  background: "var(--surface)",
                }}
              >
                <p className="flex items-baseline gap-3">
                  <span
                    className="mono text-xs"
                    style={{ color: "var(--text-muted)" }}
                    aria-hidden="true"
                  >
                    [{i + 1}]
                  </span>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-semibold underline underline-offset-4"
                    style={{ color: "var(--text)" }}
                  >
                    {source.label}
                  </a>
                </p>
                <p
                  className="mt-3 text-xs font-medium uppercase tracking-[0.18em]"
                  style={{ color: "var(--text-muted)" }}
                >
                  Why I cite it
                </p>
                <p
                  className="mt-1 text-sm leading-6"
                  style={{ color: "var(--muted)" }}
                >
                  {source.note}
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-12" aria-labelledby="limitations">
        <h2
          id="limitations"
          className="text-2xl font-semibold tracking-tight md:text-3xl"
        >
          Limitations
        </h2>
        <p className="mt-4 leading-7" style={{ color: "var(--text)" }}>
          Limitations:
        </p>
        <ol
          className="mt-3 list-decimal space-y-3 pl-6 leading-7"
          style={{ color: "var(--text)" }}
        >
          <li>
            The dimensions are a working model. Your company&apos;s real
            architecture may use four dimensions, or eight, or different ones
            entirely.
          </li>
          <li>
            The level bands reflect common-market shapes. P4 here is a
            directional pointer, and your company&apos;s P4 may sit somewhere
            else on the same shape.
          </li>
          <li>
            The engine never sees your company&apos;s salary structure. Pay
            range design is a different decision and requires licensed market
            data.
          </li>
          <li>
            Sanity flags catch obvious inconsistencies. They miss subtle ones.
            Calibration still beats automation for boundary cases.
          </li>
        </ol>
      </section>

      <section className="mt-12" aria-labelledby="radford-aon">
        <h2
          id="radford-aon"
          className="text-2xl font-semibold tracking-tight md:text-3xl"
        >
          Radford / Aon-friendly usage
        </h2>
        <p className="mt-4 leading-7" style={{ color: "var(--text)" }}>
          Use this tool to start the conversation. For the actual job matching,
          market pricing, peer-group construction, and pay range design that
          production Total Rewards work requires, you&apos;ll want licensed
          Radford or Aon resources (or your survey provider of choice). The
          tool intentionally does not reproduce proprietary level descriptors,
          point-factor methods, or survey job content.
        </p>
      </section>

      <section className="mt-12" aria-labelledby="disclaimer">
        <h2
          id="disclaimer"
          className="text-2xl font-semibold tracking-tight md:text-3xl"
        >
          Disclaimer
        </h2>
        <p className="mt-4 leading-7" style={{ color: "var(--text)" }}>
          This tool provides directional job architecture education and a
          directional level recommendation based on general market practices.
          It is intended for guidance only and should be used alongside
          internal calibration, licensed market data, and professional
          judgment. It does not reproduce proprietary Radford, Mercer, WTW, or
          other survey-provider methodology, and it is not a compensation,
          legal, compliance, or final decision engine.
        </p>
      </section>

      <details
        id="engine-reference-note"
        className="mt-12 rounded-[var(--radius-card)] border p-5"
        style={{ borderColor: "var(--line)", background: "var(--surface)" }}
      >
        <summary
          className="cursor-pointer text-sm font-medium"
          style={{ color: "var(--text)" }}
        >
          About the engine reference
        </summary>
        <p
          className="mt-3 text-sm leading-6"
          style={{ color: "var(--muted)" }}
        >
          See the engine reference in the project repository for full math,
          edge cases, and worked examples.
        </p>
      </details>
    </main>
  );
}
