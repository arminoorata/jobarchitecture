import { glossaryTerms } from "@/data/architecture";

export const metadata = {
  title: "Glossary",
  description:
    "Plain-language job architecture glossary for managers and HRBPs.",
};

export default function GlossaryPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
      <section>
        <p
          className="text-xs font-medium uppercase tracking-[0.32em]"
          style={{ color: "var(--accent)" }}
        >
          Glossary
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          Plain language for architecture conversations.
        </h1>
        <p className="mt-5 max-w-3xl leading-7" style={{ color: "var(--muted)" }}>
          Use these terms to keep manager conversations clear. The goal is not
          jargon fluency. The goal is consistent decisions.
        </p>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2" aria-label="Glossary terms">
        {glossaryTerms.map((term) => (
          <article
            key={term.term}
            className="rounded-[var(--radius-card)] border p-5"
            style={{
              borderColor: "var(--line)",
              background: "var(--surface)",
            }}
          >
            <h2 className="text-xl font-semibold tracking-tight">{term.term}</h2>
            <p className="mt-3 text-sm leading-6" style={{ color: "var(--muted)" }}>
              {term.plain}
            </p>
            <p
              className="mt-4 border-t pt-4 text-sm leading-6"
              style={{
                borderColor: "var(--line)",
                color: "var(--text-secondary)",
              }}
            >
              <span className="font-semibold" style={{ color: "var(--text)" }}>
                Use when:
              </span>{" "}
              {term.useWhen}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
