import { modules } from "@/data/modules";

export const metadata = {
  title: "Learn",
  description:
    "Job architecture education modules for managers, HRBPs, and Total Rewards leaders.",
};

export default function LearnPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
      <section>
        <p
          className="text-xs font-medium uppercase tracking-[0.32em]"
          style={{ color: "var(--accent)" }}
        >
          Learn
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          A practical curriculum for job architecture conversations.
        </h1>
        <p className="mt-5 max-w-3xl leading-7" style={{ color: "var(--muted)" }}>
          These modules are written for manager enablement. They give leaders
          enough structure to make better requests without turning them into
          compensation specialists.
        </p>
      </section>

      <div className="mt-10 space-y-8">
        {modules.map((module) => (
          <article
            key={module.id}
            id={module.id}
            className="rounded-[var(--radius-card)] border p-6 md:p-8"
            style={{
              borderColor: "var(--line)",
              background: "var(--surface)",
            }}
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p
                  className="text-xs font-medium uppercase tracking-[0.28em]"
                  style={{ color: "var(--accent)" }}
                >
                  {module.minutes} min module
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                  {module.title}
                </h2>
              </div>
              <p
                className="max-w-xs text-sm leading-6 md:text-right"
                style={{ color: "var(--text-muted)" }}
              >
                {module.audience}
              </p>
            </div>
            <p className="mt-4 max-w-3xl leading-7" style={{ color: "var(--muted)" }}>
              {module.blurb}
            </p>

            <div className="mt-8 space-y-6">
              {module.sections.map((section) => {
                const previewText = section.blocks
                  .filter(
                    (block): block is Extract<typeof block, { type: "paragraph" }> =>
                      block.type === "paragraph",
                  )
                  .map((block) => block.text)
                  .join(" ");
                return (
                  <section key={section.id}>
                    <h3 className="text-xl font-semibold tracking-tight">
                      {section.heading}
                    </h3>
                    {previewText ? (
                      <p className="mt-3 leading-7" style={{ color: "var(--muted)" }}>
                        {previewText}
                      </p>
                    ) : null}
                  </section>
                );
              })}
            </div>

            <div className="mt-8 border-t pt-6" style={{ borderColor: "var(--line)" }}>
              <p className="text-sm font-semibold">Take these to your next conversation</p>
              <ul className="mt-3 grid gap-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
                {module.questions.map((question) => (
                  <li key={question}>- {question}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
