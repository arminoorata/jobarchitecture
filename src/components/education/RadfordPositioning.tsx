import Link from "next/link";

export default function RadfordPositioning() {
  return (
    <section
      aria-labelledby="radford-positioning-title"
      className="rounded-[var(--radius-card)] border p-6 md:p-8"
      style={{
        borderColor: "var(--line)",
        background: "var(--surface)",
      }}
    >
      <p
        className="text-xs font-medium uppercase tracking-[0.32em]"
        style={{ color: "var(--accent)" }}
      >
        Radford/Aon stance
      </p>
      <h2
        id="radford-positioning-title"
        className="mt-4 text-3xl font-semibold tracking-tight"
      >
        Use this as the prep room, not the licensed methodology.
      </h2>
      <div className="mt-5 grid gap-5 text-sm leading-6 md:grid-cols-3">
        <div>
          <p className="font-semibold">What this tool does</p>
          <p className="mt-2" style={{ color: "var(--muted)" }}>
            Teaches leaders how to reason about job architecture, job size,
            and calibration using general market practices.
          </p>
        </div>
        <div>
          <p className="font-semibold">What Radford/Aon does better</p>
          <p className="mt-2" style={{ color: "var(--muted)" }}>
            Provides licensed survey data, job libraries, market matching,
            peer groups, and proprietary evaluation support for formal programs.
          </p>
        </div>
        <div>
          <p className="font-semibold">How to use both</p>
          <p className="mt-2" style={{ color: "var(--muted)" }}>
            Use this for manager education and intake quality. Use Radford/Aon
            for production job matching, market pricing, and governance.
          </p>
        </div>
      </div>
      <Link
        href="/methodology"
        className="mt-6 inline-flex rounded-full border px-4 py-2 text-sm font-semibold"
        style={{
          borderColor: "var(--line)",
          color: "var(--text)",
        }}
      >
        See methodology and sources
      </Link>
    </section>
  );
}
