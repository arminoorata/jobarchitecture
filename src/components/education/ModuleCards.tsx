import Link from "next/link";
import { educationModules } from "@/data/architecture";

export default function ModuleCards() {
  return (
    <section aria-labelledby="modules-title">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p
            className="text-xs font-medium uppercase tracking-[0.32em]"
            style={{ color: "var(--text-muted)" }}
          >
            Education path
          </p>
          <h2 id="modules-title" className="mt-3 text-3xl font-semibold tracking-tight">
            Five modules for better job architecture conversations.
          </h2>
        </div>
        <Link
          href="/learn"
          className="inline-flex rounded-full border px-4 py-2 text-sm font-semibold"
          style={{
            borderColor: "var(--accent)",
            background: "var(--accent-soft)",
            color: "var(--text)",
          }}
        >
          Open all modules
        </Link>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        {educationModules.map((module) => (
          <article
            key={module.id}
            className="rounded-[var(--radius-card)] border p-5"
            style={{
              borderColor: "var(--line)",
              background: "var(--surface)",
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <p
                className="text-xs font-medium uppercase tracking-[0.22em]"
                style={{ color: "var(--accent)" }}
              >
                {module.minutes} min
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {module.audience}
              </p>
            </div>
            <h3 className="mt-3 text-xl font-semibold tracking-tight">
              {module.title}
            </h3>
            <p className="mt-3 text-sm leading-6" style={{ color: "var(--muted)" }}>
              {module.summary}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
